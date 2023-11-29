const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile')
const User = require('../../models/user')
const bcrypt = require('bcrypt');


router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const userProfile = await Profile.findOne({ username })
        if (userProfile) {
            res.send(JSON.stringify(userProfile));
        } else {
            res.status(500).json({ error: 'user is not find' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/', async (req, res) => {
    try {
        const { username, email, zipcode, phone, password } = req.body;
        const userProfile = await Profile.findOne({ username });
        const user = await User.findOne({ username });
        if (userProfile && user) {
            if (email != null && email !== ''){
                userProfile.email = email;
                user.email = email
            } 
            if (zipcode != null && zipcode !== '') userProfile.zipcode = zipcode;
            if (phone != null && phone !== '') userProfile.phone = phone;
            if (password != null && password !== '') {
                const saltRounds = parseInt(process.env.BCRYPT_HASH);
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                user.password = hashedPassword; 
            }
            await userProfile.save();
            await user.save();
            res.status(200).json({ message: 'update successful', userProfile });
        } else {
            res.status(500).json({ msg: "error user" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "update error" });
    }
});



module.exports = router;
