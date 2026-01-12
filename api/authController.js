const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-very-secret-key'; // In production, use environment variables

module.exports = {
    register: async (req, res) => {
        try {
            const { name, studentId, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email or ID already exists' });
            }

            const user = new User({ name, studentId, email, password });
            await user.save();

            res.status(201).json({ success: true, message: 'Registration successful' });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Create token
            const token = jwt.sign({ userId: user._id, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    studentId: user.studentId
                }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
