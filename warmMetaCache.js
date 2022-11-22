const axios = require('axios');

function sendData(product_id) {
  var config = {
    method: 'get',
    url: `http://localhost:3000/reviews/meta?product_id=${product_id}`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log('get success');
    })
    .catch(function (error) {
      console.log(error);
    });
}

let i = 990000;
setInterval(() => {
  if (i >= 1000011) {
    console.log('all data sent');
    return;
  } else {
    sendData(i);
    i++;
  }
}, 20);
