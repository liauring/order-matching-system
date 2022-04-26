import React from "react";
import dayjs from 'dayjs'
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react"
import { Socket } from "../../../global/Socket";

const CandleStick = () => {

  const [kInfo, setKInfo] = useState({
    series:
      [{
        name: 'candle',
        data: []
      }]
  })





  useEffect(() => {
    console.log("Socket effect");
    if (Socket) {
      let lowestPrice, highestPrice, firstPrice, lastPrice, periodMinute;
      Socket.on('kLine', function (kLineInfo) {

        console.log('kLineInfo.executionTime', kLineInfo.executionTime)
        let currentMinute = new Date(kLineInfo.executionTime).setSeconds(0, 0);
        console.log('currentMinute', currentMinute)
        console.log('periodMinute', periodMinute)



        lastPrice = kLineInfo.price;

        if (periodMinute === undefined || periodMinute < currentMinute) {
          periodMinute = currentMinute;
          firstPrice = kLineInfo.price;
        }

        if (lowestPrice === undefined || lowestPrice > kLineInfo.price) {
          lowestPrice = kLineInfo.price
        }

        if (highestPrice === undefined || highestPrice < kLineInfo.price) {
          highestPrice = kLineInfo.price
        }

        let kLine = {
          x: new Date(currentMinute),
          y: [lowestPrice, highestPrice, firstPrice, lastPrice]
        }

        let oldData = JSON.parse(JSON.stringify(kInfo.series[0].data))
        setKInfo({
          series: [{
            name: 'candle',
            data: [...kInfo.series[0].data,
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33]
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11]
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65]
            },
            ]
          }]
        })
        console.log(kLine)
      });
    }
  }, [Socket])

  const addNewK = () => {
    setKInfo({
      series: [{
        name: 'candle',
        data: [...kInfo.series[0].data,
        {
          x: new Date(1538778600000),
          y: [6629.81, 6650.5, 6623.04, 6633.33]
        }
        ]
      }]
    })
  }

  const optionalSetting = {
    options: {
      chart: {
        height: 350,
        type: 'candlestick',
      },
      title: {
        // text: 'CandleStick Chart - Category X-axis',
        align: 'left'
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
                background: '#00E396'
              },
              orientation: 'horizontal',
              offsetY: 7,
              text: 'Annotation Test'
            }
          }
        ]
      },
      tooltip: {
        enabled: true,
      },
      chart: {
        background: '#202130'
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
        monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
        },
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function (val) {
            return dayjs(val).format('MMM DD HH:mm')
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    },
  };
  return (

    < div id="candleStick" >
      {console.log('render')}
      <button onClick={addNewK}>
        Click me
      </button>
      <ReactApexChart options={optionalSetting.options} series={kInfo.series} type="candlestick" height={350} />
      {/* <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} /> */}
    </div >



  );
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

