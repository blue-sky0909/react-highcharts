import fetch from 'isomorphic-fetch';
import _ from 'lodash';

export const FETCHED_DATA_SUCCESS = 'FETCHED_DATA_SUCCESS';

const initialState = {
  data: {},
  isFetched: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHED_DATA_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true
      };

    default:
      return state;
  }
};

export const geData = () => {
  return dispatch => {
    return fetch('https://api-dev.snaptrade.us/chart/tickers/AAPL?period=90d', {
      headers: { 'content-type': 'application/json'},
      method: 'GET'
    }).then(response => response.json().then( json => {   
      let stockChart = [], volume = [], sma_20_day = [], sma_50_day = [], flag = [];
 console.log()     
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
      const data = {
        stockChart: stockChart,
        volume: volume,
        sma_50: sma_50_day,
        sma_20: sma_20_day,
        flag: flag
      };
      dispatch({
        type: FETCHED_DATA_SUCCESS,
        data: data    
      })
    }))
  };
};
