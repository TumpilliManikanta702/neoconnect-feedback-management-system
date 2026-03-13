const Case = require('../models/Case');
const Announcement = require('../models/Announcement');
const Minute = require('../models/Minute');

// @desc    Get digest of resolved cases
// @route   GET /api/public/digest
// @access  Public (Staff)
const getDigest = async (req, res) => {
    try {
        const resolvedCases = await Case.find({ status: 'Resolved' })
            .select('trackingId category department description actionTaken result createdAt')
            .sort({ updatedAt: -1 })
            .limit(20);

        // Get announcements (company updates)
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            cases: resolvedCases,
            announcements
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get meeting minutes
// @route   GET /api/public/minutes
// @access  Public (Staff)
const getMinutes = async (req, res) => {
    try {
        const minutes = await Minute.find()
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(minutes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create announcement
// @route   POST /api/public/announcement
// @access  Private (Secretariat, Admin)
const createAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;
        const announcement = await Announcement.create({ title, description });
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upload meeting minutes
// @route   POST /api/public/minutes
// @access  Private (Secretariat, Admin)
const uploadMinutes = async (req, res) => {
    try {
        const { title } = req.body;
        let fileUrl = '';

        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const minute = await Minute.create({
            title,
            fileUrl,
            uploadedBy: req.user._id
        });

        res.status(201).json(minute);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDigest,
    getMinutes,
    createAnnouncement,
    uploadMinutes
};
