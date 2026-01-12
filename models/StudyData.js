const mongoose = require('mongoose');

const studyDataSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('StudyData', studyDataSchema);
