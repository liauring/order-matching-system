import React from "react";
import dayjs from 'dayjs'
import ReactApexChart from "react-apexcharts";
import { useState } from "react"
import { Socket } from "../../../global/Socket";


class CandleStick extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      series:
        [{
          name: 'candle',
          data: []
        }]
    }

    // let kLineInfo = {
    //   stock: order.symbol,
    //   price: bestBuyer.price,
    //   executionTime: executionTime,
    // }

    // Socket.on('kLine', function (kLineInfo) {
    //   setInterval((() => function ()), 60)
    // })


    this.delta = this.delta.bind(this);

    this.optionalSetting = {
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
  }

  delta = () => {
    console.log("coco")
    this.setState({
      series: [{
        name: 'candle',
        data: [...this.state.series[0].data,
        {
          x: new Date(1538778600000),
          y: [6629.81, 6650.5, 6623.04, 6633.33]
        }
        ]
      }]
    })
  }

  render() {

    return (

      < div id="candleStick" >
        <button onClick={this.delta}>
          Click me
        </button>
        <ReactApexChart options={this.optionalSetting.options} series={this.state.series} type="candlestick" height={350} />
        {/* <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} /> */}
      </div >



    );
  }
}


export default CandleStick

