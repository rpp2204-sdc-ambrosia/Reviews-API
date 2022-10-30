const app = require('./app');
const { PORT } = require('../config.js');

app.listen(PORT || 8000, () => {
  console.log(`server listening on port ${PORT}`);
});
