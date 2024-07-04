const express = require('express');
const User = require('../model/User');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    const { name, email, pass } = req.body;

    try {
        // Basic input validation
        if (!name || !email || !pass) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please login' });
        }

        // Create new user instance
        const newUser = new User({ name, email, pass });
        await newUser.save();

        // Return success message
        res.status(201).json({ message: 'Registration Successful' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, pass } = req.body;

    try {
        // Basic input validation
        if (!email || !pass) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist. Please register' });
        }

        // Check if passwords match (replace with your own logic for password comparison)
        if (user.pass !== pass) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        // Return token and success message
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
