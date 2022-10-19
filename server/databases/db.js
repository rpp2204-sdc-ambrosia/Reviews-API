const { db_name } = require('../../config');
const mongoose = require('mongoose');

console.log('db name: ', db_name);

module.exports = () => {
  mongoose
    .connect(`mongodb://localhost:27017/${db_name}`)
    .then(() => console.log('connection success'))
    .catch((error) => console.log('error connecting to db: ', error));
};
