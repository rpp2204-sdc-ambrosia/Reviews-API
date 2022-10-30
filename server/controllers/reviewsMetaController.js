const { ReviewMeta } = require('../model/reviewsMeta.js');

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

    res.status(200).send(list[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviewsMeta };
