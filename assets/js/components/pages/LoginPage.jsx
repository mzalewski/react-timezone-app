import React from 'react';
import Auth  from '../../services/Auth.js';
import AddTimezone from '../timezone/AddTimezone.jsx';
import {Link} from 'react-router';
import TimezoneList from '../timezone/TimezoneList.jsx';

import History from '../../services/History';

import {  Alert, Navbar, Nav,  NavItem, NavDropdown, MenuItem, Glyphicon, Row, Grid, Input, Col, Button, Panel } from 'react-bootstrap';



export default class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error:null };
  }
  onChangePassword( evt ) {
  this.setState(Object.assign(this.state,{password:evt.target.value}));
  }
onChangeEmail( evt ) {
  this.setState(Object.assign(this.state,{email:evt.target.value}));
  }
  formatError( code ) { 
    if (code == 'LOGIN_FAILED')
    return "Login failed - please check your email and password";
    return "Login failed";
  }
  onClickLogin( evt ) {
  var obj = this;
  let formatError = this.formatError;
  Auth.login(this.state.email, this.state.password).then(function(){
  
  History().pushState(null,'/timezones');
  },function(error) { 
    
    debugger;
  obj.setState(Object.assign(obj.state,{error: formatError(error.code) }));
  });
  }
  render() {
  let title = <h3>Login using your username and password</h3>;
  let ErrorAlert = this.state.error ? <Alert show={this.state.error} bsStyle="danger">{this.state.error}</Alert> : "";
  return   <div className="container ">
          <Grid fluid="true">
          <Row>
          <Col xs="6" xsOffset="3">
          <Panel header={title}>
          {ErrorAlert}
           <Input
        type="text"
        value={this.state.email}
        onChange={this.onChangeEmail.bind(this)}
        placeholder="Your Email"
        label="Email Address"
        
        groupClassName="group-class"
        labelClassName="label-class"
        />
         <Input
        type="password"
        value={this.state.password}
        placeholder="Your Password"
        label="Password"
        onChange={this.onChangePassword.bind(this)}
        groupClassName="group-class"
        labelClassName="label-class"
        />
        <Button onClick={this.onClickLogin.bind(this)}>Log in</Button> 
        <Link to="register"> or Register </Link>
        </Panel>
          </Col>
          </Row>
          </Grid>
      </div>;
      
  }
}

