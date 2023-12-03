const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile');
const User = require('../../models/user');
const md5 = require('md5')
const axios = require('axios');

router.get('/gitcontrol', async (req, res) => {
    try {
        const clientID = '014fb2844b633edb88c7';
        const clientSecret = '6778835f81b6f67e6582ed8d2aa8430a337eff10';
        const requestToken = req.query.code;
        const username = decodeURIComponent(req.query.state); // 解码 username

        if (username && username !== 'undefined') {
            let userprofile = await Profile.findOne({ username });
            if (!userprofile) {
                return res.redirect(`http://localhost:5000/auth?msg=${encodeURIComponent('Invalid username')}`);
            }

            const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: clientID,
                client_secret: clientSecret,
                code: requestToken
            }, {
                headers: { accept: 'application/json' }
            });
            const accessToken = tokenResponse.data.access_token;
            const githubResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    accept: 'application/json',
                    Authorization: `token ${accessToken}`
                }
            });

            userprofile.userGithubID = githubResponse.data.id;
            await userprofile.save();
            return res.redirect('http://localhost:5000/profile?name=');
        } else {
            const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: clientID,
                client_secret: clientSecret,
                code: requestToken
            }, {
                headers: { accept: 'application/json' }
            });
            const accessToken = tokenResponse.data.access_token;
            const githubResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    accept: 'application/json',
                    Authorization: `token ${accessToken}`
                }
            });

            const githubID = githubResponse.data.id;
            let userprofile = await Profile.findOne({ userGithubID: githubID });

            if (!userprofile) {
                return res.redirect(`http://localhost:5000/auth?msg=${encodeURIComponent('GitHub account not linked with any user')}`);
            }

            let user = await User.findOne({ username: userprofile.username });
            const token = md5(process.env.JWT_SECRET + new Date().getTime() + user.username);

            user.token = token;
            await user.save();

            const redirectUrl = `http://localhost:5000/auth?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}`;
            return res.redirect(redirectUrl);
        }
    } catch (error) {
        return res.redirect(`http://localhost:5000/auth?msg=${encodeURIComponent(error.message)}`);
    }
});

module.exports = router;
