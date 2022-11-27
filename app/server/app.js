const { NEWRELIC } = require('../config');

if (NEWRELIC) require('newrelic');

const express = require('express');
const path = require('path');
const { appendFile } = require('fs');
const error = require('./middleware/error');
const reviewsRoutes = require('./routes/reviewsRoutes');
const app = express();
const db = require('./databases/db');
db();
require('./cache/redis_connect.js');

app.use(express.json());
app.use(express.static('public'));

app.use('/', (req, res, next) => {
  console.log(`${req.method} REQUEST ON ${req.url}`);
  next();
});

app.use(reviewsRoutes.routes);
app.use(error);

// app.listen(port || 8000, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = app;
