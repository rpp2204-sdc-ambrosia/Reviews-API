module.exports = (err, req, res, next) => {
  const message = `error in express error handler: ${err.message}`;

  res.status(500).send(message);
};
