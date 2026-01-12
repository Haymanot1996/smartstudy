const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Get all data (for initial load)
router.get('/all', controller.getAll);

// Get specific section (e.g., /api/profile)
router.get('/:section', controller.getSection);

// Update specific section
router.post('/:section', controller.updateSection);

module.exports = router;
