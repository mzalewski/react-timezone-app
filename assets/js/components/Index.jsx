// React components
import React from 'react';
import TimezoneApp from './app/TimezoneApp.jsx';
import TimezonePage from './pages/TimezonePage.jsx';
import UserPage from './pages/UserPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import History from '../services/History';
import PropTypes from 'react-router'

import TimezoneStore from '../services/TimezoneStore.js';
import Auth from '../services/Auth.js';

import { Router, Route, Link } from 'react-router';

export default class AppRoutes extends React.Component {

constructor(props){
  super(props);
        this.history = History();
    this.router = <Router  history={this.history}>
    <Route path="/" component={TimezoneApp}>
      <Route path="about" component={AboutPage} />
      <Route path="timezones" component={TimezonePage}/>
      
      <Route path="users" component={UserPage}/>
      
      <Route path="login" component={LoginPage}/>
      <Route path="register" component={RegisterPage}/>
    </Route>
  </Router>;
}
  componentDidMount() {

    Auth.addAuthHandler(this._onAuthRequired.bind(this));
  }

  componentWillUnmount() {
    Auth.removeAuthHandler(this._onAuthRequired.bind(this));
  }

  _onAuthRequired() {
    this.history.pushState(null, '/login');
  }
  render() { 
    return this.router;
  }
  };
  

React.render(
<AppRoutes />
  , document.body
);

