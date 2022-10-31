const { MONGODB_URI } = require('../../config');
const mongoose = require('mongoose');

// console.log('MONGODB_URI=: ', MONGODB_URI);

module.exports = () => {
  mongoose
    .connect(MONGODB_URI || `mongodb://localhost:27017/ReviewsDB`)
    .then(() => console.log('db connection success'))
    .catch((error) => console.log('error connecting to db: ', error));
};
