const express = require('express');
const cors = require('cors'); // 
require('dotenv').config();
const verifyToken = require('./middlewares/auth');
const mockMiddles = require('./middlewares/mockMiddles');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const loginRoute = require('./routes/account/login');
const registerRoute = require('./routes/account/register');
const logoutRoute = require('./routes/account/logout');
const ProfileRoute = require('./routes/user/profile');
const headlineRoute = require('./routes/user/headline');
const articlesRoute = require('./routes/articles/articles')
const testprotectedRoute = require('./routes/test/protected')
const followerRoute = require('./routes/follower/follower')
const stubsApi = require('./routes/stubsApi/stubsapi')
const gitcontrol = require('./routes/account/gitcontrol');
const deleteGithub = require('./routes/account/cleangithub');
const avatarRoute = require('./routes/avatar/avatar')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


//test middlewares verifyToken
app.use('/', gitcontrol)
app.use('/protected', verifyToken, testprotectedRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', verifyToken, logoutRoute);
app.use('/headline', verifyToken, headlineRoute);
app.use('/articles', verifyToken, articlesRoute);
app.use('/user', verifyToken, ProfileRoute);
app.use('/followers', verifyToken, followerRoute);
app.use('/avatar', verifyToken, avatarRoute);

app.use('/deleteGithub', verifyToken, deleteGithub);

app.use('/', mockMiddles, stubsApi)

// const password = encodeURIComponent('886xK31111MongoDb');
// const connectionString = `mongodb+srv://xk614283:${password}@expressmongodb.yewyjq9.mongodb.net/?retryWrites=true&w=majority`;

// mongoose.connect(connectionString)
//   .then(() => {
//     console.log('MongoDB connected');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });


mongoose.connect('mongodb://localhost/node6', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
