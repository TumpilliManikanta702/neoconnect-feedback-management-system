const express = require('express');
const router = express.Router();
const { getDigest, getMinutes, createAnnouncement, uploadMinutes } = require('../controllers/publicController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// We use protect because it's for Staff/Logged IN users, not the whole internet
router.use(protect);

router.get('/digest', protect, getDigest);
router.get('/minutes', protect, getMinutes);

// Management routes
router.post('/announcement', protect, authorize('Secretariat', 'Admin'), createAnnouncement);
router.post('/minutes', protect, authorize('Secretariat', 'Admin'), upload.single('file'), uploadMinutes);

module.exports = router;
