let sourceDatas = [
  {
    executionID: '0ed1ef63-6109-4599-b8d0-42679084ec78',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5340060288913',
    },
    sellerOrderTime: '60288913',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5404024822190',
    },
    buyerOrderTime: '24822190',
    symbol: 2330,
    price: 534,
    executionQuantity: 43,
  },
  {
    executionID: '251e1019-9ec9-46dc-acda-6a3d1fd3e73b',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5342960147337',
    },
    sellerOrderTime: '60147337',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5404024822190',
    },
    buyerOrderTime: '24822190',
    symbol: 2330,
    price: 534.3,
    executionQuantity: 14,
  },
  {
    executionID: '6ac1acc9-7eb4-4c88-9b8d-6761862bbe98',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5314061578043',
    },
    sellerOrderTime: '61578043',
    buyer: 5,
    buyerOrderID: {
      $numberLong: '5327024821666',
    },
    buyerOrderTime: '24821666',
    symbol: 2330,
    price: 531.4,
    executionQuantity: 9,
  },
  {
    executionID: '203b5cab-bf20-4a0d-b853-811ac084b23f',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5342960147337',
    },
    sellerOrderTime: '60147337',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5476024821149',
    },
    buyerOrderTime: '24821149',
    symbol: 2330,
    price: 534.3,
    executionQuantity: 43,
  },
  {
    executionID: '1824a660-179c-44fc-8a1f-d86efe2f9252',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5345060205018',
    },
    sellerOrderTime: '60205018',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5476024821149',
    },
    buyerOrderTime: '24821149',
    symbol: 2330,
    price: 534.5,
    executionQuantity: 37,
  },
  {
    executionID: '31d9c50b-4d9f-4488-8a8d-13832d048fec',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5345060205018',
    },
    sellerOrderTime: '60205018',
    buyer: 12,
    buyerOrderID: {
      $numberLong: '5482924819866',
    },
    buyerOrderTime: '24819866',
    symbol: 2330,
    price: 534.5,
    executionQuantity: 20,
  },
  {
    executionID: '20a5f7fe-3eef-4dc0-8651-24801a8e9e0a',
    seller: 31,
    sellerOrderID: {
      $numberLong: '5347960231235',
    },
    sellerOrderTime: '60231235',
    buyer: 12,
    buyerOrderID: {
      $numberLong: '5482924819866',
    },
    buyerOrderTime: '24819866',
    symbol: 2330,
    price: 534.8,
    executionQuantity: 23,
  },
  {
    executionID: '74e8433a-e1b5-44cb-9f69-75c78986f56b',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5355061578581',
    },
    sellerOrderTime: '61578581',
    buyer: 12,
    buyerOrderID: {
      $numberLong: '5482924819866',
    },
    buyerOrderTime: '24819866',
    symbol: 2330,
    price: 535.5,
    executionQuantity: 46,
  },
  {
    executionID: '647eef8a-ff3c-476b-8ba5-d8d0e2263761',
    seller: 13,
    sellerOrderID: {
      $numberLong: '5325061580433',
    },
    sellerOrderTime: '61580433',
    buyer: 5,
    buyerOrderID: {
      $numberLong: '5327024821666',
    },
    buyerOrderTime: '24821666',
    symbol: 2330,
    price: 532.7,
    executionQuantity: 10,
  },
  {
    executionID: '9ff97922-d5e7-4b00-9cfa-5c9862c119ac',
    seller: 13,
    sellerOrderID: {
      $numberLong: '5325061580433',
    },
    sellerOrderTime: '61580433',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5387024819327',
    },
    buyerOrderTime: '24819327',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 69,
  },
  {
    executionID: '90f35736-03a0-4d74-9015-5dbfff23b27e',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5355061578581',
    },
    sellerOrderTime: '61578581',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5387024819327',
    },
    buyerOrderTime: '24819327',
    symbol: 2330,
    price: 535.5,
    executionQuantity: 5,
  },
  {
    executionID: 'c1b4c0d7-4927-433f-ae00-4140d39c964e',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5355061578581',
    },
    sellerOrderTime: '61578581',
    buyer: 5,
    buyerOrderID: {
      $numberLong: '5457924818811',
    },
    buyerOrderTime: '24818811',
    symbol: 2330,
    price: 535.5,
    executionQuantity: 7,
  },
  {
    executionID: '5f44b505-c2d6-4ec0-8741-54d54f41a120',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5352961581481',
    },
    sellerOrderTime: '61581481',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5460024816961',
    },
    buyerOrderTime: '24816961',
    symbol: 2330,
    price: 535.3,
    executionQuantity: 26,
  },
  {
    executionID: '5c89ce7e-d00e-4151-8956-2c05b3d4b34e',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5352961581481',
    },
    sellerOrderTime: '61581481',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5392024816730',
    },
    buyerOrderTime: '24816730',
    symbol: 2330,
    price: 535.3,
    executionQuantity: 11,
  },
  {
    executionID: '9531902e-b1bc-480d-b78b-141288009c6e',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5352961581481',
    },
    sellerOrderTime: '61581481',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5354024815249',
    },
    buyerOrderTime: '24815249',
    symbol: 2330,
    price: 535.3,
    executionQuantity: 17,
  },
  {
    executionID: '8ffdc005-4de1-4811-a688-b88b0f6600ef',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5352961581481',
    },
    sellerOrderTime: '61581481',
    buyer: 20,
    buyerOrderID: {
      $numberLong: '5416024814494',
    },
    buyerOrderTime: '24814494',
    symbol: 2330,
    price: 535.3,
    executionQuantity: 38,
  },
  {
    executionID: '01d5e2c2-a345-475c-a70b-73f8e69d3172',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5355061578581',
    },
    sellerOrderTime: '61578581',
    buyer: 20,
    buyerOrderID: {
      $numberLong: '5416024814494',
    },
    buyerOrderTime: '24814494',
    symbol: 2330,
    price: 535.5,
    executionQuantity: 6,
  },
  {
    executionID: 'b6968211-286d-4426-b694-03a7ddf6cd1e',
    seller: 21,
    sellerOrderID: {
      $numberLong: '5317961585801',
    },
    sellerOrderTime: '61585801',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5347924814978',
    },
    buyerOrderTime: '24814978',
    symbol: 2330,
    price: 534.8,
    executionQuantity: 4,
  },
  {
    executionID: 'e8327b0b-34f0-4b58-96df-85f6865c174b',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5355061578581',
    },
    sellerOrderTime: '61578581',
    buyer: 22,
    buyerOrderID: {
      $numberLong: '5487924813925',
    },
    buyerOrderTime: '24813925',
    symbol: 2330,
    price: 535.5,
    executionQuantity: 15,
  },
  {
    executionID: 'bab7bf12-1fc9-48fb-932d-c3a18a9fbe59',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5360060173554',
    },
    sellerOrderTime: '60173554',
    buyer: 22,
    buyerOrderID: {
      $numberLong: '5487924813925',
    },
    buyerOrderTime: '24813925',
    symbol: 2330,
    price: 536,
    executionQuantity: 69,
  },
  {
    executionID: '17ccc095-dac9-4500-b863-f80a17d8045e',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5360060173554',
    },
    sellerOrderTime: '60173554',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5389024813149',
    },
    buyerOrderTime: '24813149',
    symbol: 2330,
    price: 536,
    executionQuantity: 7,
  },
  {
    executionID: 'bcac7c14-d6f1-4063-809a-24c851bc14c5',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5360060173554',
    },
    sellerOrderTime: '60173554',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5495024812882',
    },
    buyerOrderTime: '24812882',
    symbol: 2330,
    price: 536,
    executionQuantity: 9,
  },
  {
    executionID: 'f8f383cb-c4b3-4a6e-85f4-212e84b082c8',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5362060126367',
    },
    sellerOrderTime: '60126367',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5495024812882',
    },
    buyerOrderTime: '24812882',
    symbol: 2330,
    price: 536.2,
    executionQuantity: 25,
  },
  {
    executionID: '751edc50-ddd3-4954-8def-490754c6c16e',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5362060299398',
    },
    sellerOrderTime: '60299398',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5495024812882',
    },
    buyerOrderTime: '24812882',
    symbol: 2330,
    price: 536.2,
    executionQuantity: 19,
  },
  {
    executionID: 'e8686a95-b748-41ed-83eb-25df89f8fb40',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5366061586537',
    },
    sellerOrderTime: '61586537',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5495024812882',
    },
    buyerOrderTime: '24812882',
    symbol: 2330,
    price: 536.6,
    executionQuantity: 16,
  },
  {
    executionID: '15c53be5-1ee1-4e82-a3ca-307693372193',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5347061587589',
    },
    sellerOrderTime: '61587589',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5347924814978',
    },
    buyerOrderTime: '24814978',
    symbol: 2330,
    price: 534.8,
    executionQuantity: 16,
  },
  {
    executionID: '6de75600-c67a-416d-bbcf-8e2fa61b8965',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5366061586537',
    },
    sellerOrderTime: '61586537',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5482924811360',
    },
    buyerOrderTime: '24811360',
    symbol: 2330,
    price: 536.6,
    executionQuantity: 22,
  },
  {
    executionID: 'cc7323cd-87a8-41ce-8528-0d58ffb0560e',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5307061588953',
    },
    sellerOrderTime: '61588953',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5347924814978',
    },
    buyerOrderTime: '24814978',
    symbol: 2330,
    price: 534.8,
    executionQuantity: 23,
  },
  {
    executionID: '5b477b75-ae43-4254-9595-9343def56d56',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5366061586537',
    },
    sellerOrderTime: '61586537',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5445024810784',
    },
    buyerOrderTime: '24810784',
    symbol: 2330,
    price: 536.6,
    executionQuantity: 35,
  },
  {
    executionID: '0e5c5148-c54e-4862-847c-6b2b7f2e9e9a',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5376060189417',
    },
    sellerOrderTime: '60189417',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5445024810784',
    },
    buyerOrderTime: '24810784',
    symbol: 2330,
    price: 537.6,
    executionQuantity: 22,
  },
  {
    executionID: 'c113f461-a15e-4418-92b7-f5e97ee55957',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5394060309882',
    },
    sellerOrderTime: '60309882',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5445024810784',
    },
    buyerOrderTime: '24810784',
    symbol: 2330,
    price: 539.4,
    executionQuantity: 41,
  },
  {
    executionID: '35eec8d2-2f99-4a63-a001-a07ef5ab5e1c',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5364061589698',
    },
    sellerOrderTime: '61589698',
    buyer: 28,
    buyerOrderID: {
      $numberLong: '5400024809731',
    },
    buyerOrderTime: '24809731',
    symbol: 2330,
    price: 536.4,
    executionQuantity: 19,
  },
  {
    executionID: '25b978e1-5382-4877-b8a0-045722ca246d',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5364061589698',
    },
    sellerOrderTime: '61589698',
    buyer: 30,
    buyerOrderID: {
      $numberLong: '5376024809261',
    },
    buyerOrderTime: '24809261',
    symbol: 2330,
    price: 536.4,
    executionQuantity: 71,
  },
  {
    executionID: '21545808-9aa3-4faa-a6a8-d4bf9755ae15',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5394060309882',
    },
    sellerOrderTime: '60309882',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5407024808216',
    },
    buyerOrderTime: '24808216',
    symbol: 2330,
    price: 539.4,
    executionQuantity: 34,
  },
  {
    executionID: '907c1a6c-63f5-45e9-a930-b7057a08d9b0',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5396061584351',
    },
    sellerOrderTime: '61584351',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5407024808216',
    },
    buyerOrderTime: '24808216',
    symbol: 2330,
    price: 539.6,
    executionQuantity: 29,
  },
  {
    executionID: 'f2e66cff-3bbf-4e18-8cc6-6e756d06f772',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5334061592091',
    },
    sellerOrderTime: '61592091',
    buyer: 30,
    buyerOrderID: {
      $numberLong: '5376024809261',
    },
    buyerOrderTime: '24809261',
    symbol: 2330,
    price: 537.6,
    executionQuantity: 28,
  },
  {
    executionID: '3c7b5fca-a885-4571-9867-e94277df0631',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5334061592091',
    },
    sellerOrderTime: '61592091',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5361024810002',
    },
    buyerOrderTime: '24810002',
    symbol: 2330,
    price: 536.1,
    executionQuantity: 8,
  },
  {
    executionID: '52f535c3-c613-4773-b307-8c65edd17b0c',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5320061592358',
    },
    sellerOrderTime: '61592358',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5361024810002',
    },
    buyerOrderTime: '24810002',
    symbol: 2330,
    price: 536.1,
    executionQuantity: 56,
  },
  {
    executionID: '497517de-515f-41e9-9a85-376dd7b877f6',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5396061584351',
    },
    sellerOrderTime: '61584351',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5464024807398',
    },
    buyerOrderTime: '24807398',
    symbol: 2330,
    price: 539.6,
    executionQuantity: 1,
  },
  {
    executionID: '04ee3749-1973-4ea7-b78a-1121229c2956',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5396061584351',
    },
    sellerOrderTime: '61584351',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5461024807165',
    },
    buyerOrderTime: '24807165',
    symbol: 2330,
    price: 539.6,
    executionQuantity: 52,
  },
  {
    executionID: '651ec7f3-07ca-4ebb-a72a-810095cd224f',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5397960267940',
    },
    sellerOrderTime: '60267940',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5461024807165',
    },
    buyerOrderTime: '24807165',
    symbol: 2330,
    price: 539.8,
    executionQuantity: 2,
  },
  {
    executionID: '83392efd-d149-44f0-9436-1a4541d49dbd',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5399059796075',
    },
    sellerOrderTime: '59796075',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5461024807165',
    },
    buyerOrderTime: '24807165',
    symbol: 2330,
    price: 539.9,
    executionQuantity: 6,
  },
  {
    executionID: '618ba4e7-212e-4a07-b690-af9bb9eba954',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5401059237206',
    },
    sellerOrderTime: '59237206',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5461024807165',
    },
    buyerOrderTime: '24807165',
    symbol: 2330,
    price: 540.1,
    executionQuantity: 6,
  },
  {
    executionID: '6674e546-8a2a-4ee0-a208-b9940737c47f',
    seller: 2,
    sellerOrderID: {
      $numberLong: '5359061593408',
    },
    sellerOrderTime: '61593408',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5361024810002',
    },
    buyerOrderTime: '24810002',
    symbol: 2330,
    price: 536.1,
    executionQuantity: 14,
  },
  {
    executionID: '8e6aa370-77f3-46b6-94a4-4105e90ad560',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5341061593646',
    },
    sellerOrderTime: '61593646',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5361024810002',
    },
    buyerOrderTime: '24810002',
    symbol: 2330,
    price: 536.1,
    executionQuantity: 15,
  },
  {
    executionID: '2ac4a636-c11f-4051-8e73-1725dee5bb44',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5341061593646',
    },
    sellerOrderTime: '61593646',
    buyer: 29,
    buyerOrderID: {
      $numberLong: '5354024809495',
    },
    buyerOrderTime: '24809495',
    symbol: 2330,
    price: 535.4,
    executionQuantity: 18,
  },
  {
    executionID: '4a526a0b-e1f0-4d75-842f-3a231180a29d',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5341061593646',
    },
    sellerOrderTime: '61593646',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5347924814978',
    },
    buyerOrderTime: '24814978',
    symbol: 2330,
    price: 534.8,
    executionQuantity: 23,
  },
  {
    executionID: '888a7fe0-feeb-4db1-a586-46f1c48c840f',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5341061593646',
    },
    sellerOrderTime: '61593646',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5342024818277',
    },
    buyerOrderTime: '24818277',
    symbol: 2330,
    price: 534.2,
    executionQuantity: 36,
  },
  {
    executionID: 'c65af030-9218-4ba2-a473-9291ead30b0f',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5331061593905',
    },
    sellerOrderTime: '61593905',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5342024818277',
    },
    buyerOrderTime: '24818277',
    symbol: 2330,
    price: 534.2,
    executionQuantity: 15,
  },
  {
    executionID: '8372f077-ddf7-46d3-9d02-0882f382e32d',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5315061594457',
    },
    sellerOrderTime: '61594457',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5325024811591',
    },
    buyerOrderTime: '24811591',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 26,
  },
  {
    executionID: '24378008-c31a-48ec-a26f-aa221c51f2e2',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5309061595228',
    },
    sellerOrderTime: '61595228',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5325024811591',
    },
    buyerOrderTime: '24811591',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 11,
  },
  {
    executionID: '402545ce-52da-4172-aa9f-f89087f3b585',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5307061596674',
    },
    sellerOrderTime: '61596674',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5325024811591',
    },
    buyerOrderTime: '24811591',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 37,
  },
  {
    executionID: 'a6f27ef7-c25f-4068-a469-c7baab9803da',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5316061596917',
    },
    sellerOrderTime: '61596917',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5325024811591',
    },
    buyerOrderTime: '24811591',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 3,
  },
  {
    executionID: '2291f1e0-cc39-4a82-961b-f17681edb2df',
    seller: 21,
    sellerOrderID: {
      $numberLong: '5321061598259',
    },
    sellerOrderTime: '61598259',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5325024811591',
    },
    buyerOrderTime: '24811591',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 4,
  },
  {
    executionID: '96850a5d-6dbb-471b-b323-5e419ef82283',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5307961599314',
    },
    sellerOrderTime: '61599314',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5325024811591',
    },
    buyerOrderTime: '24811591',
    symbol: 2330,
    price: 532.5,
    executionQuantity: 3,
  },
  {
    executionID: '2b69b513-3dc2-42cf-be3e-05bf414692d9',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5307961599314',
    },
    sellerOrderTime: '61599314',
    buyer: 11,
    buyerOrderID: {
      $numberLong: '5319024820099',
    },
    buyerOrderTime: '24820099',
    symbol: 2330,
    price: 531.9,
    executionQuantity: 21,
  },
  {
    executionID: 'd1caa6ca-2f68-4d13-8af9-78ae0909d8cc',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5302961601105',
    },
    sellerOrderTime: '61601105',
    buyer: 11,
    buyerOrderID: {
      $numberLong: '5319024820099',
    },
    buyerOrderTime: '24820099',
    symbol: 2330,
    price: 531.9,
    executionQuantity: 25,
  },
  {
    executionID: 'a3c89ceb-32e7-498c-8d0a-e3af2b322de2',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5302961601105',
    },
    sellerOrderTime: '61601105',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5310026867285',
    },
    buyerOrderTime: '26867285',
    symbol: 2330,
    price: 531,
    executionQuantity: 8,
  },
  {
    executionID: '9433006a-df60-4703-b1b5-4414f565c8bb',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5331061593905',
    },
    sellerOrderTime: '61593905',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5351024797833',
    },
    buyerOrderTime: '24797833',
    symbol: 2330,
    price: 533.1,
    executionQuantity: 46,
  },
  {
    executionID: '27d4f413-03fb-485b-8cd0-c840979755a0',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5332061602454',
    },
    sellerOrderTime: '61602454',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5351024797833',
    },
    buyerOrderTime: '24797833',
    symbol: 2330,
    price: 535.1,
    executionQuantity: 15,
  },
  {
    executionID: 'b9101f71-f81c-43e7-b73d-5252d75d0931',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5332061602454',
    },
    sellerOrderTime: '61602454',
    buyer: 5,
    buyerOrderID: {
      $numberLong: '5421024797313',
    },
    buyerOrderTime: '24797313',
    symbol: 2330,
    price: 533.2,
    executionQuantity: 2,
  },
  {
    executionID: '22df3ca0-b238-4e07-ad74-267cc88aae2a',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5332061602454',
    },
    sellerOrderTime: '61602454',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5430024796802',
    },
    buyerOrderTime: '24796802',
    symbol: 2330,
    price: 533.2,
    executionQuantity: 40,
  },
  {
    executionID: 'f5187e57-ee50-4a2b-b432-106d784be25e',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5301061603501',
    },
    sellerOrderTime: '61603501',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5310026867285',
    },
    buyerOrderTime: '26867285',
    symbol: 2330,
    price: 531,
    executionQuantity: 20,
  },
  {
    executionID: '7e1e45cf-4805-4c63-af7b-71617786f6a3',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5332061602454',
    },
    sellerOrderTime: '61602454',
    buyer: 11,
    buyerOrderID: {
      $numberLong: '5337024795717',
    },
    buyerOrderTime: '24795717',
    symbol: 2330,
    price: 533.2,
    executionQuantity: 12,
  },
  {
    executionID: '84ffa5ef-244c-48a4-a09e-c6c094d65751',
    seller: 1,
    sellerOrderID: {
      $numberLong: '5356061601643',
    },
    sellerOrderTime: '61601643',
    buyer: 12,
    buyerOrderID: {
      $numberLong: '5417024795325',
    },
    buyerOrderTime: '24795325',
    symbol: 2330,
    price: 535.6,
    executionQuantity: 14,
  },
  {
    executionID: 'da703cf4-2fbb-470c-91d7-bc0c9a3ff82f',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5357961597957',
    },
    sellerOrderTime: '61597957',
    buyer: 12,
    buyerOrderID: {
      $numberLong: '5417024795325',
    },
    buyerOrderTime: '24795325',
    symbol: 2330,
    price: 535.8,
    executionQuantity: 33,
  },
  {
    executionID: 'ff0ba26f-388f-452b-9124-c4e5fa716d4a',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5371061597452',
    },
    sellerOrderTime: '61597452',
    buyer: 12,
    buyerOrderID: {
      $numberLong: '5417024795325',
    },
    buyerOrderTime: '24795325',
    symbol: 2330,
    price: 537.1,
    executionQuantity: 6,
  },
  {
    executionID: '8934263c-75ec-496f-bb87-b3d95d584e63',
    seller: 13,
    sellerOrderID: {
      $numberLong: '5302961604941',
    },
    sellerOrderTime: '61604941',
    buyer: 11,
    buyerOrderID: {
      $numberLong: '5337024795717',
    },
    buyerOrderTime: '24795717',
    symbol: 2330,
    price: 533.7,
    executionQuantity: 63,
  },
  {
    executionID: '4ff0f043-ed72-4d66-8e25-d2824dbcda75',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5371061597452',
    },
    sellerOrderTime: '61597452',
    buyer: 3,
    buyerOrderID: {
      $numberLong: '5420024794819',
    },
    buyerOrderTime: '24794819',
    symbol: 2330,
    price: 537.1,
    executionQuantity: 4,
  },
  {
    executionID: '83b81327-93ac-4d71-860b-de428e3e9027',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5357061605414',
    },
    sellerOrderTime: '61605414',
    buyer: 5,
    buyerOrderID: {
      $numberLong: '5387024794257',
    },
    buyerOrderTime: '24794257',
    symbol: 2330,
    price: 535.7,
    executionQuantity: 7,
  },
  {
    executionID: '14eba8a6-ce3a-4081-bad3-8141ef28bf92',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5371061597452',
    },
    sellerOrderTime: '61597452',
    buyer: 5,
    buyerOrderID: {
      $numberLong: '5387024794257',
    },
    buyerOrderTime: '24794257',
    symbol: 2330,
    price: 537.1,
    executionQuantity: 13,
  },
  {
    executionID: 'af075711-83e5-4e36-b5e3-a5aca2b15d12',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5371061597452',
    },
    sellerOrderTime: '61597452',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5386024793696',
    },
    buyerOrderTime: '24793696',
    symbol: 2330,
    price: 537.1,
    executionQuantity: 21,
  },
  {
    executionID: '3eb0eb1b-d50b-480e-9615-ce12bcbc76ca',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5374061594694',
    },
    sellerOrderTime: '61594694',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5386024793696',
    },
    buyerOrderTime: '24793696',
    symbol: 2330,
    price: 537.4,
    executionQuantity: 11,
  },
  {
    executionID: '6f3f9431-b95e-422c-b6a2-cb618089966c',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5305061607163',
    },
    sellerOrderTime: '61607163',
    buyer: 11,
    buyerOrderID: {
      $numberLong: '5337024795717',
    },
    buyerOrderTime: '24795717',
    symbol: 2330,
    price: 533.7,
    executionQuantity: 23,
  },
  {
    executionID: 'b7ddd28b-6769-423e-9ed4-b6cbfcba8099',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5305061607163',
    },
    sellerOrderTime: '61607163',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5310026867285',
    },
    buyerOrderTime: '26867285',
    symbol: 2330,
    price: 531,
    executionQuantity: 27,
  },
  {
    executionID: 'e45dc6db-00b6-4623-9ee3-4b5926a34330',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5374061594694',
    },
    sellerOrderTime: '61594694',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5487924792173',
    },
    buyerOrderTime: '24792173',
    symbol: 2330,
    price: 537.4,
    executionQuantity: 23,
  },
  {
    executionID: 'c8a32777-b6da-4652-901c-0e718a10f488',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5377961600869',
    },
    sellerOrderTime: '61600869',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5487924792173',
    },
    buyerOrderTime: '24792173',
    symbol: 2330,
    price: 537.8,
    executionQuantity: 9,
  },
  {
    executionID: 'e730b068-b9a0-4d09-b4f1-9d194c9631e4',
    seller: 13,
    sellerOrderID: {
      $numberLong: '5389061594926',
    },
    sellerOrderTime: '61594926',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5487924792173',
    },
    buyerOrderTime: '24792173',
    symbol: 2330,
    price: 538.9,
    executionQuantity: 18,
  },
  {
    executionID: 'b19fe064-0abb-4210-b98b-de183d11d8c1',
    seller: 13,
    sellerOrderID: {
      $numberLong: '5389061594926',
    },
    sellerOrderTime: '61594926',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5431024791909',
    },
    buyerOrderTime: '24791909',
    symbol: 2330,
    price: 538.9,
    executionQuantity: 26,
  },
  {
    executionID: 'b42549b1-29b5-48b9-953c-a0f4869dffec',
    seller: 13,
    sellerOrderID: {
      $numberLong: '5389061594926',
    },
    sellerOrderTime: '61594926',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5436024790396',
    },
    buyerOrderTime: '24790396',
    symbol: 2330,
    price: 538.9,
    executionQuantity: 55,
  },
  {
    executionID: 'b91441f3-1811-44a5-b86f-3bd0ea93498f',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5390061599011',
    },
    sellerOrderTime: '61599011',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5436024790396',
    },
    buyerOrderTime: '24790396',
    symbol: 2330,
    price: 539,
    executionQuantity: 44,
  },
  {
    executionID: 'b591b789-1c39-43c4-8103-5c28fc3b19d2',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5390061599011',
    },
    sellerOrderTime: '61599011',
    buyer: 20,
    buyerOrderID: {
      $numberLong: '5410024789813',
    },
    buyerOrderTime: '24789813',
    symbol: 2330,
    price: 539,
    executionQuantity: 15,
  },
  {
    executionID: 'c24bbc06-3c3c-4e81-a960-0df3870690dd',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5396061598493',
    },
    sellerOrderTime: '61598493',
    buyer: 20,
    buyerOrderID: {
      $numberLong: '5410024789813',
    },
    buyerOrderTime: '24789813',
    symbol: 2330,
    price: 539.6,
    executionQuantity: 37,
  },
  {
    executionID: '17b02a95-d0aa-4e3e-81a8-c88a8fb8e144',
    seller: 14,
    sellerOrderID: {
      $numberLong: '5325061611239',
    },
    sellerOrderTime: '61611239',
    buyer: 22,
    buyerOrderID: {
      $numberLong: '5377924789332',
    },
    buyerOrderTime: '24789332',
    symbol: 2330,
    price: 537.8,
    executionQuantity: 14,
  },
  {
    executionID: '6ed3610a-0c9e-497e-8cbc-d933ea12da36',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5396061598493',
    },
    sellerOrderTime: '61598493',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5496024788279',
    },
    buyerOrderTime: '24788279',
    symbol: 2330,
    price: 539.6,
    executionQuantity: 15,
  },
  {
    executionID: '501dd0e1-279e-41e7-b2a0-57c2124961ef',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5366061612025',
    },
    sellerOrderTime: '61612025',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5387024788519',
    },
    buyerOrderTime: '24788519',
    symbol: 2330,
    price: 538.7,
    executionQuantity: 17,
  },
  {
    executionID: '7fb62535-5035-40bb-b067-63ae41d3e7ae',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5387961612756',
    },
    sellerOrderTime: '61612756',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5436024786939',
    },
    buyerOrderTime: '24786939',
    symbol: 2330,
    price: 538.8,
    executionQuantity: 11,
  },
  {
    executionID: '8b068f3f-f51c-41af-afc6-1b4672a190ca',
    seller: 23,
    sellerOrderID: {
      $numberLong: '5396061598493',
    },
    sellerOrderTime: '61598493',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5436024786939',
    },
    buyerOrderTime: '24786939',
    symbol: 2330,
    price: 539.6,
    executionQuantity: 7,
  },
  {
    executionID: 'c75086c1-8e11-4a0c-aa9c-5cd7a8244ee4',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5397961604049',
    },
    sellerOrderTime: '61604049',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5436024786939',
    },
    buyerOrderTime: '24786939',
    symbol: 2330,
    price: 539.8,
    executionQuantity: 68,
  },
  {
    executionID: '042c922a-5b17-4c29-a542-d62bb8f0718b',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5397961604049',
    },
    sellerOrderTime: '61604049',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5472924786668',
    },
    buyerOrderTime: '24786668',
    symbol: 2330,
    price: 539.8,
    executionQuantity: 1,
  },
  {
    executionID: '1fb02377-b7e3-4633-bd51-57c91cd5918b',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5399061596161',
    },
    sellerOrderTime: '61596161',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5472924786668',
    },
    buyerOrderTime: '24786668',
    symbol: 2330,
    price: 539.9,
    executionQuantity: 55,
  },
  {
    executionID: 'a81dbaf2-fb1b-4af2-bf47-d7cf1977398c',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5399061602965',
    },
    sellerOrderTime: '61602965',
    buyer: 18,
    buyerOrderID: {
      $numberLong: '5472924786668',
    },
    buyerOrderTime: '24786668',
    symbol: 2330,
    price: 539.9,
    executionQuantity: 14,
  },
  {
    executionID: '9f1d4266-7133-47a4-a2b3-22cea5157249',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5392961613561',
    },
    sellerOrderTime: '61613561',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5416024786205',
    },
    buyerOrderTime: '24786205',
    symbol: 2330,
    price: 539.3,
    executionQuantity: 29,
  },
  {
    executionID: 'ecb94358-532c-4330-b14c-cc87831ec258',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5367061614382',
    },
    sellerOrderTime: '61614382',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5387024788519',
    },
    buyerOrderTime: '24788519',
    symbol: 2330,
    price: 538.7,
    executionQuantity: 43,
  },
  {
    executionID: '3bd99c05-0f17-434b-92aa-05337822c32b',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5392961613561',
    },
    sellerOrderTime: '61613561',
    buyer: 29,
    buyerOrderID: {
      $numberLong: '5492024784842',
    },
    buyerOrderTime: '24784842',
    symbol: 2330,
    price: 539.3,
    executionQuantity: 43,
  },
  {
    executionID: 'bc496b4d-44b9-4a16-ab3d-8b3bf8012e3c',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5392961613561',
    },
    sellerOrderTime: '61613561',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5440024784105',
    },
    buyerOrderTime: '24784105',
    symbol: 2330,
    price: 539.3,
    executionQuantity: 23,
  },
  {
    executionID: 'a8aab9c1-82a0-42c8-812e-60676a55c551',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5399061602965',
    },
    sellerOrderTime: '61602965',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5440024784105',
    },
    buyerOrderTime: '24784105',
    symbol: 2330,
    price: 539.9,
    executionQuantity: 10,
  },
  {
    executionID: 'b7f5a3b6-a99b-4c3c-8bd3-01fcf314d2ff',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5399061602965',
    },
    sellerOrderTime: '61602965',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5407024783520',
    },
    buyerOrderTime: '24783520',
    symbol: 2330,
    price: 539.9,
    executionQuantity: 12,
  },
  {
    executionID: 'b459093b-fb98-401f-8340-8a0c6e240139',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5399061602965',
    },
    sellerOrderTime: '61602965',
    buyer: 7,
    buyerOrderID: {
      $numberLong: '5450024782472',
    },
    buyerOrderTime: '24782472',
    symbol: 2330,
    price: 539.9,
    executionQuantity: 27,
  },
  {
    executionID: '103037c8-b84f-4820-b384-8db13d795a3f',
    seller: 2,
    sellerOrderID: {
      $numberLong: '5351061617990',
    },
    sellerOrderTime: '61617990',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5387024788519',
    },
    buyerOrderTime: '24788519',
    symbol: 2330,
    price: 538.7,
    executionQuantity: 20,
  },
  {
    executionID: 'c9b9fd2a-378a-4236-afa6-992f5699e887',
    seller: 2,
    sellerOrderID: {
      $numberLong: '5351061617990',
    },
    sellerOrderTime: '61617990',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5381024785380',
    },
    buyerOrderTime: '24785380',
    symbol: 2330,
    price: 538.1,
    executionQuantity: 39,
  },
  {
    executionID: '4f56aa26-1219-4099-9a12-5e89396b33fb',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5346061618806',
    },
    sellerOrderTime: '61618806',
    buyer: 27,
    buyerOrderID: {
      $numberLong: '5381024785380',
    },
    buyerOrderTime: '24785380',
    symbol: 2330,
    price: 538.1,
    executionQuantity: 45,
  },
  {
    executionID: 'c980599a-7f29-4b99-acfd-d5e80a23a523',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5346061618806',
    },
    sellerOrderTime: '61618806',
    buyer: 22,
    buyerOrderID: {
      $numberLong: '5377924789332',
    },
    buyerOrderTime: '24789332',
    symbol: 2330,
    price: 537.8,
    executionQuantity: 45,
  },
  {
    executionID: '2b71141d-ef49-4e0e-a842-c11cc9890210',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5346061618806',
    },
    sellerOrderTime: '61618806',
    buyer: 30,
    buyerOrderID: {
      $numberLong: '5376024784570',
    },
    buyerOrderTime: '24784570',
    symbol: 2330,
    price: 537.6,
    executionQuantity: 6,
  },
  {
    executionID: '7f111d72-63b9-4f53-bb79-efb905229b4d',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5355061619353',
    },
    sellerOrderTime: '61619353',
    buyer: 30,
    buyerOrderID: {
      $numberLong: '5376024784570',
    },
    buyerOrderTime: '24784570',
    symbol: 2330,
    price: 537.6,
    executionQuantity: 12,
  },
  {
    executionID: 'bf69d19b-13b2-4acb-8ffd-6e14f2d3e41c',
    seller: 4,
    sellerOrderID: {
      $numberLong: '5362061619856',
    },
    sellerOrderTime: '61619856',
    buyer: 30,
    buyerOrderID: {
      $numberLong: '5376024784570',
    },
    buyerOrderTime: '24784570',
    symbol: 2330,
    price: 537.6,
    executionQuantity: 63,
  },
  {
    executionID: 'aaa06450-780a-42d9-86ee-f9c524fce4fd',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5337961620676',
    },
    sellerOrderTime: '61620676',
    buyer: 17,
    buyerOrderID: {
      $numberLong: '5362024790630',
    },
    buyerOrderTime: '24790630',
    symbol: 2330,
    price: 536.2,
    executionQuantity: 60,
  },
  {
    executionID: 'c6891700-0233-403e-9604-fce2e5200196',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5317961622499',
    },
    sellerOrderTime: '61622499',
    buyer: 28,
    buyerOrderID: {
      $numberLong: '5330024785151',
    },
    buyerOrderTime: '24785151',
    symbol: 2330,
    price: 533,
    executionQuantity: 53,
  },
  {
    executionID: 'c6d0f239-3610-4894-b2b4-8fe0a2a77747',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5317961622499',
    },
    sellerOrderTime: '61622499',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5326024782747',
    },
    buyerOrderTime: '24782747',
    symbol: 2330,
    price: 532.6,
    executionQuantity: 14,
  },
  {
    executionID: '864e1a45-e005-465e-a32e-bd2e013fb821',
    seller: 10,
    sellerOrderID: {
      $numberLong: '5320061624053',
    },
    sellerOrderTime: '61624053',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5326024782747',
    },
    buyerOrderTime: '24782747',
    symbol: 2330,
    price: 532.6,
    executionQuantity: 11,
  },
  {
    executionID: '33588732-c287-4877-9f42-9fcb12f351f3',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5305061624289',
    },
    sellerOrderTime: '61624289',
    buyer: 15,
    buyerOrderID: {
      $numberLong: '5326024782747',
    },
    buyerOrderTime: '24782747',
    symbol: 2330,
    price: 532.6,
    executionQuantity: 5,
  },
  {
    executionID: 'c618e188-95e6-4e82-a297-053a3f7d6d9a',
    seller: 16,
    sellerOrderID: {
      $numberLong: '5305061624289',
    },
    sellerOrderTime: '61624289',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5314024785893',
    },
    buyerOrderTime: '24785893',
    symbol: 2330,
    price: 531.4,
    executionQuantity: 33,
  },
  {
    executionID: 'e8fe05fb-d38b-4582-934b-0afda4b8b70a',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5309061625355',
    },
    sellerOrderTime: '61625355',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5314024785893',
    },
    buyerOrderTime: '24785893',
    symbol: 2330,
    price: 531.4,
    executionQuantity: 64,
  },
  {
    executionID: '92cdc102-cf89-4c57-a242-c0690d20f5f7',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5309061625355',
    },
    sellerOrderTime: '61625355',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5310026867285',
    },
    buyerOrderTime: '26867285',
    symbol: 2330,
    price: 531,
    executionQuantity: 7,
  },
  {
    executionID: 'a2e1493f-b3d5-4278-bbc2-f370c7b66c03',
    seller: 26,
    sellerOrderID: {
      $numberLong: '5309061625355',
    },
    sellerOrderTime: '61625355',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5310024810547',
    },
    buyerOrderTime: '24810547',
    symbol: 2330,
    price: 531,
    executionQuantity: 12,
  },
  {
    executionID: '4c42d351-a079-4728-80c5-418065352ff5',
    seller: 19,
    sellerOrderID: {
      $numberLong: '5302961629542',
    },
    sellerOrderTime: '61629542',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5310024810547',
    },
    buyerOrderTime: '24810547',
    symbol: 2330,
    price: 531,
    executionQuantity: 12,
  },
  {
    executionID: '8ac3809d-fe0a-4e4c-8be9-351443c7ddbe',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5315061626390',
    },
    sellerOrderTime: '61626390',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5487924770161',
    },
    buyerOrderTime: '24770161',
    symbol: 2330,
    price: 531.5,
    executionQuantity: 21,
  },
  {
    executionID: '26647180-9611-4870-9428-a1dc0f4353ba',
    seller: 8,
    sellerOrderID: {
      $numberLong: '5326061626702',
    },
    sellerOrderTime: '61626702',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5487924770161',
    },
    buyerOrderTime: '24770161',
    symbol: 2330,
    price: 532.6,
    executionQuantity: 40,
  },
  {
    executionID: '1f4c91c4-fde9-4a3f-8ad0-fd2c1657e6d6',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5337961620676',
    },
    sellerOrderTime: '61620676',
    buyer: 24,
    buyerOrderID: {
      $numberLong: '5487924770161',
    },
    buyerOrderTime: '24770161',
    symbol: 2330,
    price: 533.8,
    executionQuantity: 25,
  },
  {
    executionID: 'a8e627f9-9a80-4ad3-80e6-64e62d5e2c68',
    seller: 9,
    sellerOrderID: {
      $numberLong: '5337961620676',
    },
    sellerOrderTime: '61620676',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5461024769888',
    },
    buyerOrderTime: '24769888',
    symbol: 2330,
    price: 533.8,
    executionQuantity: 10,
  },
  {
    executionID: 'b96b2881-aa50-4a5b-b3a0-dd7f0b680744',
    seller: 6,
    sellerOrderID: {
      $numberLong: '5340061628015',
    },
    sellerOrderTime: '61628015',
    buyer: 25,
    buyerOrderID: {
      $numberLong: '5461024769888',
    },
    buyerOrderTime: '24769888',
    symbol: 2330,
    price: 534,
    executionQuantity: 47,
  },
]

require('dotenv').config({ path: __dirname + '/./../.env' })
let { mongodbExecArray, mongodbClose } = require('../util/mongodb')

const oneMinute = 60000
const gap = oneMinute / 4
const hoursBefore = 2
let hourBeforeTimestamp = new Date().setHours(new Date().getHours() - hoursBefore, 0, 0, 0)
let currentMinuteTimestmap = new Date().setSeconds(0, 0)
let slotCount = (currentMinuteTimestmap - hourBeforeTimestamp) / gap

let datas = Array.apply(null, Array(slotCount)).map(function (_, index) {
  let sourceIndex = index % sourceDatas.length
  let sourceData = sourceDatas[sourceIndex]
  sourceData['executionTime'] = hourBeforeTimestamp + gap * index
  return sourceData
})

// console.log(datas)
// mongodbExecArray(datas)

// mongodbExec()
;(async () => {
  // let a = await mongodbExecArray(datas)

  let insertResult = await mongodbExecArray(datas)

  console.log('MongoDBInitResult: ', insertResult)
  mongodbClose()
  process.exit(0)
})()
