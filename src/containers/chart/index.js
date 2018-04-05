import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import * as chartActions from '../../modules/chart';
import './chart.css';

export default class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stockChart: [],
      volume: [],
      sma_20_day: [],
      sma_50_day: [],
      flag: []
    }
  }

  componentDidMount() {
    let stockChart = [], volume = [], sma_20_day = [], sma_50_day = [], flag = [];  
    fetch('https://api-dev.snaptrade.us/chart/tickers/AAPL?period=90d', {
      headers: { 'content-type': 'application/json'},
      method: 'GET'
    }).then(response => response.json().then( json => {  
      _.map(json, (item, index) => {
        stockChart.push([
          Date.parse(item.date),
          item.close,
          item.open,
          item.high,
          item.low
        ])
        volume.push([
          Date.parse(item.date),
          item.volume
        ])
        sma_20_day.push([
          Date.parse(item.date),
          item.sma_20_day
        ]) 
        sma_50_day.push([
          Date.parse(item.date),
          item.sma_50_day
        ])
        if(item.latest_signal_unformatted != " ") {
          flag.push({
            y: item.high,
            x: Date.parse(item.date),
            title: " ",         
            text: item.latest_signal_unformatted
          }) 
        }
        
      });  

      stockChart = _.sortBy(stockChart, [function(item) { return item[0]; }]);
      volume = _.sortBy(volume, [function(item) { return item[0]; }]);
      sma_50_day = _.sortBy(sma_50_day, [function(item) { return item[0]; }]);
      sma_20_day = _.sortBy(sma_20_day, [function(item) { return item[0]; }]);
      flag = _.sortBy(flag, [function(item) { return item.x; }]);
      this.setState({ stockChart: stockChart });
      this.setState({ volume: volume });
      this.setState({ sma_50_day: sma_50_day });
      this.setState({ sma_20_day: sma_20_day });
      this.setState({ flag: flag });
    }))
  }
  render() {
    const { stockChart, volume, sma_50_day, sma_20_day, flag } = this.state;
    if(flag.length > 0) {
      const groupingUnits = [[
        'week', 
        [1]
      ], [
        'month',
        [1, 2, 3, 4, 6]
      ]];

      const charts = {
        chart: {
          height: 800
        },
        rangeSelector: {
          selected: 2
        },

        title: {
          text: 'AAPL Historical',
          style: {
            color: '#ffffff'
          }
          
        },

        yAxis: [{
          labels: {
            align: 'right',
            x: -3,
            style: {
              color: '#ffffff'
           }
          },
          title: {
            text: 'AAPL Stock Price'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],

        tooltip: {
          split: true
        },
        plotOptions: {
          series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
             lineColor: '#333'
            }
          },
          boxplot: {
            fillColor: '#505053'
          },
          candlestick: {
           lineColor: 'white'
          },
          errorbar: {
            color: 'white'
          }
        },
        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: stockChart,
            id: "aapl",
            dataGrouping: {
              units: groupingUnits
            }
          },
          {
            type: 'column',
            name: 'Volume',
            data: volume,
            id: 'vlm-series',
            yAxis: 1,
            color: '#1d8489',
            dataGrouping: {
              units: groupingUnits
            }
          },
          {
            name: 'SMA 5',
            data: sma_50_day,
            color: Highcharts.getOptions().colors[4],
            fillColor: '#FFE102',
            tooltip: {
              valueDecimals: 2,
              split: true
            },
          },
          {
            name: 'SMA 20',
            data: sma_20_day,
            color: Highcharts.getOptions().colors[2],
            fillColor: '#FFE102',
            tooltip: {
                valueDecimals: 2,
                split: true
            }
          },
          {
            type: 'flags',
            data: flag,
            onSeries: 'cs-series',
            color: Highcharts.getOptions().colors[0],
            fillColor: '#FFE102',
            shape: 'circlepin'
          }
        ]
      };
      return (
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={charts}
          />

        </div>
      );
    } else {
      return null;
    }    
  }
}
