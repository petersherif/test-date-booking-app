import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './sass/main.scss'
import * as serviceWorker from './serviceWorker';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import auth from './store/reducers/auth'
import dates from './store/reducers/dates'
import adminOperations from './store/reducers/adminOperations'
import allStudents from './store/reducers/allStudents'
import allSubjects from './store/reducers/allSubjects'
import allLocations from './store/reducers/allLocations'
import thunk from 'redux-thunk';

const composeEnhancers = (process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose

const reducer = combineReducers({
  auth: auth,
  dates: dates,
  adminOperations: adminOperations,
  allStudents: allStudents,
  allSubjects: allSubjects,
  allLocations: allLocations
})

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
