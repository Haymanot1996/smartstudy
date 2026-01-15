/**
 * SmartStudy - Main Application Logic
 */

// Auth Check
const checkAuth = () => {
    const token = localStorage.getItem('ss_token');
    if (!token && !window.location.pathname.includes('/auth/')) {
        window.location.href = './auth/index.html';
        return false;
    }
    return true;
};

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;

    // Load user info
    const user = JSON.parse(localStorage.getItem('ss_user'));
    if (user) {
        document.querySelectorAll('.student-name-display').forEach(el => el.textContent = user.name.split(' ')[0]);
        document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('.user-info .user-dept').forEach(el => el.textContent = user.studentId);
        document.querySelectorAll('.avatar-circle').forEach(el => el.textContent = user.name.charAt(0).toUpperCase());
    }

    // --- 1. DOM Elements ---
    const pageTitle = document.getElementById('current-page-title');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');

    // Topbar & Notification Elements
    const themeBtn = document.getElementById('theme-switcher');
    const bellBtn = document.getElementById('notification-trigger');
    const notificationMenu = document.getElementById('notification-menu');
    const notificationList = document.querySelector('.notification-list');
    const badge = document.querySelector('.badge');

    // --- 2. Initialize Data & Initial Render ---
    if (pageTitle) pageTitle.textContent = "Loading...";

    const success = await DataStore.init();
    if (!success) {
        alert("Data failed to load. Please check if your server is running.");
        return;
    }

    if (pageTitle) pageTitle.textContent = "Dashboard";
    const appData = DataStore.get();

    // Initial UI Renders
    Render.dashboard(appData);
    syncNotificationUI(appData); // Sync the badge and list on load

    // --- 3. Sidebar Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;

            // Update Sidebar Active State
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update Topbar Title
            const title = item.querySelector('span').textContent;
            pageTitle.textContent = title;

            // Section Switching Logic
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.remove('hidden');
                    sec.classList.add('active', 'fade-in');

                    // Render specific content for the section
                    const currentData = DataStore.get();
                    if (targetId !== 'dashboard') {
                        if (typeof Render[targetId] === 'function') {
                            sec.innerHTML = Render[targetId](currentData);
                        }
                    }

                    lucide.createIcons();
                } else {
                    sec.classList.add('hidden');
                    sec.classList.remove('active', 'fade-in');
                }
            });
        });
    });

    // --- 4. Theme Toggle Logic ---
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            const icon = themeBtn.querySelector('i');
            const isDark = document.body.classList.contains('dark-mode');

            icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
            lucide.createIcons();
        });
    }

    // --- 5. Notification Logic (Dropdown & Badge) ---
    function syncNotificationUI(data) {
        if (!notificationList) return; // Guard clause

        // If your data.js has a notifications array, use it. 
        // Otherwise, we calculate based on existing HTML items.
        const items = notificationList.querySelectorAll('.notification-item');
        const count = items.length;

        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    if (bellBtn && notificationMenu) {
        // Toggle Menu
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationMenu.classList.toggle('hidden');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationMenu.contains(e.target) && e.target !== bellBtn) {
                notificationMenu.classList.add('hidden');
            }
        });

        // Clear All Functionality
        const clearBtn = notificationMenu.querySelector('.btn-text-small');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                notificationList.innerHTML = '<div class="empty-state">No new notifications</div>';
                syncNotificationUI(); // This will set badge to 0 and hide it
            });
        }
    }

    // --- 6. Search Bar Logic ---
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                console.log("Searching for:", searchInput.value);
            }
        });
    }
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 1. Clear Local Storage
            localStorage.removeItem('ss_token');
            localStorage.removeItem('ss_user');

            // 2. Redirect to Login
            window.location.href = './auth/index.html';
        });
    }

    // --- 7. Global Event Handling for CRUD ---
    document.addEventListener('click', async (e) => {
        const currentData = DataStore.get();
        const target = e.target.closest('button, input[type="checkbox"]');
        if (!target) return;

        // Profile Edit Toggles
        if (target.id === 'edit-profile-btn') {
            const section = document.getElementById('profile');
            section.innerHTML = Render.profile(currentData, true);
        }

        if (target.id === 'cancel-profile-edit') {
            const section = document.getElementById('profile');
            section.innerHTML = Render.profile(currentData, false);
            lucide.createIcons();
        }

        if (target.id === 'save-profile-edit') {
            const form = document.getElementById('profile-edit-form');
            const formData = new FormData(form);

            // We only update Dept and Year. Name/ID are from User model (read-only in this context)
            const updatedProfile = {
                ...currentData.profile,
                dept: formData.get('dept'),
                year: formData.get('year')
            };

            await DataStore.updateSlice('profile', updatedProfile);
            const section = document.getElementById('profile');
            section.innerHTML = Render.profile(DataStore.get(), false);
            lucide.createIcons();
        }

        // To-Do Logic
        if (target.id === 'add-todo-btn') {
            const input = document.getElementById('new-todo-input');
            const text = input.value.trim();
            if (text) {
                const newTodos = [...currentData.todos, { id: Date.now(), text, done: false }];
                await DataStore.updateSlice('todos', newTodos);
                const section = document.getElementById('todo');
                section.innerHTML = Render.todo(DataStore.get());
                lucide.createIcons();
            }
        }

        if (target.classList.contains('todo-checkbox')) {
            const id = parseInt(target.dataset.id);
            const newTodos = currentData.todos.map(t => t.id === id ? { ...t, done: target.checked } : t);
            await DataStore.updateSlice('todos', newTodos);
        }

        if (target.classList.contains('delete-todo-btn')) {
            const id = parseInt(target.dataset.id);
            const newTodos = currentData.todos.filter(t => t.id !== id);
            await DataStore.updateSlice('todos', newTodos);
            const section = document.getElementById('todo');
            section.innerHTML = Render.todo(DataStore.get());
            lucide.createIcons();
        }

        // Form Toggles
        if (target.id === 'toggle-assignment-form') {
            document.getElementById('assignment-form-container').classList.toggle('hidden');
        }
        if (target.id === 'toggle-schedule-form') {
            document.getElementById('schedule-form-container').classList.toggle('hidden');
        }
        if (target.id === 'toggle-expense-form') {
            document.getElementById('expense-form-container').classList.toggle('hidden');
        }
        if (target.id === 'toggle-event-form') {
            document.getElementById('event-form-container').classList.toggle('hidden');
        }
        if (target.id === 'toggle-note-form') {
            document.getElementById('note-form-container').classList.toggle('hidden');
        }

        // Save Note
        if (target.id === 'save-note-btn') {
            const btn = target;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const titleInput = document.getElementById('note-title');
            const contentInput = document.getElementById('note-content');

            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            if (title && content) {
                const newNotes = [...(currentData.notes || []), {
                    id: Date.now(),
                    title,
                    content,
                    date: new Date().toLocaleDateString()
                }];
                await DataStore.updateSlice('notes', newNotes);

                titleInput.value = '';
                contentInput.value = '';
                document.getElementById('note-form-container').classList.add('hidden');

                const section = document.getElementById('notes');
                section.innerHTML = Render.notes(DataStore.get());
                lucide.createIcons();
            }
            btn.textContent = originalText;
            btn.disabled = false;
        }

        if (target.classList.contains('delete-note-btn')) {
            const id = parseInt(target.dataset.id);
            const newNotes = currentData.notes.filter(n => n.id !== id);
            await DataStore.updateSlice('notes', newNotes);
            const section = document.getElementById('notes');
            section.innerHTML = Render.notes(DataStore.get());
            lucide.createIcons();
        }

        // Save Assignment
        if (target.id === 'save-assignment-btn') {
            const btn = target;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const titleInput = document.getElementById('assign-title');
            const courseInput = document.getElementById('assign-course');
            const dueInput = document.getElementById('assign-due');
            const priorityInput = document.getElementById('assign-priority');

            const title = titleInput.value.trim();
            const course = courseInput.value.trim() || 'General';
            const due = dueInput.value || new Date().toISOString().split('T')[0];
            const priority = priorityInput.value || 'Medium';

            if (title) {
                const newAssignments = [...currentData.assignments, {
                    id: Date.now(),
                    title,
                    course,
                    due,
                    priority,
                    status: "Pending"
                }];
                await DataStore.updateSlice('assignments', newAssignments);

                titleInput.value = '';
                courseInput.value = '';
                priorityInput.value = '';
                document.getElementById('assignment-form-container').classList.add('hidden');

                const section = document.getElementById('assignments');
                section.innerHTML = Render.assignments(DataStore.get());
                lucide.createIcons();
            }
            btn.textContent = originalText;
            btn.disabled = false;
        }

        if (target.classList.contains('toggle-assignment-btn')) {
            const id = parseInt(target.dataset.id);
            const newAssignments = currentData.assignments.map(a =>
                a.id === id ? { ...a, status: a.status === 'Pending' ? 'Completed' : 'Pending' } : a
            );
            await DataStore.updateSlice('assignments', newAssignments);
            const section = document.getElementById('assignments');
            section.innerHTML = Render.assignments(DataStore.get());
            lucide.createIcons();
        }

        if (target.classList.contains('delete-assignment-btn')) {
            const id = parseInt(target.dataset.id);
            const newAssignments = currentData.assignments.filter(a => a.id !== id);
            await DataStore.updateSlice('assignments', newAssignments);
            const section = document.getElementById('assignments');
            section.innerHTML = Render.assignments(DataStore.get());
            lucide.createIcons();
        }

        // Save Expense
        if (target.id === 'save-expense-btn') {
            const btn = target;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const titleInput = document.getElementById('exp-title');
            const amountInput = document.getElementById('exp-amount');
            const catInput = document.getElementById('exp-cat');

            const title = titleInput.value.trim();
            const amount = parseFloat(amountInput.value);
            const category = catInput.value.trim() || 'General';

            if (title && !isNaN(amount)) {
                const newExpenses = [...currentData.expenses, {
                    id: Date.now(),
                    title,
                    amount,
                    date: new Date().toISOString().split('T')[0],
                    category
                }];
                await DataStore.updateSlice('expenses', newExpenses);

                titleInput.value = '';
                amountInput.value = '';
                catInput.value = '';
                document.getElementById('expense-form-container').classList.add('hidden');

                const section = document.getElementById('expenses');
                section.innerHTML = Render.expenses(DataStore.get());
                lucide.createIcons();
            }
            btn.textContent = originalText;
            btn.disabled = false;
        }

        if (target.classList.contains('delete-expense-btn')) {
            const id = parseInt(target.dataset.id);
            const newExpenses = currentData.expenses.filter(e => e.id !== id);
            await DataStore.updateSlice('expenses', newExpenses);
            const section = document.getElementById('expenses');
            section.innerHTML = Render.expenses(DataStore.get());
            lucide.createIcons();
        }

        // Save Event
        if (target.id === 'save-event-btn') {
            const btn = target;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const titleInput = document.getElementById('ev-title');
            const locInput = document.getElementById('ev-loc');
            const dateInput = document.getElementById('ev-date');

            const title = titleInput.value.trim();
            const location = locInput.value.trim() || 'Campus';
            const date = dateInput.value.trim() || 'TBD';

            if (title) {
                const newEvents = [...currentData.events, {
                    id: Date.now(),
                    title,
                    location,
                    date
                }];
                await DataStore.updateSlice('events', newEvents);

                titleInput.value = '';
                locInput.value = '';
                dateInput.value = '';
                document.getElementById('event-form-container').classList.add('hidden');

                const section = document.getElementById('events');
                section.innerHTML = Render.events(DataStore.get());
                lucide.createIcons();
            }
            btn.textContent = originalText;
            btn.disabled = false;
        }

        if (target.classList.contains('delete-event-btn')) {
            const id = parseInt(target.dataset.id);
            const newEvents = currentData.events.filter(e => e.id !== id);
            await DataStore.updateSlice('events', newEvents);
            const section = document.getElementById('events');
            section.innerHTML = Render.events(DataStore.get());
            lucide.createIcons();
        }

        // Save Schedule
        if (target.id === 'save-schedule-btn') {
            const btn = target;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const courseInput = document.getElementById('sched-course');
            const dayInput = document.getElementById('sched-day');
            const timeInput = document.getElementById('sched-time');
            const roomInput = document.getElementById('sched-room');

            const course = courseInput.value.trim();
            const day = dayInput.value;
            const time = timeInput.value.trim();
            const room = roomInput.value.trim() || 'TBD';

            if (course && day && time) {
                const newSchedule = [...currentData.schedule, {
                    course,
                    day,
                    time,
                    room,
                    type: "Lecture"
                }];
                await DataStore.updateSlice('schedule', newSchedule);

                courseInput.value = '';
                timeInput.value = '';
                document.getElementById('schedule-form-container').classList.add('hidden');

                const section = document.getElementById('schedule');
                section.innerHTML = Render.schedule(DataStore.get());
                lucide.createIcons();
            }
            btn.textContent = originalText;
            btn.disabled = false;
        }

        if (target.classList.contains('delete-schedule-btn')) {
            const { course, day, time } = target.dataset;
            const newSchedule = currentData.schedule.filter(s => !(s.course === course && s.day === day && s.time === time));
            await DataStore.updateSlice('schedule', newSchedule);
            const section = document.getElementById('schedule');
            section.innerHTML = Render.schedule(DataStore.get());
            lucide.createIcons();
        }
    });

    // Reactive Updates from other tabs or actions
    window.addEventListener('dataUpdated', (e) => {
        const currentData = e.detail;
        const activeSection = document.querySelector('.view-section.active');
        if (activeSection && activeSection.id !== 'dashboard') {
            if (typeof Render[activeSection.id] === 'function') {
                activeSection.innerHTML = Render[activeSection.id](currentData);
                lucide.createIcons();
            }
        }
        Render.dashboard(currentData);
    });
});