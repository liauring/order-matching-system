const { BuyerOrder } = require('./BuyerLogic')
const { SellerOrder } = require('./SellerLogic')
const { BuyerInfo, SellerInfo } = require('./DealerProvider')

// module.exports = [
//   { buyer: BuyerOrder, seller: SellerOrder },
//   { buyer: BuyerLogic, seller: SellerLogic },
// ]

module.exports = {
  newOrder: { buyer: BuyerOrder, seller: SellerOrder },
  dealerInfo: { buyer: SellerInfo, seller: BuyerInfo },
}
