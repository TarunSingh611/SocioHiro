const mongoose = require('mongoose');

const instagramAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instagramId: { type: String, required: true },
  username: String,
  accessToken: String,
  refreshToken: String,
  profilePic: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InstagramAccount', instagramAccountSchema); 