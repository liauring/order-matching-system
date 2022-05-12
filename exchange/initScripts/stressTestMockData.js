const axios = require('axios').default

function getRandomInt(x) {
  return Math.floor(Math.random() * x) + 1
}

const dealers = ['seller', 'buyer']
let getRandomDealer = Math.floor(Math.random() * dealers.length)

function getRandomPrice(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2)
}

for (let i = 0; i < 1000; i++) {
  let reqbody = {
    account: getRandomInt(99),
    broker: 1030,
    symbol: 2330,
    BS: dealers[getRandomDealer],
    orderType: 'limit',
    duration: 'ROD',
    price: getRandomPrice(530, 540),
    quantity: getRandomInt(100),
  }
  // console.log(JSON.parse(reqbody))
  let url = 'https://exchange.connieplayground.site/api/newOrder/stressTest'
  axios
    .post(url, reqbody, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      // console.log(response.data)
    })
    .catch((err) => {
      // console.error(err)
    })
}
