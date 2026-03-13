const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Safety', 'Policy', 'Facilities', 'HR', 'Other'],
        required: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'],
        default: 'New'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () { return !this.anonymous; }
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedAt: {
        type: Date
    },
    notes: [{
        text: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    actionTaken: {
        type: String
    },
    result: {
        type: String
    }
}, {
    timestamps: true
});

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
