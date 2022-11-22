const client = require('../cache/redis_connect.js');
const { ReviewMeta } = require('../model/reviewsMeta.js');

const getReviewsMeta = async (req, res, next) => {
  const { product_id } = req.query;

  const productId = Number(product_id);

  try {
    client.get(product_id, async (err, meta) => {
      if (err) console.log(err);
      if (meta) {
        console.log('sent from cache');
        res.status(200).send(JSON.parse(meta));
      } else {
        const list = await ReviewMeta.aggregate([
          {
            $match: { product_id: productId },
          },
          { $unset: '_id' },
        ]).exec();

        client.set(product_id, JSON.stringify(list));

        res.status(200).send(list[0]);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviewsMeta };
