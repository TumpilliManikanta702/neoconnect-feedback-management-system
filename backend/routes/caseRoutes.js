const express = require('express');
const router = express.Router();
const {
    createCase,
    getCases,
    getCaseById,
    updateCase,
    assignCase,
    deleteCase
} = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

router.route('/')
    .post(upload.single('file'), createCase)
    .get(getCases);

router.post('/assign', authorize('Secretariat', 'Admin'), assignCase);

router.route('/:id')
    .get(getCaseById)
    .put(authorize('Secretariat', 'Case Manager', 'Admin'), updateCase)
    .delete(authorize('Admin'), deleteCase);

const { getCaseByTrackingId } = require('../controllers/caseController');
router.get('/track/:trackingId', getCaseByTrackingId);

module.exports = router;
