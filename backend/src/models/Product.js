const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  instagramProductId: { type: String, unique: true },
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  currency: String,
  stock: Number,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema); 