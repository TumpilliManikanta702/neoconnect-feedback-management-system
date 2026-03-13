const mongoose = require('mongoose');

const minuteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true // This adds createdAt and updatedAt, we can treat createdAt as uploadedAt
});

const Minute = mongoose.model('Minute', minuteSchema);
module.exports = Minute;
