const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const md5 = require('md5')
const User = require('../../models/user');

const cookieKey = 'sid';
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const sessionKey = md5(process.env.JWT_SECRET + new Date().getTime() + user.username);
    user.token = sessionKey;
    await user.save();
    res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true });
    res.status(200).json({ sessionKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
