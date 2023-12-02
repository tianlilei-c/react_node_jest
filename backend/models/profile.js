const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  headline: { type: String, default: 'happy', required: true },
  email: { type: String, required: true },
  zipcode: { type: Number, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  userGithubID: { type: String, unique: true },
  avatar: { type: String, default: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DtLebron.jpg/220px-DtLebron.jpg' }
});

const Profile = mongoose.model('profiles', profileSchema);

module.exports = Profile;
