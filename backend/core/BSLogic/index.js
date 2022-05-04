const { BuyerLogic, BuyerOrder } = require('./BuyerLogic')
const { SellerLogic, SellerOrder } = require('./SellerLogic')

module.exports = [{ buyer: BuyerOrder, seller: SellerOrder }, { buyer: BuyerLogic, seller: SellerLogic }]