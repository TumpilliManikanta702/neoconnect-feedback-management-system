const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const escalationJob = require('./utils/escalation');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Start escalation cron job
escalationJob();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Alias routes to match specification (/api/digest, /api/minutes)
const { protect } = require('./middleware/auth');
const { getDigest, getMinutes } = require('./controllers/publicController');
app.get('/api/digest', protect, getDigest);
app.get('/api/minutes', protect, getMinutes);

// Error handling middleware (optional but good idea)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

// Base route
app.get('/', (req, res) => {
    res.send('NeoConnect API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
