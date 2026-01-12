const StudyData = require('../models/StudyData');

module.exports = {
    getAll: async (req, res) => {
        try {
            const allData = await StudyData.find({});
            // Transform array of {section, data} into a single object {profile: ..., schedule: ...}
            const result = allData.reduce((acc, item) => {
                acc[item.section] = item.data;
                return acc;
            }, {});
            res.json(result);
        } catch (err) {
            console.error("Error fetching all data:", err);
            res.status(500).json({ error: 'Failed to fetch data from database' });
        }
    },

    getSection: async (req, res) => {
        try {
            const section = req.params.section;
            const item = await StudyData.findOne({ section });
            if (item) {
                res.json(item.data);
            } else {
                res.status(404).json({ error: 'Section not found' });
            }
        } catch (err) {
            console.error(`Error fetching section ${req.params.section}:`, err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    updateSection: async (req, res) => {
        try {
            const section = req.params.section;
            const newData = req.body;

            const updated = await StudyData.findOneAndUpdate(
                { section },
                { data: newData },
                { upsert: true, new: true }
            );

            res.json({ success: true, message: `${section} updated in MongoDB` });
        } catch (err) {
            console.error(`Error updating section ${req.params.section}:`, err);
            res.status(500).json({ error: 'Failed to save data to database' });
        }
    }
};
