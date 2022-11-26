const axios = require('axios');

function sendData(product_id) {
  var config = {
    method: 'get',
    url: `http://localhost:3000/reviews?product_id=${product_id}&page=0&count=10`,
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

let i = 994000;
setInterval(() => {
  if (i >= 1000011) {
    console.log('all data sent');
    return;
  } else {
    sendData(i);
    i++;
  }
}, 20);
