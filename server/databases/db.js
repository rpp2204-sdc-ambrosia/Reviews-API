const { MONGODB_URI } = require('../../config');
const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect(MONGODB_URI || `mongodb://localhost:27017/ReviewsDB`)
    .then(() => console.log('db connection success'))
    .catch((error) => console.log('error connecting to db: ', error));
};
