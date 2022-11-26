const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  review_id: { type: Number },
  product_id: { type: Number, index: true },
  rating: Number,
  summary: { type: String, required: true },
  recommend: Boolean,
  response: { type: String, default: null },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }, //auto gen current date
  reviewer_name: { type: String, required: true },
  reviewer_email: { type: String, required: true },
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  photos: [{ url: String }],
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = { Review };
