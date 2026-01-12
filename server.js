const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const apiRoutes = require('./api/routes');
const authRoutes = require('./api/auth');

// Database Connection
// const MONGODB_URI = 'mongodb://localhost:27017/test';
const MONGODB_URI = 'mongodb+srv://haymanotassefa2_db_user:DkdGOwIa75vPnR0t@cluster0.dvzd6qx.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB at'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const app = express();
const PORT = 3000; // Changed from 3000 to test for port conflicts

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './frontend/'))); // Serve static files from frontend directory

// Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is runnhing on http://localhost:${PORT}`);
});
//haymanotassefa2_db_user
//DkdGOwIa75vPnR0t
server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});
