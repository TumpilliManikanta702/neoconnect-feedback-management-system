const cron = require('node-cron');
const Case = require('../models/Case');

const escalationJob = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running escalation check...');
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Find cases assigned more than 7 days ago and still in 'Assigned' status
            const overdueCases = await Case.find({
                status: 'Assigned',
                assignedAt: { $lte: sevenDaysAgo }
            });

            for (const complaint of overdueCases) {
                complaint.status = 'Escalated';
                complaint.notes.push({
                    text: 'Case escalated automatically due to inactivity for 7 days.',
                    addedBy: null // System action
                });
                await complaint.save();
                console.log(`Case ${complaint.trackingId} escalated.`);
                // In a real app, send email/notification here
            }
        } catch (error) {
            console.error('Error in escalation job:', error);
        }
    });
};

module.exports = escalationJob;
