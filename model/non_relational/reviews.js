const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  review_id: { type: Number },
  product_id: Number,
  rating: Number,
  summary: { type: Boolean, required: true },
  recommend: { type: String, required: true },
  response: String,
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }, //auto gen current date
  reviewer_name: { type: String, required: true },
  email: { type: String, required: true },
  photos: [{ id: Number, url: String }],
  helpfulness: Number,
  reported: Boolean,
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = { Review };

// console.log('test review: ', Review.count());
