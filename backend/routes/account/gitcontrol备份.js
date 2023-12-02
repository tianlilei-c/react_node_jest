const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile')
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

const axios = require('axios')

router.get('/gitcontrol', async (req, res) => {
    try {
        let clientID = '014fb2844b633edb88c7'
        let clientSecret = '6778835f81b6f67e6582ed8d2aa8430a337eff10'
        const requestToken = req.query.code;
        const username = decodeURIComponent(req.query.state); // 解码 username
        if (username && username != 'undefined') {
            let userprofile = await Profile.findOne({ username })
            if (!userprofile) {
                return res.status(400).json({ error: 'Invalid username' });
            }
            const tokenResponse = await axios({
                method: 'post',
                url: 'https://github.com/login/oauth/access_token?' +
                    `client_id=${clientID}&` +
                    `client_secret=${clientSecret}&` +
                    `code=${requestToken}`,
                headers: {
                    accept: 'application/json'
                }
            });
            const accessToken = tokenResponse.data.access_token;
            const result = await axios({
                method: 'get',
                url: `https://api.github.com/user`,
                headers: {
                    accept: 'application/json',
                    Authorization: `token ${accessToken}`
                }
            });
            const gitdata = result.data;
            userprofile.userGithubID = result.data.id;
            await userprofile.save()
            res.redirect('http://localhost:5000/profile?name=');
        } else {
            try {
                const clientID = '014fb2844b633edb88c7';
                const clientSecret = '6778835f81b6f67e6582ed8d2aa8430a337eff10';
                const requestToken = req.query.code;

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
                let uerprofile = await Profile.findOne({ userGithubID: githubID });

                if (!uerprofile) {
                    const redirectUrl = `http://localhost:5000/auth?msg=${encodeURIComponent('GitHub account not linked with any user')}`;
                    res.redirect(redirectUrl);
                }

                let user = await User.findOne({ username: uerprofile.username });
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                user.token = token;
                await user.save();

                // res.status(200).json({ message: 'Login successful', token, username: user.username });
                const redirectUrl = `http://localhost:5000/auth?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}`;
                res.redirect(redirectUrl);

            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.get('/gitcontrol', async (req, res) => {
//     try {
//         let clientID = '014fb2844b633edb88c7'
//         let clientSecret = '6778835f81b6f67e6582ed8d2aa8430a337eff10'
//         const requestToken = req.query.code;
//         const username = decodeURIComponent(req.query.state); // 解码 username

//         if (username && username != 'undefined') {
//             let userprofile = await Profile.findOne({ username });
//             if (!userprofile) {
//                 const redirectUrl = `http://localhost:5000/error?msg=${encodeURIComponent('Invalid username')}`;
//                 return res.redirect(redirectUrl);
//             }
//             const tokenResponse = await axios({
//                 method: 'post',
//                 url: 'https://github.com/login/oauth/access_token?' +
//                     `client_id=${clientID}&` +
//                     `client_secret=${clientSecret}&` +
//                     `code=${requestToken}`,
//                 headers: {
//                     accept: 'application/json'
//                 }
//             });
//             const accessToken = tokenResponse.data.access_token;
//             const result = await axios({
//                 method: 'get',
//                 url: `https://api.github.com/user`,
//                 headers: {
//                     accept: 'application/json',
//                     Authorization: `token ${accessToken}`
//                 }
//             });
//             const gitdata = result.data;
//             userprofile.userGithubID = result.data.id;
//             await userprofile.save()
//             res.redirect('http://localhost:5000/profile?name=');
//             const redirectUrl = 'http://localhost:5000/profile?name=';
//             return res.redirect(redirectUrl);
//         } else {
//             // ... 处理 GitHub 登录和查找 userprofile ...
//             // 注意在这里不要发送响应，而是进行重定向
//             const clientID = '014fb2844b633edb88c7';
//             const clientSecret = '6778835f81b6f67e6582ed8d2aa8430a337eff10';
//             const requestToken = req.query.code;

//             const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
//                 client_id: clientID,
//                 client_secret: clientSecret,
//                 code: requestToken
//             }, {
//                 headers: { accept: 'application/json' }
//             });
//             const accessToken = tokenResponse.data.access_token;
//             const githubResponse = await axios.get('https://api.github.com/user', {
//                 headers: {
//                     accept: 'application/json',
//                     Authorization: `token ${accessToken}`
//                 }
//             });

//             const githubID = githubResponse.data.id;
//             let uerprofile = await Profile.findOne({ userGithubID: githubID });

//             if (!uerprofile) {
//                 const redirectUrl = `http://localhost:5000/auth?msg=${encodeURIComponent('GitHub account not linked with any user')}`;
//                 res.redirect(redirectUrl);
//             }

//             let user = await User.findOne({ username: uerprofile.username });
//             const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//             user.token = token;
//             await user.save();

//             const redirectUrl = `http://localhost:5000/auth?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}`;
//             return res.redirect(redirectUrl);
//         }
//     } catch (error) {
//         const redirectUrl = `http://localhost:5000/error?msg=${encodeURIComponent(error.message)}`;
//         res.redirect(redirectUrl);
//     }
// });


module.exports = router;