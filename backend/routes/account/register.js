const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Profile = require('../../models/profile');

router.post('/', async (req, res) => {
  try {
    const { name, email, password, username, headline, zipcode, phone, dob, avatar } = req.body;
    // console.log(`name: ${name}, email: ${email}, password: ${password}, username: ${username}, headline: ${headline}, zipcode: ${zipcode}, phone: ${phone}, dob: ${dob}, avatar: ${avatar}`);
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
      headline: "I'm Happy",
      email,
      zipcode,
      phone,
      dob: new Date(dob),
      avatar
    });
    await profile.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      res.status(484).json({ error: "nedd change username" }); 
    } else {
      res.status(500).json({ error: "error" }); 
    }
  }
});



module.exports = router;
