import React from "react";
import dayjs from 'dayjs'
import ReactApexChart from "react-apexcharts";


class CandleStick extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [{
        name: 'candle',
        data: [
          {
            x: new Date(1538883000000),
            y: [6603.85, 6605, 6600, 6604.07]
          },
          {
            x: new Date(1538884800000),
            y: [6604.98, 6606, 6604.07, 6606]
          },
        ]
      }],
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



  render() {
    return (


      <div id="candleStick ">
        <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} />
      </div>


    );
  }
}

// const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);


export default CandleStick