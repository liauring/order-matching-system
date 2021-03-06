const axios = require('axios').default

const dealers = ['seller', 'buyer']

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomPrice(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2)
}

function sentNewOrder(reqBody) {
  let url = 'https://connieplayground.site/api/newOrder'
  axios
    .post(url, reqBody, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      // console.log(response.data)
    })
    .catch((err) => {
      console.error(err)
    })
}

function placeOrder() {
  let getRandomDealer = Math.floor(Math.random() * dealers.length)
  let reqBody = {
    account: getRandomInt(100, 999),
    broker: 1030,
    symbol: 2330,
    BS: dealers[getRandomDealer],
    orderType: 'limit',
    duration: 'ROD',
    price: getRandomPrice(530, 549),
    quantity: getRandomInt(1, 100),
  }

  sentNewOrder(reqBody)
}

let startTime = new Date()
let placeOrderInterval = setInterval(function () {
  let currentTime = new Date()
  let period = currentTime - startTime
  if (period < 16200000) {
    placeOrder()
  } else {
    clearInterval(placeOrderInterval)
    process.exit(0)
  }
}, 2500)
