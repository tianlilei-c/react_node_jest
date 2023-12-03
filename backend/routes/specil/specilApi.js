const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Profile = require('../../models/profile')
const Articles = require('../../models/articles')
const Followers = require('../../models/followerlist');
// PUT /password
router.put('/password', async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id })
    const { password } = req.body;
    const saltRounds = parseInt(process.env.BCRYPT_HASH);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword
    await user.save();
    res.status(200).json({ message: 'PUT /password' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// success!
router.get('/email/user', async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id })
    res.status(200).json({ message: 'success!', email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /email
router.put('/email', async (req, res) => {
  try {
    const { email } = req.body;
    const userProfile = await Profile.findOne({ username: req.user.username });
    const user = await User.findOne({ username: req.user.username });
    if (userProfile && user) {
      if (email != null && email !== '') {
        userProfile.email = email;
        user.email = email
      }
      await userProfile.save();
      await user.save();
      res.status(200).json({ message: 'update successful', email });
    } else {
      res.status(500).json({ msg: "error user" });
    }

    res.status(200).json({ message: 'PUT /email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /zipcode/user
router.get('/zipcode/user', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    res.status(200).json({ message: 'success!', email: user.zipcode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /zipcode
router.put('/zipcode', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    user.zipcode = req.body.zipcode
    await user.save();
    res.status(200).json({ message: 'success!', zipcode: user.zipcode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /avatar/user
router.get('/avatar/user', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    res.status(200).json({ message: 'success!', avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /avatar
router.put('/avatar', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    user.avatar = req.body.avatar
    await user.save();
    res.status(200).json({ message: 'success!', zipcode: user.avatar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /phone/user
router.get('/phone/user', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    res.status(200).json({ message: 'success!', phone: user.phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /phone
router.put('/phone', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    user.phone = req.body.phone
    await user.save();
    res.status(200).json({ message: 'success!', zipcode: user.phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /dob
router.get('/dob', async (req, res) => {
  try {
    let user = await Profile.findOne({ username: req.user.username })
    res.status(200).json({ message: 'success!', phone: user.dob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // GET /following/user
// router.get('/following/user', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'GET /following/user' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // PUT /following/user
// router.put('/following/user', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'PUT /following/user' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // DELETE /following/user
// router.delete('/following/user', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'DELETE /following/user' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
