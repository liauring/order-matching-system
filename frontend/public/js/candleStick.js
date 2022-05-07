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
      data: [
        {
          x: new Date(1538778600000),
          y: [6629.81, 6650.5, 6623.04, 6633.33],
        },
        {
          x: new Date(1538780400000),
          y: [6632.01, 6643.59, 6620, 6630.11],
        },
        {
          x: new Date(1538782200000),
          y: [6630.71, 6648.95, 6623.34, 6635.65],
        },
        {
          x: new Date(1538784000000),
          y: [6635.65, 6651, 6629.67, 6638.24],
        },
        {
          x: new Date(1538785800000),
          y: [6638.24, 6640, 6620, 6624.47],
        },
        {
          x: new Date(1538787600000),
          y: [6624.53, 6636.03, 6621.68, 6624.31],
        },
      ],
    },
  ],

  // tooltip: {
  //     enabled: true,
  // },
  xaxis: {
    type: 'category',
    labels: {
      formatter: function (val) {
        return dayjs(val).format('HH:mm:ss')
      },
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
}

var chart = new ApexCharts(document.querySelector('#chart'), options)

chart.render()
