/**
 * Data Store for SmartStudy
 * Handles data persistence using API.
 */

const DataStore = {
    // Cache to store data locally after fetching
    cache: {},

    async init() {
        const DEFAULT_STATE = {
            profile: { name: '', id: '', dept: '', year: '', avatar: '', attendance: '0' },
            schedule: [],
            assignments: [],
            todos: [],
            expenses: [],
            events: [],
            notes: []
        };

        try {
            const response = await fetch('/api/all');
            if (!response.ok) throw new Error('Failed to fetch data');

            const fetchedData = await response.json();

            // Merge defaults with fetched data to ensure all keys exist
            this.cache = { ...DEFAULT_STATE, ...fetchedData };

            // Ensure profile sub-keys exist if profile object was partial
            this.cache.profile = { ...DEFAULT_STATE.profile, ...(fetchedData.profile || {}) };

            console.log('Data initialized from API');
            return true;
        } catch (error) {
            console.error('DataStore init error:', error);
            // Fallback to defaults on error
            this.cache = DEFAULT_STATE;
            return true; // Return true to allow app to load even if offline/empty
        }
    },

    get() {
        // Return cached data
        return this.cache;
    },

    async saveSnapshot(data) {
        // Not used directly in this pattern, but kept for compatibility or bulk updates
        // ideally we update sections individually
        console.warn('saveSnapshot not fully implemented for API sync');
        this.cache = data;
    },

    // Helper to get specific slice
    getSlice(key) {
        return this.cache[key] || [];
    },

    // Helper to update specific slice and sync with backend
    async updateSlice(key, value) {
        // Optimistic update
        this.cache[key] = value;

        try {
            const response = await fetch(`/api/${key}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(value)
            });

            if (!response.ok) throw new Error(`Failed to update ${key}`);

            const result = await response.json();
            console.log(result.message);

            // Dispatch event for reactive updates
            window.dispatchEvent(new CustomEvent('dataUpdated', { detail: this.cache }));
            return true;
        } catch (error) {
            console.error(`Error updating ${key}:`, error);
            // Revert on failure (advanced implementation would go here)
            return false;
        }
    }
};
