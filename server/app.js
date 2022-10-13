const express = require('express');
const path = require('path');
const { port } = require('../config.js');
const { appendFile } = require('fs');
const error = require('./middleware/error');
const reviewsRoutes = require('./routes/reviewsRoutes');
const app = express();
const db = require('./databases/db');
db();

app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(`${req.method} REQUEST ON ${req.url}`);
  next();
});

app.use(reviewsRoutes.routes);
app.use(error);

app.listen(port || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
