import React from "react";
import dayjs from 'dayjs'
import ReactApexChart from "react-apexcharts";
import { useState } from "react"


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


    this.delta = this.delta.bind(this);

    this.optionalSetting = {
      options: {
        chart: {
          height: 350,
          type: 'candlestick',
        },
        title: {
          text: 'CandleStick Chart - Category X-axis',
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
          x: new Date(1538780400000),
          y: [6632.01, 6643.59, 6620, 6630.11]
        },

          // {
          //   x: new Date(1538881200000),
          //   y: [6603.5, 6603.99, 6597.5, 6603.86]
          // },
        ]
      }]
    })
  }

  render() {

    return (

      < div id="candleStick " >
        <ReactApexChart options={this.optionalSetting.options} series={this.state.series} type="candlestick" height={350} />
        <button onClick={this.delta}>
          Click me
        </button>
        {/* <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} /> */}
      </div >


    );
  }
}
//this.setState({ count: this.state.count + 1 })
// const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);


export default CandleStick
