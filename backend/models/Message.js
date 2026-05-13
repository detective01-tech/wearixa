const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        senderName: {
            type: String,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        customerName: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: false, // Optional because it could be just an image
        },
        image: {
            type: String,
            required: false,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
