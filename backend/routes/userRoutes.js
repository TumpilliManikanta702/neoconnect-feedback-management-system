const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('Admin', 'Secretariat'), getUsers);

router.route('/:id')
    .put(protect, authorize('Admin'), updateUser)
    .delete(protect, authorize('Admin'), deleteUser);

module.exports = router;
