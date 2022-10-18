const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  review_id: { type: Number, unique: true },
  product_id: Number,
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
  photos: [String],
});

// const incrementReviewCount = async function (next) {
//   console.log('this test: ', this);

//   return 'hello';

//   next();
// };

// reviewsSchema.pre('save', incrementReviewCount);

const Review = mongoose.model('Review', reviewsSchema);

module.exports = { Review };
