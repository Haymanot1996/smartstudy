/**
 * Rendering Logic
 * Handles DOM updates based on data.
 */

const Render = {
    dashboard(data) {
        // Update User Name from LocalStorage
        const user = JSON.parse(localStorage.getItem('ss_user')) || {};
        const displayName = user.name ? user.name.split(' ')[0] : (data.profile.name ? data.profile.name.split(' ')[0] : 'Student');

        document.querySelectorAll('.student-name-display').forEach(el => {
            el.textContent = displayName;
        });

        // Update Stats
        const attendanceEl = document.querySelector('.stat-card:nth-child(1) .value');
        const tasksEl = document.querySelector('.stat-card:nth-child(2) .value');

        if (attendanceEl) attendanceEl.textContent = (data.profile.attendance || '0') + '%';

        if (tasksEl) {
            const completed = data.todos ? data.todos.filter(t => t.done).length : 0;
            const total = data.todos ? data.todos.length : 0;
            tasksEl.textContent = `${completed}/${total}`;
        }

        // Render Dashboard Schedule (Next 3 classes)
        const scheduleList = document.getElementById('dashboard-schedule-list');
        if (scheduleList) {
            scheduleList.innerHTML = '';
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            // For demo, just show all or filter by day implementation
            const upcoming = data.schedule.slice(0, 3); // Just taking first 3 for demo

            if (upcoming.length === 0) {
                scheduleList.innerHTML = '<div class="empty-state">No classes today!</div>';
            } else {
                upcoming.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'list-item';
                    el.innerHTML = `
                        <div style="flex: 1">
                            <h4 style="font-size: 0.95rem; font-weight: 600;">${item.course}</h4>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${item.time} • ${item.room}</p>
                        </div>
                        <span class="badge" style="position: static; background: var(--bg-card); color: var(--text-main); font-size: 0.7rem; padding: 2px 8px; width: auto; height: auto; border: 1px solid var(--border-glass)">${item.type}</span>
                    `;
                    scheduleList.appendChild(el);
                });
            }
        }

        // Render Dashboard Todo (First 3)
        const todoList = document.getElementById('dashboard-todo-list');
        if (todoList) {
            todoList.innerHTML = '';
            const pendingTodos = data.todos.slice(0, 4);

            pendingTodos.forEach(todo => {
                const el = document.createElement('div');
                el.className = 'list-item';
                el.style.justifyContent = 'space-between';
                el.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" ${todo.done ? 'checked' : ''} disabled>
                        <span style="${todo.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${todo.text}</span>
                    </div>
                `;
                todoList.appendChild(el);
            });
        }
    },

    profile(data, isEditing = false) {
        // Get user info from localStorage to ensure we show the logged-in user's details
        const user = JSON.parse(localStorage.getItem('ss_user')) || {};
        const displayName = user.name || data.profile.name || 'Student';
        const displayId = user.studentId || data.profile.id || 'N/A';
        const displayAvatar = user.name ? user.name.charAt(0).toUpperCase() : '?';

        if (isEditing) {
            return `
            <div class="glass-card fade-in">
                <div class="card-header">
                    <h3>Edit Profile</h3>
                    <div style="display: flex; gap: 10px;">
                         <button class="btn-text" id="cancel-profile-edit">Cancel</button>
                         <button class="btn-primary" id="save-profile-edit">Save Changes</button>
                    </div>
                </div>
                <form id="profile-edit-form" style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label style="color: var(--text-muted); font-size: 0.85rem;">Full Name (Read Only)</label>
                            <input type="text" value="${displayName}" class="glass-input" disabled style="opacity: 0.7;">
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-muted); font-size: 0.85rem;">Student ID (Read Only)</label>
                            <input type="text" value="${displayId}" class="glass-input" disabled style="opacity: 0.7;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label>Department</label>
                            <input type="text" name="dept" value="${data.profile.dept || ''}" class="glass-input" placeholder="e.g. Computer Science">
                        </div>
                         <div class="form-group">
                            <label>Current Year</label>
                            <input type="text" name="year" value="${data.profile.year || ''}" class="glass-input" placeholder="e.g. 3rd Year">
                        </div>
                    </div>
                </form>
            </div>`;
        }

        return `
        <div class="glass-card fade-in">
            <div class="card-header">
                <h3>Student Profile</h3> 
                <button class="btn-primary" id="edit-profile-btn"><i data-lucide="edit-2"></i> Edit</button>
            </div>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 24px; align-items: center;">
                <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--gradient-main); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; font-weight: 700;">
                    ${displayAvatar}
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div>
                        <label style="color: var(--text-muted); font-size: 0.85rem; display: block; margin-bottom: 4px;">Full Name</label>
                        <div style="font-size: 1.2rem; font-weight: 600;">${displayName}</div>
                    </div>
                    <div>
                        <label style="color: var(--text-muted); font-size: 0.85rem; display: block; margin-bottom: 4px;">Student ID</label>
                        <div style="font-size: 1.2rem; font-weight: 600;">${displayId}</div>
                    </div>
                    <div>
                        <label style="color: var(--text-muted); font-size: 0.85rem; display: block; margin-bottom: 4px;">Department</label>
                        <div style="font-size: 1.2rem; font-weight: 600;">${data.profile.dept || 'Not set'}</div>
                    </div>
                     <div>
                        <label style="color: var(--text-muted); font-size: 0.85rem; display: block; margin-bottom: 4px;">Current Year</label>
                        <div style="font-size: 1.2rem; font-weight: 600;">${data.profile.year || 'Not set'}</div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    schedule(data) {
        // Simple Timetable Grid
        const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

        let headerHtml = days.map(d => `<div style="padding: 12px; font-weight: 600; text-align: center; border-bottom: 1px solid var(--border-glass);">${d}</div>`).join('');

        let gridHtml = '';
        times.forEach(time => {
            gridHtml += `<div style="padding: 12px; text-align: center; color: var(--text-muted); border-right: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass);">${time}</div>`;

            for (let i = 1; i < days.length; i++) {
                const day = days[i];
                // Find class
                const cls = data.schedule.find(s => s.day === day && s.time.startsWith(time)); // Simple matching

                if (cls) {
                    gridHtml += `
                        <div style="padding: 8px; border-bottom: 1px solid var(--border-glass); position: relative;" class="schedule-cell">
                            <div style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); padding: 8px; border-radius: 8px; font-size: 0.85rem;">
                                <div style="font-weight: 600; color: var(--primary);">${cls.course}</div>
                                <div style="font-size: 0.75rem;">${cls.room}</div>
                                <button class="delete-schedule-btn icon-btn-danger" data-course="${cls.course}" data-day="${day}" data-time="${cls.time}"><i data-lucide="x" style="width: 12px;"></i></button>
                            </div>
                        </div>
                    `;
                } else {
                    gridHtml += `<div style="border-bottom: 1px solid var(--border-glass);"></div>`;
                }
            }
        });

        return `
            <div class="glass-card fade-in">
                <div class="card-header">
                    <h3>Weekly Timetable</h3>
                    <button class="btn-primary" id="toggle-schedule-form"><i data-lucide="plus"></i> Add Class</button>
                </div>

                <div id="schedule-form-container" class="form-container hidden" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <input type="text" id="sched-course" placeholder="Course Name" class="glass-input">
                        <select id="sched-day" class="glass-input">
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                        </select>
                        <input type="text" id="sched-time" placeholder="Time (e.g. 09:00)" class="glass-input">
                        <input type="text" id="sched-room" placeholder="Room" class="glass-input" value="TBD">
                        <button class="btn-primary" id="save-schedule-btn" style="grid-column: span 2;">Save Class</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 80px repeat(5, 1fr); background: var(--bg-glass); border-radius: var(--radius-sm); border: 1px solid var(--border-glass); overflow: hidden;">
                    ${headerHtml}
                    ${gridHtml}
                </div>
            </div>
        `;
    },

    assignments(data) {
        const renderTask = (task) => `
            <div class="list-item" style="display: block; margin-bottom: 12px; position: relative;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;">${task.title}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span class="badge" style="background: ${task.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}; color: ${task.priority === 'High' ? '#fca5a5' : '#93c5fd'}; border: none;">${task.priority}</span>
                        <button class="delete-assignment-btn icon-btn-small" data-id="${task.id}" style="color: var(--danger);"><i data-lucide="trash-2" style="width: 14px;"></i></button>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
                    <span>${task.course}</span>
                    <div style="display: flex; gap: 10px;">
                        <span>Due: ${task.due}</span>
                        <button class="toggle-assignment-btn btn-text-small" data-id="${task.id}">${task.status === 'Pending' ? 'Mark Done' : 'Undo'}</button>
                    </div>
                </div>
            </div>
        `;

        const pending = data.assignments.filter(a => a.status === 'Pending').map(renderTask).join('');
        const completed = data.assignments.filter(a => a.status === 'Completed').map(renderTask).join('');

        return `
            <div class="content-grid-2-1 fade-in">
                <div class="glass-card">
                    <div class="card-header">
                        <h3>Pending Assignments</h3>
                        <button class="btn-primary" id="toggle-assignment-form"><i data-lucide="plus"></i> Add</button>
                    </div>

                    <div id="assignment-form-container" class="form-container hidden" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                        <input type="text" id="assign-title" placeholder="Assignment Title" class="glass-input" style="width: 100%; margin-bottom: 10px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="assign-course" placeholder="Course" class="glass-input">
                            <input type="date" id="assign-due" class="glass-input">
                            <select id="assign-priority" class="glass-input">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <button class="btn-primary" id="save-assignment-btn" style="width: 100%;">Create Assignment</button>
                    </div>

                    <div class="list-container">
                        ${pending || '<div class="empty-state">No pending assignments!</div>'}
                    </div>
                </div>
                
                <div class="glass-card" style="align-self: start;">
                     <div class="card-header">
                        <h3>Completed</h3>
                    </div>
                    <div class="list-container" style="opacity: 0.7;">
                        ${completed || '<div class="empty-state">No completed tasks.</div>'}
                    </div>
                </div>
            </div>
        `;
    },

    notes(data) {
        const notes = data.notes || [];
        const notesList = notes.map(note => `
            <div class="glass-panel" style="padding: 20px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <h4 style="font-size: 1.1rem; color: var(--primary);">${note.title}</h4>
                    <button class="delete-note-btn icon-btn-danger" data-id="${note.id}"><i data-lucide="trash-2" style="width: 14px;"></i></button>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5; white-space: pre-wrap;">${note.content}</p>
                <div style="margin-top: 15px; font-size: 0.75rem; color: var(--text-muted); text-align: right;">
                    ${note.date}
                </div>
            </div>
        `).join('');

        return `
            <div class="glass-card fade-in">
                <div class="card-header">
                    <h3>My Notes</h3>
                    <button class="btn-primary" id="toggle-note-form"><i data-lucide="plus"></i> New Note</button>
                </div>

                <div id="note-form-container" class="form-container hidden" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                    <input type="text" id="note-title" placeholder="Note Title" class="glass-input" style="width: 100%; margin-bottom: 10px;">
                    <textarea id="note-content" placeholder="Write your note here..." class="glass-input" style="width: 100%; height: 100px; margin-bottom: 10px; resize: vertical;"></textarea>
                    <button class="btn-primary" id="save-note-btn" style="width: 100%;">Save Note</button>
                </div>

                <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
                    ${notesList || '<div class="empty-state" style="grid-column: 1/-1;">No notes yet. Click "New Note" to start!</div>'}
                </div>
            </div>
        `;
    },

    todo(data) {
        const renderTodo = (t) => `
            <div class="list-item" style="justify-content: space-between;">
                 <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="todo-checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''}>
                    <span style="${t.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${t.text}</span>
                </div>
                <button class="delete-todo-btn icon-btn-small" data-id="${t.id}" style="width: 24px; height: 24px; border-radius: 50%; color: var(--danger);"><i data-lucide="trash-2" style="width: 14px;"></i></button>
            </div>
        `;

        return `
            <div class="glass-card fade-in" style="max-width: 800px; margin: 0 auto;">
                <div class="card-header">
                    <h3>Daily Planner & To-Do</h3>
                    <div style="display: flex; gap: 10px; flex: 1; margin-left: 20px;">
                        <input type="text" id="new-todo-input" placeholder="Add a new task..." class="glass-input" style="flex: 1;">
                        <button class="btn-primary" id="add-todo-btn"><i data-lucide="plus"></i></button>
                    </div>
                </div>
                <div class="list-container">
                    ${data.todos.map(renderTodo).join('') || '<div class="empty-state">No tasks yet.</div>'}
                </div>
            </div>
        `;
    },

    expenses(data) {
        const total = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);

        return `
             <div class="content-grid-2-1 fade-in">
                <div class="glass-card">
                    <div class="card-header">
                        <h3>Expense Log</h3>
                        <button class="btn-primary" id="toggle-expense-form"><i data-lucide="plus"></i> Add</button>
                    </div>

                    <div id="expense-form-container" class="form-container hidden" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                            <input type="text" id="exp-title" placeholder="Item Name" class="glass-input">
                            <input type="number" id="exp-amount" placeholder="Amount" class="glass-input">
                            <input type="text" id="exp-cat" placeholder="Category" class="glass-input">
                            <button class="btn-primary" id="save-expense-btn">Save Expense</button>
                        </div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-glass); text-align: left;">
                                <th style="padding: 10px; color: var(--text-muted); font-weight: 500;">Item</th>
                                <th style="padding: 10px; color: var(--text-muted); font-weight: 500;">Category</th>
                                <th style="padding: 10px; color: var(--text-muted); font-weight: 500;">Date</th>
                                <th style="padding: 10px; color: var(--text-muted); font-weight: 500; text-align: right;">Amount</th>
                                <th style="padding: 10px; color: var(--text-muted); font-weight: 500;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.expenses.map(e => `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                    <td style="padding: 12px; font-weight: 500;">${e.title}</td>
                                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.9rem;">${e.category}</td>
                                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.9rem;">${e.date}</td>
                                    <td style="color: var(--warning); font-weight: 600;">${e.amount} ETB</td>
                                    <td class="text-right">
                                        <button class="delete-expense-btn icon-btn-small" data-id="${e.id}" style="color: var(--danger);"><i data-lucide="trash-2" style="width: 14px;"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="glass-card" style="align-self: start;">
                    <div class="card-header">
                        <h3>Summary</h3>
                    </div>
                    <div style="text-align: center; padding: 20px 0;">
                        <span style="display: block; color: var(--text-muted); margin-bottom: 8px;">Total Spent</span>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--warning);">${total} ETB</div>
                    </div>
                    <div style="margin-top: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
                            <span>Budget</span>
                            <span>500 ETB</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${(total / 500) * 100}%; height: 100%; background: var(--warning);"></div>
                        </div>
                    </div>
                </div>
             </div>
        `;
    },

    events(data) {
        return `
            <div class="glass-card fade-in">
                <div class="card-header">
                    <h3>Campus Events</h3>
                    <button class="btn-primary" id="toggle-event-form"><i data-lucide="plus"></i> Suggest Event</button>
                </div>

                <div id="event-form-container" class="form-container hidden" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <input type="text" id="ev-title" placeholder="Event Name" class="glass-input">
                        <input type="text" id="ev-loc" placeholder="Location" class="glass-input">
                        <input type="text" id="ev-date" placeholder="Date (e.g. Nov 15)" class="glass-input">
                        <button class="btn-primary" id="save-event-btn" style="grid-column: span 3;">Post Event</button>
                    </div>
                </div>

                <div class="dashboard-grid">
                     ${data.events.map(e => `
                        <div class="glass-panel" style="padding: 24px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent);"></div>
                            <h4 style="margin-bottom: 8px; font-size: 1.1rem;">${e.title}</h4>
                            <div style="margin-bottom: 16px; color: var(--text-muted); font-size: 0.9rem;">
                                <i data-lucide="map-pin" style="width: 14px; vertical-align: middle;"></i> ${e.location}
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span class="badge" style="background: rgba(236, 72, 153, 0.1); color: var(--accent); border:none;">${e.date}</span>
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn-text">Register</button>
                                    <button class="delete-event-btn icon-btn-danger" data-id="${e.id}"><i data-lucide="trash-2" style="width: 14px;"></i></button>
                                </div>
                            </div>
                        </div>
                     `).join('') || '<div class="empty-state">No events upcoming.</div>'}
                </div>
            </div>
        `;
    }
};
