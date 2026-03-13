const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

const User = require('./models/User');
const Case = require('./models/Case');
const Poll = require('./models/Poll');
const Vote = require('./models/Vote');
const Announcement = require('./models/Announcement');
const Minute = require('./models/Minute');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Case.deleteMany();
        await Poll.deleteMany();
        await Vote.deleteMany();
        await Announcement.deleteMany();
        await Minute.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@neoconnect.com',
                password: 'password123',
                role: 'Admin'
            },
            {
                name: 'Secretariat Manager',
                email: 'secretariat@neoconnect.com',
                password: 'password123',
                role: 'Secretariat',
                department: 'HR'
            },
            {
                name: 'John Case Manager',
                email: 'manager@neoconnect.com',
                password: 'password123',
                role: 'Case Manager',
                department: 'Operations'
            },
            {
                name: 'Jane Staff',
                email: 'staff@neoconnect.com',
                password: 'password123',
                role: 'Staff',
                department: 'Engineering'
            }
        ]);

        const admin = createdUsers[0]._id;
        const manager = createdUsers[2]._id;
        const staff = createdUsers[3]._id;

        await Case.create({
            trackingId: 'NEO-2026-001',
            category: 'Facilities',
            department: 'Engineering',
            location: 'Building A',
            severity: 'Medium',
            description: 'AC is broken on the 3rd floor.',
            status: 'Assigned',
            submittedBy: staff,
            assignedTo: manager,
            assignedAt: new Date(),
            notes: [{ text: 'Assigned to manager', addedBy: admin }]
        });

        // Seed 5 more cases in Engineering - Facilities to trigger hotspot
        for (let i = 2; i <= 6; i++) {
            await Case.create({
                trackingId: `NEO-2026-00${i}`,
                category: 'Facilities',
                department: 'Engineering',
                location: 'Building A',
                severity: 'High',
                description: `Facility issue #${i}`,
                status: 'New',
                submittedBy: staff
            });
        }

        const poll = await Poll.create({
            question: 'How do you like the new hybrid work policy?',
            options: [
                { text: 'Love it' },
                { text: 'It is okay' },
                { text: 'Prefer fully remote' },
                { text: 'Prefer fully in-office' }
            ],
            createdBy: admin
        });

        await Vote.create({
            pollId: poll._id,
            userId: staff,
            selectedOption: poll.options[0]._id
        });

        await Case.create({
            trackingId: 'NEO-2025-099',
            category: 'Safety',
            department: 'Operations',
            location: 'Warehouse',
            severity: 'High',
            description: 'Slippery floor near the loading dock.',
            status: 'Resolved',
            submittedBy: staff,
            assignedTo: manager,
            actionTaken: 'Installed non-slip mats and updated safety signs.',
            result: 'Zero accidents reported since installation.',
            notes: [{ text: 'Issue resolved by operations.', addedBy: manager }]
        });

        await Announcement.create({
            title: 'Welcome to NeoConnect',
            description: 'Our new platform is live to better serve employee feedback.'
        });

        await Minute.create({
            title: 'Q1 Staff Feedback Meeting',
            fileUrl: '/uploads/file-1773394491840.pdf',
            uploadedBy: admin
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Case.deleteMany();
        await Poll.deleteMany();
        await Vote.deleteMany();
        await Announcement.deleteMany();
        await Minute.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
