// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './users.model.js';
import Statistic from './estadistica.model.js';
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Send JSON response for success
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({
      token,
      user: { email: user.email, score: user.score, roundsPlayed: user.roundsPlayed, level: user.level },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Game Data (e.g., after playing a round)
// Update User Game Data (e.g., after playing a round)
router.post('/update', async (req, res) => {
  const { token, scoreIncrement, gamesPlayedIncrement, levelIncrement } = req.body;

  try {
    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields
    user.score = scoreIncrement; // Update score with the passed value
    user.level = levelIncrement; // Update level with the passed value
    user.roundsPlayed += gamesPlayedIncrement;

    // Save the updated user data
    await user.save();

    // Respond with the updated user data
    res.json({ message: 'Progress updated successfully', user });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Assuming the refresh token is stored in the database or in memory
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, 'your_refresh_token_secret');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});




// Create a new statistic
router.post('/statistics', async (req, res) => {
  try {
    const { sessionId, userId, llocEvent, tipusEvent } = req.body;
    if (!sessionId || !llocEvent || !tipusEvent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const statistic = new Statistic({ sessionId, userId, llocEvent, tipusEvent });
    await statistic.save();
    res.status(201).json({ message: 'Statistic logged successfully', statistic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log statistic' });
  }
});



export default router;


