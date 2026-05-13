const Message = require('../models/Message');
const cloudinary = require('../config/cloudinary');

// @desc    Fetch recent messages for a specific conversation
// @route   GET /api/chat
// @access  Private
const getMessages = async (req, res) => {
    try {
        const customerId = req.user.role === 'admin' && req.query.customerId ? req.query.customerId : req.user._id;
        const messages = await Message.find({ customerId }).sort({ createdAt: -1 }).limit(100);
        res.json(messages.reverse()); // Reverse to send oldest first, newest last
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching messages' });
    }
};

// @desc    Get all unique conversations (Admin only)
// @route   GET /api/chat/conversations
// @access  Private/Admin
const getConversations = async (req, res) => {
    try {
        // Find latest message for each customer
        const messages = await Message.aggregate([
            { $sort: { createdAt: -1 } },
            { 
                $group: { 
                    _id: '$customerId', 
                    customerName: { $first: '$customerName' },
                    lastMessage: { $first: '$text' },
                    hasImage: { $first: '$image' },
                    updatedAt: { $first: '$createdAt' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ['$isRead', false] },
                                    { $eq: ['$senderId', '$customerId'] }
                                ] },
                                1,
                                0
                            ]
                        }
                    }
                } 
            },
            { $sort: { updatedAt: -1 } }
        ]);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error fetching conversations', stack: error.stack });
    }
};

// @desc    Send a new message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        
        let imageUrl = null;
        if (req.file) {
            if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'wearixa/chat',
                });
                imageUrl = result.secure_url;
            } else {
                imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            }
        } else if (req.body.image) {
             imageUrl = req.body.image;
        }

        if (!text && !imageUrl) {
            return res.status(400).json({ message: 'Message text or image is required' });
        }

        const customerId = req.user.role === 'admin' && req.body.customerId ? req.body.customerId : req.user._id;
        const customerName = req.user.role === 'admin' && req.body.customerName ? req.body.customerName : req.user.name;

        const message = new Message({
            senderId: req.user._id,
            senderName: req.user.name,
            customerId,
            customerName,
            text,
            image: imageUrl,
        });

        const createdMessage = await message.save();
        res.status(201).json(createdMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error saving message', stack: error.stack });
    }
};

// @desc    Mark conversation as read
// @route   PUT /api/chat/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
    try {
        const { customerId } = req.body;
        if (!customerId) return res.status(400).json({ message: 'Customer ID required' });

        await Message.updateMany(
            { customerId, senderId: customerId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'Conversation marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error marking messages as read' });
    }
};

module.exports = {
    getMessages,
    getConversations,
    sendMessage,
    markAsRead,
};
