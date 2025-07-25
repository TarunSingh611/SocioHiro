const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Support both Facebook and Instagram OAuth
  facebookId: { type: String, unique: true, sparse: true },
  instagramId: { type: String, unique: true, sparse: true },
  username: String,
  accessToken: String,
  refreshToken: String,
  profilePic: String,
  accountType: String, // 'instagram', 'facebook', etc.
  instagramAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InstagramAccount' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema); 