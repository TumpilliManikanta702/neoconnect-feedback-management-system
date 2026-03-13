const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt
});

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
