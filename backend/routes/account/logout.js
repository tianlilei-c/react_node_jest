const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

router.put('/', async (req, res) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.token = ''; 
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
