import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const store2 = createStore(reducer, applyMiddleware(thunk));

export default store2;
