const oneMinute = 60000

let socket = io('https://connieplayground.site', {
  transports: ['websocket'],
})
socket.on('connect', () => {
  socket.emit('clientID', 1030)
  console.log(`Socket connect`)
})

var options = {
  chart: {
    height: 350,
    type: 'candlestick',
  },
  title: {
    // text: 'CandleStick Chart - Category X-axis',
    align: 'left',
  },
  series: [
    {
      data: [],
    },
  ],

  xaxis: {
    type: 'datetime',
    labels: {
      format: 'HH:mm',
      datetimeUTC: false,
      style: {
        colors: '#FFF',
      },
    },
  },
  yaxis: {
    decimalsInFloat: 2,
    tooltip: {
      enabled: true,
    },
    labels: {
      style: {
        colors: '#FFF',
      },
    },
  },
  tooltip: {
    x: {
      show: true,
      format: 'HH:mm',
      formatter: undefined,
    },
  },
}

var chart = new ApexCharts(document.querySelector('#chart'), options)

chart.render()

function updateKLine(currentData) {
  chart.appendData([
    {
      data: [currentData],
    },
  ])
}

getKLineDatas().then(() => listenKLineData())

function listenKLineData() {
  socket.on('kLine', function (kLineInfo) {
    // {
    //   executionTime: 1651914862413
    //   price: 538.9
    //   symbol: 2330
    // }
    // console.log('Receive kLine:', kLineInfo)
    receiveKLineInfo(kLineInfo)
  })
}

let currentKLineData = { y: [] }
// {
//   x: new Date().setSeconds(0, 0),
//   y: getRandomData(),
// }

function receiveKLineInfo(kLineInfo) {
  let currentMinute = new Date(kLineInfo.executionTime).setSeconds(0, 0)
  if (!currentKLineData.x) {
    currentKLineData.x = currentMinute
  }

  if (currentKLineData.x == currentMinute) {
    if (currentKLineData.y.length == 0) {
      currentKLineData.y = Array(4).fill(kLineInfo.price)
    } else {
      currentKLineData.y[1] = Math.max(currentKLineData.y[1], kLineInfo.price)
      currentKLineData.y[2] = Math.min(currentKLineData.y[2], kLineInfo.price)
      currentKLineData.y[3] = kLineInfo.price
    }
  } else {
    updateKLine(currentKLineData)
    currentKLineData = { y: [] }
  }
}

async function getKLineDatas() {
  let timestamp = new Date().getTime()
  let response = await axios.get(`https://connieplayground.site/api/kLine/2330?time=${timestamp}`)
  let kLineList = response.data
  if (kLineList.length <= 0) {
    return
  }

  // ???sort
  kLineList.sort((a, b) => {
    return a.executionTime - b.executionTime
  })

  // ?????????????????????(????????????????????????????????????????????????????????????)
  // ?????????????????????????????? kLineList[0].executionTime ?????? ???????????? timestamp
  // ex: ?????????????????? 12160123, ??????????????????????????? 12220000 ??????
  let minuteStartTimestamp = new Date(kLineList[0].executionTime).setSeconds(0, 0) + oneMinute
  let index = 0

  // kLineSlots ???????????????response data
  let kLineSlots = []
  let highestPrice = -1
  let lowestPrice = Number.MAX_SAFE_INTEGER
  // displayKLineArray ???????????????k??????
  // 0: ????????????price
  // 1: ?????????price
  // 2: ?????????price
  // 3: ???????????????price
  let displayKLineArray = []

  while (index < kLineList.length) {
    let current = kLineList[index]
    // ??????????????????????????????????????????(minuteStartTimestamp) ?????? ???????????????
    if (current.executionTime >= minuteStartTimestamp || index == kLineList.length - 1) {
      // ???????????? ???????????? kLineSlots
      let y = []
      if (kLineSlots.length > 0) {
        // ??????????????? kLineSlots
        let firstPrice = kLineSlots[0].price
        let lastPrice = kLineSlots[kLineSlots.length - 1].price
        y = [firstPrice, highestPrice, lowestPrice, lastPrice]
      }

      // reset
      kLineSlots = []
      highestPrice = -1
      lowestPrice = Number.MAX_SAFE_INTEGER

      // x ?????? ???????????? = ????????????upperbound - oneMinute
      displayKLineArray.push({
        x: minuteStartTimestamp - oneMinute,
        y: y,
      })

      // ?????????????????????
      minuteStartTimestamp += oneMinute
      if (index === kLineList.length - 1) {
        // ????????????????????? index ?????? ?????????????????????
        index += 1
      }
    } else {
      // ???????????????????????????????????????(minuteStartTimestamp)
      // ????????????????????? kLineSlots, ??????????????????
      kLineSlots.push(current)
      index += 1
      highestPrice = Math.max(highestPrice, current.price)
      lowestPrice = Math.min(lowestPrice, current.price)
    }
  }
  currentKLineData = displayKLineArray[displayKLineArray.length - 1]
  chart.appendData([
    {
      data: displayKLineArray,
    },
  ])
}

// function setMockDatas() {
//   let threeHourBeforeTimestamp = new Date().setHours(new Date().getHours() - 3, 0, 0, 0)
//   let currentMinuteTimestmap = new Date().setSeconds(0, 0)
//   let slotCount = (currentMinuteTimestmap - threeHourBeforeTimestamp) / oneMinute

//   let datas = Array.apply(null, Array(slotCount)).map(function (_, index) {
//     return {
//       x: threeHourBeforeTimestamp + oneMinute * index,
//       y: getRandomData(),
//     }
//   })

//   chart.appendData([{
//     data: datas,
//   }])
// }

// function getRandomData() {
//   let firstPrice = randomRange(530, 540)
//   let highest = randomRange(540, 550)
//   let lowest = randomRange(530, 540)
//   let lastPrice = randomRange(530, 540)
//   return [firstPrice, highest, lowest, lastPrice]
// }

// function randomRange(min, max) {
//   return parseInt(Math.random() * (max - min) + min)
// }

// setInterval(mockSocketEvent, oneMinute)

// function mockSocketEvent() {

//   chart.appendData([{
//     data: [
//       {
//         x: new Date().setSeconds(0, 0),
//         y: getRandomData(),
//       },

//     ],

//   }])
// }
