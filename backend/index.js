const express = require('express');
require('dotenv').config();
const verifyToken = require('./middlewares/auth');
const mockMiddles = require('./middlewares/mockMiddles');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const loginRoute = require('./routes/account/login');
const registerRoute = require('./routes/account/register');
const logoutRoute = require('./routes/account/logout');
const headlineRoute = require('./routes/user/profile');
const articlesRoute = require('./routes/articles/articles')
const testprotectedRoute = require('./routes/test/protected')
const stubsApi = require('./routes/stubsApi/stubsapi')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//test middlewares verifyToken
app.use('/protected', verifyToken, testprotectedRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', mockMiddles, logoutRoute);
app.use('/headline', mockMiddles, headlineRoute);
app.use('/articles', mockMiddles, articlesRoute);
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
