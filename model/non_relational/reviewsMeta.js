const mongoose = require('mongoose');

const reviewsMetaSchema = new mongoose.Schema({
  product_id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
  recommended: { false: Number, true: Number },
  characteristics: [
    {
      Fit: { id: Number, value: Number },
      Length: { id: Number, value: Number },
      Comfort: { id: Number, value: Number },
      Quality: { id: Number, value: Number },
    },
  ],
});

const ReviewMeta = mongoose.model('ReviewMeta', reviewsMetaSchema);

module.exports = { ReviewMeta };

console.log('ReviewMeta: ', new ReviewMeta());
