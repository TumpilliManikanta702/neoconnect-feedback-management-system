const Case = require('../models/Case');

// @desc    Get analytics combined data
// @route   GET /api/analytics
// @access  Private (Secretariat, Admin, Case Manager)
const getAnalytics = async (req, res) => {
    try {
        // Escalate cases older than 7 days automatically before getting stats
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find cases that are Assigned and haven't been responded to in 7 days since assignment
        await Case.updateMany(
            {
                status: 'Assigned',
                assignedAt: { $lt: sevenDaysAgo }
            },
            {
                $set: { status: 'Escalated' },
                $push: { notes: { text: "System Auto-escalation: No response within 7 days of assignment" } }
            }
        );

        // 1. Total Cases count
        const totalCases = await Case.countDocuments();

        // 2. Cases by Department
        const casesByDepartment = await Case.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        // 3. Cases by Category
        const casesByCategory = await Case.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // 4. Cases by Status
        const casesByStatus = await Case.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // 5. Hotspot Detection: 5 or more complaints from same department & category
        const potentialHotspots = await Case.aggregate([
            {
                $group: {
                    _id: { department: '$department', category: '$category' },
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { $gte: 5 } } },
            { $sort: { count: -1 } }
        ]);

        const hotspots = potentialHotspots.map(h => ({
            department: h._id.department,
            category: h._id.category,
            count: h.count
        }));

        res.json({
            totalCases,
            byDepartment: casesByDepartment.map(d => ({ name: d._id, value: d.count })),
            byCategory: casesByCategory.map(c => ({ name: c._id, value: c.count })),
            byStatus: casesByStatus.map(s => ({ name: s._id, value: s.count })),
            hotspots
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAnalytics
};
