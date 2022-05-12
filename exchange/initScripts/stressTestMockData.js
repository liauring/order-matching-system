const axios = require('axios').default

const dealers = ['seller', 'buyer']

function getRandomInt(x) {
  return Math.floor(Math.random() * x) + 1
}

function getRandomPrice(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2)
}

function sentNewOrder(reqBody) {
  let url = 'https://exchange.connieplayground.site/api/newOrder/stressTest'
  axios
    .post(url, reqBody, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      console.log(response.data)
    })
    .catch((err) => {
      // console.error(err)
    })
}

function randomDealer() {
  for (let i = 0; i < 10; i++) {
    let getRandomDealer = Math.floor(Math.random() * dealers.length)
    let reqBody = {
      account: getRandomInt(99),
      broker: 1030,
      symbol: 2330,
      BS: dealers[getRandomDealer],
      orderType: 'limit',
      duration: 'ROD',
      price: getRandomPrice(530, 540),
      quantity: getRandomInt(100),
    }

    sentNewOrder(reqBody)
  }
}

function mustExecBuyer() {
  for (let i = 0; i < 100; i++) {
    let reqBody = {
      account: i,
      broker: 1030,
      symbol: 2330,
      BS: 'buyer',
      orderType: 'limit',
      duration: 'ROD',
      price: 1,
      quantity: 1,
    }
    console.log(reqBody)
    sentNewOrder(reqBody)
  }
}
