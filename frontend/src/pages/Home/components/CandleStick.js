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

        // console.log('kLineInfo.executionTime', kLineInfo.executionTime)
        let currentMinute = new Date(kLineInfo.executionTime).setSeconds(0, 0);
        // console.log('currentMinute', currentMinute)
        // console.log('periodMinute', periodMinute)
        setKInfo((prev) => {
          let oldData = [...prev.series[0].data];

          let periodK = oldData[oldData.length - 1];

          if (periodMinute === undefined || periodMinute < currentMinute) {
            // new candle
            periodMinute = currentMinute;
            periodK = {
              x: new Date(currentMinute),
              y: [kLineInfo.price, kLineInfo.price, kLineInfo.price, kLineInfo.price]
            }
            oldData.push(periodK);
            console.log("new", currentMinute, kLineInfo.price, periodK.y);
          } else {
            periodK.y[3] = kLineInfo.price
            if (periodK.y[2] > kLineInfo.price) {
              periodK.y[2] = kLineInfo.price
            }

            if (periodK.y[1] < kLineInfo.price) {
              periodK.y[1] = kLineInfo.price
            }
            console.log("old", currentMinute, kLineInfo.price, periodK.y);
          }
          return {
            series: [{
              name: 'candle',
              data: oldData
            }]
          }
        })

      });
    }
  }, [Socket])



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

