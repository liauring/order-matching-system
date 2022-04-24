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
    console.log("Finnn")
    this.setState({
      series: [{
        name: 'candle',
        data: [{
          x: new Date(1538782200000),
          y: [6630.71, 6648.95, 6623.34, 6635.65]
        },
        {
          x: new Date(1538784000000),
          y: [6635.65, 6651, 6629.67, 6638.24]
        },
        {
          x: new Date(1538785800000),
          y: [6638.24, 6640, 6620, 6624.47]
        },]
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

