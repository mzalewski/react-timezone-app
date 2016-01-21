import React from 'react';
import Immutable from 'immutable';
import TimezoneStore from '../../services/TimezoneStore.js';

import { Input,Grid, Col, Row, Button,Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
  }
  handleEmail(evt) { 
  
  
  this.setState(Object.assign(this.state,{email:evt.target.value}));
  }
  handlePass(evt)  { 
  this.setState(Object.assign(this.state,{pass:evt.target.value}));
 
  }
  
  render() { 
  return <Grid fluid="true">
  <Row><Col  xs="12"><p>Please enter your details to log in</p></Col></Row>
          <Row>
                 <Col xs="6">
                 
          <Input type="text" value={this.state.email} placeholder="Your Email" label="Email" 
                 ref="email"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleEmail.bind(this)} />
                 </Col>
                 <Col xs="6">
          
          <Input type="text" value={this.state.pass} placeholder="Your Password" label="Password" 
                 ref="password"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handlePass.bind(this)} />
                 
                 </Col>
                 
                 </Row>
                 </Grid>;
        
  }
}