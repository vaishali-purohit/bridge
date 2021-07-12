import { combineReducers } from 'redux';
import user from '../reducers/user';
import metamask from '../reducers/metamask';

const createRootReducer = () => combineReducers({
  user,
  metamask,
});

export default createRootReducer;
