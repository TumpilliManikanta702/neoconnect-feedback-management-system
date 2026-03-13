const express = require('express');
const router = express.Router();
const {
    createPoll,
    getPolls,
    votePoll,
    deletePoll,
    votePollByBody
} = require('../controllers/pollController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .post(authorize('Secretariat', 'Admin'), createPoll)
    .get(getPolls);

router.post('/:id/vote', votePoll);
router.post('/vote', votePollByBody);

router.delete('/:id', authorize('Admin'), deletePoll);

module.exports = router;
