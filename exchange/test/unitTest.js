const { expect } = require('chai')

const { MockCacheForDealerProvider } = require('./mockProvider/mockCache_provider')
const { DealerProvider, SellerInfo, BuyerInfo } = require('../core/MatchLogic/DealerProvider')

describe('DealerProvider-updateDealer()-Seller', function () {
  it('Seller Lower To Dealer', async function () {
    const dealerProviderSellerLowerToDealer = new DealerProvider(
      new SellerInfo(),
      700,
      2330,
      MockCacheForDealerProvider
    )
    await dealerProviderSellerLowerToDealer.updateDealer()
    let result = {
      account: 66,
      broker: 1030,
      symbol: 2330,
      BS: 'buyer',
      orderType: 'limit',
      duration: 'ROD',
      price: 668.88,
      quantity: 10,
      logCreateTime: 1653154020087,
      _id: '628920e4b5ff104924088f45',
      orderStatus: 1,
      createTime: 1653154020083,
      orderTime: '05220083',
      orderID: 6688801000000,
      executionQuantity: 0,
    }
    expect(dealerProviderSellerLowerToDealer.order).to.deep.equal(result)
  })
})

describe('DealerProvider-updateDealer()-Seller', function () {
  it('Seller Highter To Dealer', async function () {
    const dealerProviderSellerHighterToDealer = new DealerProvider(
      new SellerInfo(),
      100,
      2330,
      MockCacheForDealerProvider
    )
    await dealerProviderSellerHighterToDealer.updateDealer()
    expect(dealerProviderSellerHighterToDealer.order).to.deep.equal(null)
  })
})

describe('DealerProvider-updateDealer()-Seller', function () {
  it('Seller Equal To Dealer', async function () {
    const dealerProviderSellerEqualToDealer = new DealerProvider(
      new SellerInfo(),
      668.88,
      2330,
      MockCacheForDealerProvider
    )
    await dealerProviderSellerEqualToDealer.updateDealer()
    let result = {
      account: 66,
      broker: 1030,
      symbol: 2330,
      BS: 'buyer',
      orderType: 'limit',
      duration: 'ROD',
      price: 668.88,
      quantity: 10,
      logCreateTime: 1653154020087,
      _id: '628920e4b5ff104924088f45',
      orderStatus: 1,
      createTime: 1653154020083,
      orderTime: '05220083',
      orderID: 6688801000000,
      executionQuantity: 0,
    }
    expect(dealerProviderSellerEqualToDealer.order).to.deep.equal(result)
  })
})
