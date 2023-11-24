const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Profile = require('../../models/profile');

router.post('/', async (req, res) => {
  try {
    const { name, email, password, username, headline, zipcode, phone, dob, avatar } = req.body;
    const saltRounds = parseInt(process.env.BCRYPT_HASH);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    const user = await User.findOne({ email });
    const profile = new Profile({
      user: user._id,
      username,
      name,
      headline,
      email,
      zipcode,
      phone,
      dob: new Date(dob),
      avatar
    });
    await profile.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});



module.exports = router;
