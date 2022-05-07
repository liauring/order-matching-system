import React from 'react'
import dayjs from 'dayjs'
import ReactApexChart from 'react-apexcharts'
import { useEffect, useState } from 'react'
import { useStatus } from '../../../global/useStatus'
import { API_KLINE } from '../../../global/Constants'
import axios from 'axios'

const CandleStick = (symbol) => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will be called every 2 seconds')
      let endTimestamp = new Date().getTime()
      let firstPrice = getRandomArbitrary(530, 540)
      let highest = getRandomArbitrary(540, 550)
      let lowest = getRandomArbitrary(530, 540)
      let lastPrice = getRandomArbitrary(530, 540)

      let newData = {
        x: endTimestamp,
        y: [firstPrice, highest, lowest, lastPrice],
      }
      setKInfo(function (prev) {
        return {
          series: [
            {
              name: 'candle',
              data: [...prev.series[0].data, newData],
            },
          ],
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const { socket } = useStatus()
  const [kInfo, setKInfo] = useState({
    series: [
      {
        name: 'candle',
        data: [],
      },
    ],
  })

  function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min)
  }

  const mockKLineData = () => {
    // {
    //   x: minuteStartTimestamp - minuteToMilliseconds,
    //   y: y
    // }

    // 0: 第一筆的price
    // 1: 最高的price
    // 2: 最低的price
    // 3: 最後一筆的price

    // const oneMinute = 60000
    const oneMinute = 1000

    let slotCount = 60 * 5
    // let endTimestamp = new Date().setSeconds(0, 0);
    let endTimestamp = new Date().getTime()

    let startTimestamp = endTimestamp - oneMinute * slotCount

    let datas = Array.apply(null, Array(slotCount)).map(function (_, index) {
      let firstPrice = getRandomArbitrary(530, 540)
      let highest = getRandomArbitrary(540, 550)
      let lowest = getRandomArbitrary(530, 540)
      let lastPrice = getRandomArbitrary(530, 540)

      return {
        x: startTimestamp + oneMinute * index,
        y: [firstPrice, highest, lowest, lastPrice],
      }
    })

    console.log('finnnnnn', kInfo.series[0].data)

    // setKInfo(function (prev) {
    //   series: [{
    //     name: 'candle',
    //     data: [...prev.series[0].data, datas]
    //   }]
    // })
    setKInfo(function (prev) {
      return {
        series: [
          {
            name: 'candle',
            data: [...prev.series[0].data, ...datas],
          },
        ],
      }
    })
  }

  const getKLineData = async () => {
    let timestamp = new Date().getTime()
    //  data: {
    //    [executionTime: 1651496434670,
    //    price: 540.4,
    //    symbol: 2330]....}
    let response = await axios.get(`${API_KLINE}/2330?time=${timestamp}`)
    let kLineList = response.data
    if (kLineList.length <= 0) {
      return
    }

    // 先sort
    kLineList.sort((a, b) => {
      return a.executionTime - b.executionTime
    })

    //每分鐘的 Milliseconds
    const minuteToMilliseconds = 60000

    // 算出時間區隔點(第一區間是從第一筆的最靠近下個分鐘的時間)
    // 如果要改早上九點就將 kLineList[0].executionTime 替換 早上九點 timestamp
    // ex: 第一個時間是 12160123, 所以他的時段應該在 12220000 之前
    let minuteStartTimestamp = new Date(kLineList[0].executionTime).setSeconds(0, 0) + minuteToMilliseconds
    let index = 0

    // kLineSlots 是區段間的response data
    let kLineSlots = []
    let highestPrice = -1
    let lowestPrice = Number.MAX_SAFE_INTEGER
    // displayKLineArray 是要顯示在k線的
    // 0: 第一筆的price
    // 1: 最高的price
    // 2: 最低的price
    // 3: 最後一筆的price
    let displayKLineArray = []

    while (index < kLineList.length) {
      let current = kLineList[index]
      // 如果當筆資料不在這個時間區段(minuteStartTimestamp) 或者 是最後一則
      if (current.executionTime >= minuteStartTimestamp || index == kLineList.length - 1) {
        // 就會結算 區間內的 kLineSlots
        let y = []
        if (kLineSlots.length > 0) {
          // 結算上一筆 kLineSlots
          let firstPrice = kLineSlots[0].price
          let lastPrice = kLineSlots[kLineSlots.length - 1].price
          y = [firstPrice, highestPrice, lowestPrice, lastPrice]
        }

        // reset
        kLineSlots = []
        highestPrice = -1
        lowestPrice = Number.MAX_SAFE_INTEGER

        // x 軸為 起始時間 = 區間段的upperbound - minuteToMilliseconds
        displayKLineArray.push({
          x: minuteStartTimestamp - minuteToMilliseconds,
          y: y,
        })

        // 增加區間段時間
        minuteStartTimestamp += minuteToMilliseconds
        if (index === kLineList.length - 1) {
          // 最後一則需要將 index 加一 否則會無限迴圈
          index += 1
        }
      } else {
        // 如果當筆資料在這個時間區段(minuteStartTimestamp)
        // 則新增到該區段 kLineSlots, 並且換下一個
        kLineSlots.push(current)
        index += 1
        highestPrice = Math.max(highestPrice, current.price)
        lowestPrice = Math.min(lowestPrice, current.price)
      }
    }

    setKInfo({
      series: [
        {
          name: 'candle',
          data: displayKLineArray,
        },
      ],
    })
  }
  useEffect(() => {
    // getKLineData()
    mockKLineData()
  }, [])

  // let oldestTimestamp = kLineList.reduce(function (prev, curr) {
  //   return prev.executionTime < curr.executionTime ? prev : curr;
  // }).executionTime;

  // const minuteToMilliseconds = 60000
  // let minuteStartTimestamp = new Date(oldestTimestamp).setSeconds(0, 0);
  // let minuteEndTimestamp = new Date().setSeconds(0, 0);
  // let timeSlotCount = (minuteEndTimestamp - minuteStartTimestamp) / minuteToMilliseconds
  // var timeSlotKLineDataArray = Array(timeSlotCount).fill([])

  // kLineList.forEach(element => {
  //   let index = Math.floor((element.executionTime - minuteStartTimestamp) / minuteToMilliseconds)
  //   let array = timeSlotKLineDataArray[index]
  //   timeSlotKLineDataArray[index] = [...array, element]
  // });

  // let displayKLineArray = timeSlotKLineDataArray.map((kLineDatas, index) => {
  //   let startTime = new Date(index * 60000 + minuteStartTimestamp)
  //   let y = []
  //   if (kLineDatas.length > 0) {
  //     let first = kLineDatas.reduce(function (prev, curr) {
  //       return prev.executionTime < curr.executionTime ? prev : curr;
  //     }).price;
  //     let mostExpensive = kLineDatas.reduce(function (prev, curr) {
  //       return prev.price > curr.price ? prev : curr;
  //     }).price;

  //     let cheapest = kLineDatas.reduce(function (prev, curr) {
  //       return prev.price < curr.price ? prev : curr;
  //     }).price;

  //     let last = kLineDatas.reduce(function (prev, curr) {
  //       return prev.executionTime > curr.executionTime ? prev : curr;
  //     }).price;

  //     y = [first, mostExpensive, cheapest, last]
  //   }
  //   return {
  //     x: startTime,
  //     y: y
  //   }
  // })

  useEffect(() => {
    console.log('Socket effect')
    if (socket) {
      let lowestPrice, highestPrice, firstPrice, lastPrice, periodMinute
      socket.on('kLine', function (kLineInfo) {
        // // console.log('kLineInfo.executionTime', kLineInfo.executionTime)
        // let currentMinute = new Date(kLineInfo.executionTime).setSeconds(0, 0)
        // // console.log('currentMinute', currentMinute)
        // // console.log('periodMinute', periodMinute)
        // setKInfo((prev) => {
        //   let oldData = [...prev.series[0].data]
        //   let periodK = oldData[oldData.length - 1]
        //   if (periodMinute === undefined || periodMinute < currentMinute) {
        //     // new candle
        //     periodMinute = currentMinute
        //     periodK = {
        //       x: new Date(currentMinute),
        //       y: [kLineInfo.price, kLineInfo.price, kLineInfo.price, kLineInfo.price],
        //     }
        //     oldData.push(periodK)
        //     console.log('new', currentMinute, kLineInfo.price, periodK.y)
        //   } else {
        //     periodK.y[3] = kLineInfo.price
        //     if (periodK.y[2] > kLineInfo.price) {
        //       periodK.y[2] = kLineInfo.price
        //     }
        //     if (periodK.y[1] < kLineInfo.price) {
        //       periodK.y[1] = kLineInfo.price
        //     }
        //     console.log('old', currentMinute, kLineInfo.price, periodK.y)
        //   }
        //   return {
        //     series: [
        //       {
        //         name: 'candle',
        //         data: oldData,
        //       },
        //     ],
        //   }
        // })
      })
    }
  }, [socket])

  const optionalSetting = {
    options: {
      chart: {
        height: 350,
        type: 'candlestick',
      },
      title: {
        // text: 'CandleStick Chart - Category X-axis',
        align: 'left',
      },
      annotations: {
        xaxis: [
          {
            x: 'Oct 06 14:00',
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                fontSize: '12px',
                color: '#fff',
                background: '#00E396',
              },
              orientation: 'horizontal',
              offsetY: 7,
              text: 'Annotation Test',
            },
          },
        ],
      },
      tooltip: {
        enabled: true,
      },
      chart: {
        background: '#202130',
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
        monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65,
        },
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function (val) {
            return dayjs(val).format('HH:mm:ss')
          },
        },
      },
      yaxis: {
        decimalsInFloat: 2,
        tooltip: {
          enabled: true,
        },
      },
    },
  }
  return (
    <div id="candleStick">
      <ReactApexChart options={optionalSetting.options} series={kInfo.series} type="candlestick" height={350} />
      {/* <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} /> */}
    </div>
  )
}

// class CandleStick extends React.Component {

//   constructor(props) {
//     super(props);

//     this.state = {
//       series:
//         [{
//           name: 'candle',
//           data: []
//         }]
//     }

//     this.delta = this.delta.bind(this);

//     this.optionalSetting = {
//       options: {
//         chart: {
//           height: 350,
//           type: 'candlestick',
//         },
//         title: {
//           // text: 'CandleStick Chart - Category X-axis',
//           align: 'left'
//         },
//         annotations: {
//           xaxis: [
//             {
//               x: 'Oct 06 14:00',
//               borderColor: '#00E396',
//               label: {
//                 borderColor: '#00E396',
//                 style: {
//                   fontSize: '12px',
//                   color: '#fff',
//                   background: '#00E396'
//                 },
//                 orientation: 'horizontal',
//                 offsetY: 7,
//                 text: 'Annotation Test'
//               }
//             }
//           ]
//         },
//         tooltip: {
//           enabled: true,
//         },
//         chart: {
//           background: '#202130'
//         },
//         theme: {
//           mode: 'dark',
//           palette: 'palette1',
//           monochrome: {
//             enabled: false,
//             color: '#255aee',
//             shadeTo: 'light',
//             shadeIntensity: 0.65
//           },
//         },
//         xaxis: {
//           type: 'category',
//           labels: {
//             formatter: function (val) {
//               return dayjs(val).format('MMM DD HH:mm')
//             }
//           }
//         },
//         yaxis: {
//           tooltip: {
//             enabled: true
//           }
//         }
//       },

//     };
//   }

//   delta = () => {
//     console.log("coco")
//     this.setState({
//       series: [{
//         name: 'candle',
//         data: [...this.state.series[0].data,
//         {
//           x: new Date(1538778600000),
//           y: [6629.81, 6650.5, 6623.04, 6633.33]
//         }
//         ]
//       }]
//     })
//   }

//   render() {

//     return (

//       < div id="candleStick" >
//         <button onClick={this.delta}>
//           Click me
//         </button>
//         <ReactApexChart options={this.optionalSetting.options} series={this.state.series} type="candlestick" height={350} />
//         {/* <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} /> */}
//       </div >

//     );
//   }
// }

export default CandleStick
