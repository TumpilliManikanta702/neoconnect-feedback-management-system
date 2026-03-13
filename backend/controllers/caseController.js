const Case = require('../models/Case');

// Utility to generate tracking ID
const generateTrackingId = async () => {
    const year = new Date().getFullYear();
    const latestCase = await Case.findOne({ trackingId: new RegExp(`^NEO-${year}-`) }).sort({ createdAt: -1 });
    let nextNumber = 1;
    if (latestCase) {
        const parts = latestCase.trackingId.split('-');
        nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `NEO-${year}-${nextNumber.toString().padStart(3, '0')}`;
};

// @desc    Create new case
// @route   POST /api/cases
// @access  Private (Staff)
const createCase = async (req, res) => {
    try {
        const { category, department, location, severity, description, anonymous } = req.body;
        let fileUrl = '';

        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const trackingId = await generateTrackingId();

        const newCase = await Case.create({
            trackingId,
            category,
            department,
            location,
            severity,
            description,
            fileUrl,
            anonymous: anonymous === 'true' || anonymous === true,
            submittedBy: (anonymous === 'true' || anonymous === true) ? undefined : req.user._id,
            status: 'New'
        });

        res.status(201).json(newCase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private (Secretariat, Admin, Case Manager can view assigned)
const getCases = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Staff') {
            query.submittedBy = req.user._id;
        } else if (req.user.role === 'Case Manager') {
            // Allow case manager to view cases assigned to them, or maybe all
            // We will restrict to assigned them
            query.assignedTo = req.user._id;
        }

        // Optional filters from query
        if (req.query.department) query.department = req.query.department;
        if (req.query.severity) query.severity = req.query.severity;
        if (req.query.status) query.status = req.query.status;

        const cases = await Case.find(query)
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
const getCaseById = async (req, res) => {
    try {
        const complaint = await Case.findById(req.params.id)
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .populate({
                path: 'notes.addedBy',
                select: 'name role'
            });

        if (complaint) {
            if (req.user.role === 'Staff') {
                if (complaint.anonymous !== true && complaint.submittedBy && complaint.submittedBy._id.toString() !== req.user._id.toString()) {
                    return res.status(403).json({ message: 'Not authorized to view this case' });
                }
            }
            res.json(complaint);
        } else {
            res.status(404).json({ message: 'Case not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCaseByTrackingId = async (req, res) => {
    try {
        const complaint = await Case.findOne({ trackingId: req.params.trackingId })
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .populate({
                path: 'notes.addedBy',
                select: 'name role'
            });
        if (!complaint) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update case status / add note
// @route   PUT /api/cases/:id
// @access  Private (Case Manager, Secretariat, Admin)
const updateCase = async (req, res) => {
    try {
        const { status, note, actionTaken, result } = req.body;
        const complaint = await Case.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Case not found' });
        }

        if (req.user.role === 'Staff') {
            return res.status(403).json({ message: 'Staff cannot update cases' });
        }

        if (status) complaint.status = status;
        if (actionTaken) complaint.actionTaken = actionTaken;
        if (result) complaint.result = result;

        if (note) {
            complaint.notes.push({
                text: note,
                addedBy: req.user._id
            });
        }

        await complaint.save();

        const updatedCase = await Case.findById(req.params.id)
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .populate({
                path: 'notes.addedBy',
                select: 'name role'
            });

        res.json(updatedCase);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Assign case
// @route   POST /api/cases/assign
// @access  Private (Secretariat, Admin)
const assignCase = async (req, res) => {
    try {
        const { caseId, managerId } = req.body;

        const complaint = await Case.findById(caseId);
        if (!complaint) return res.status(404).json({ message: 'Case not found' });

        complaint.assignedTo = managerId;
        complaint.assignedAt = Date.now();
        complaint.status = 'Assigned';
        // Let's add an implicit note
        complaint.notes.push({
            text: `Case assigned to manager.`,
            addedBy: req.user._id
        });

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private (Admin only)
const deleteCase = async (req, res) => {
    try {
        const complaint = await Case.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Case not found' });

        await complaint.deleteOne();
        res.json({ message: 'Case removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createCase,
    getCases,
    getCaseById,
    updateCase,
    assignCase,
    deleteCase,
    getCaseByTrackingId
};
