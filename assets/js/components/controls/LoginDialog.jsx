import React from 'react';
import Immutable from 'immutable';
import TimezoneStore from '../../services/TimezoneStore.js';
import LoginPage from '../pages/LoginPage.jsx';
import { Input,Grid, Col, Row, Button,Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

export default class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: false};
        
  }
   componentDidMount() {
    TimezoneStore.addAuthHandler(this._onAuthRequired.bind(this));
  }

  componentWillUnmount() {
    TimezoneStore.removeAuthHandler(this._onAuthRequired.bind(this));
  }

  _onAuthRequired() {
  
  this.setState({show:true});
  }
  login() { 
        alert('login attempt');
  }
  
  render() { 
  return <Modal show={this.state.show}>
      
          <Modal.Body>
          <LoginPage />
          </Modal.Body>
               
        </Modal>;
  }
}