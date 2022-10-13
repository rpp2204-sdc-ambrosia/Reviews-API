const { ReviewMeta } = require('../model/non_relational/reviewsMeta.js');

const getReviewsMeta = async (req, res, next) => {
  const { product_id } = req.query;

  const productId = Number(product_id);

  try {
    const list = await ReviewMeta.aggregate([
      {
        $match: { product_id: productId },
      },
      { $unset: '_id' },
    ]).exec();

    res.status(200).send(list);
  } catch (err) {
    next(err);
  }
};

// const postReview = async (req, res, next) => {
//   const list = await Review.save();

//   res.status(200).send(list);
// };

module.exports = { getReviewsMeta };
