const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getConversations, markAsRead } = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/conversations').get(protect, admin, getConversations);
router.route('/read').put(protect, admin, markAsRead);

router.route('/')
    .get(protect, getMessages)
    .post(protect, upload.single('image'), sendMessage);

module.exports = router;
