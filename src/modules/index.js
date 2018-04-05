import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import chart from './chart';

export default combineReducers({
  router: routerReducer,
  chart
});
