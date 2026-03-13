const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    selectedOption: {
        type: mongoose.Schema.Types.ObjectId, // referencing an option's _id inside Poll.options array
        required: true
    }
}, {
    timestamps: true
});

// Ensure a user can only vote once per poll
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
