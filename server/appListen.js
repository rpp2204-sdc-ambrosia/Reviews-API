const app = require('./app');
const { port } = require('../config.js');

app.listen(port || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
