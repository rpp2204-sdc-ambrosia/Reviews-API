const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const { Review } = require('../server/model/reviews');
const mockReview = {
  review_id: 1,
  product_id: 5,
  rating: 5,
  summary: 'some words to test this post request',
  body: 'hello people of planet earth. Stay swole',
  recommend: true,
  name: 'testNameForReviewsAPI',
  email: 'test@gmail.com',
  photos: ['photourltest1', 'test2', 'test3'],
  characteristics: {
    16: 0,
    17: 0,
    14: 0,
    15: 0,
  },
};

describe('Reviews API', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const reviews = db.collection('reviews');
    await reviews.insertOne(mockReview);

    const newReview = await reviews.findOne({ review_id: 1 });

    expect(newReview).toEqual(mockReview);
  });
});
