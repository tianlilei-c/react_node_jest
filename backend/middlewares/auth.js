const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');
  console.log('midware token',token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await User.findOne({  token });
    if (!user) {
      return res.status(401).json({ error: 'User did’t login' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Error Invalid token' });
  }
};

module.exports = verifyToken;
