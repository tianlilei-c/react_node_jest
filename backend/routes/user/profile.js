const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile')

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const userProfile = await Profile.findOne({ username })
    if (userProfile) {
      res.send(`Username Headline: ${userProfile.headline}`);
    } else {
      res.status(500).json({ error: 'user is not find' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

router.put('/', async (req, res) => {
  try {
    const { username, headline } = req.body;
    const userProfile = await Profile.findOne({ username })
    if (userProfile) {
      userProfile.headline = headline
      await userProfile.save()
    res.status(200).json({ message: 'update successful', userProfile  });
    } else {
      res.status(500).json({ msg: "error user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "update error" });
  }
});

module.exports = router;
