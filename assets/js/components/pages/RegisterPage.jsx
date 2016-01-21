import React from 'react';
import Auth  from '../../services/Auth.js';
import AddTimezone from '../timezone/AddTimezone.jsx';
import {Link} from 'react-router';
import TimezoneList from '../timezone/TimezoneList.jsx';
import {  Alert, Navbar, Nav,  NavItem, NavDropdown, MenuItem, Glyphicon, Row, Grid, Input, Col, Button, Panel } from 'react-bootstrap';


import History from '../../services/History';

export default class RegisterPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: null, email: null, password: null, error:null, confirmpassword:null,firstName: null, lastName: null };
  }
  
  _onRegister() { 
              var obj = this;
              if (this.state.email == null || this.state.firstName == null || this.state.lastName == null || this.state.password == null || this.state.confirmpassword == null) {
              obj.setState(Object.assign(obj.state,{error: "Please complete all fields" }));
              return;
              }
              if (this.validationError('email') != ''||this.validationError('firstName') != ''||this.validationError('lastName') != ''||this.validationError('password') != ''||this.validationError('confirmpassword') != '') {
              
              obj.setState(Object.assign(obj.state,{error: "Please ensure all fields are filled out correctly" }));
              return;
              
              }
              
              
              let formatError = this.formatError;
              Auth.register(this.state.email, this.state.password,this.state.firstName, this.state.lastName).then(function(){
                 
                    History().pushState(null, '/timezones');
                  
              },function(error) { 

                obj.setState(Object.assign(obj.state,{error: error.message }));
              });
  
  }
  validationState(type) {
      
      if (this.state[type] == null)
      return '';
 
      if (this.validationError(type) == '')
        return 'success';
      return 'error';
      
      
  }
  validationError(type) { 
  
   if (type == 'firstName') { 
       if (this.state.firstName === '')
        return 'Please enter a value';
    }
    
    
   if (type == 'lastName') { 
       if (this.state.lastName === '')
        return 'Please enter a value';
    }
    
   if (type == 'email') { 
       if (this.state.email === '')
        return 'Please enter a value';
        
       if (this.state.email!= null && this.state.email.indexOf('@') == -1)
        return 'Please enter a valid email address';
    }
    
   if (type == 'password') { 
       if (this.state.password === '')
        return 'Please enter a value';
    }
    
   if (type == 'confirmpassword') { 
       if (this.state.password !== this.state.confirmpassword)
        return 'Passwords do not match';
    }
 
        
    return '';
  }
  
  onChangePassword( evt ) {
  this.setState(Object.assign(this.state,{password:evt.target.value}));
  }
onChangeEmail( evt ) {
  this.setState(Object.assign(this.state,{email:evt.target.value}));
  }
onChangeLastName( evt ) {
  this.setState(Object.assign(this.state,{lastName:evt.target.value}));
  }
  
onChangeFirstName( evt ) {
  this.setState(Object.assign(this.state,{firstName:evt.target.value}));
  }
onChangeConfirmPassword( evt ) {
  this.setState(Object.assign(this.state,{confirmpassword:evt.target.value}));
  }
  formatError( code ) { 
    if (code == 'LOGIN_FAILED')
    return "Login failed - please check your email and password";
    return "Login failed";
  }
  render() {
  
  let title = <h3>Register account </h3>;
  let ErrorAlert = this.state.error ? <Alert show={this.state.error} bsStyle="danger">{this.state.error}</Alert> : "";
  return   <div className="container ">
          <Grid fluid="true">
          <Row>
          <Col xs="6" xsOffset="3">
          <Panel header={title}>
          {ErrorAlert}
           <Grid fluid="true">
          <Row>
          
        <Col xs="6">
               <Input
        type="text"
        value={this.state.firstName}
        onChange={this.onChangeFirstName.bind(this)}
        placeholder="First Name"
        label="First Name"
         help={this.validationError('firstName')} bsStyle={this.validationState('firstName')} hasFeedback
        groupClassName="group-class"
        labelClassName="label-class"
        />
        </Col>
        
        <Col xs="6">
                      <Input
        type="text"
        value={this.state.lastName}
        onChange={this.onChangeLastName.bind(this)}
        placeholder="Last Name"
        label="Last Name"
         help={this.validationError('lastName')} bsStyle={this.validationState('lastName')} hasFeedback
        groupClassName="group-class"
        labelClassName="label-class"
        />
        </Col>
        </Row>
        <Row>
        <Col xs="12">
           <Input
        type="text"
        value={this.state.email}
         help={this.validationError('email')} bsStyle={this.validationState('email')} hasFeedback
        onChange={this.onChangeEmail.bind(this)}
        placeholder="Your Email"
        label="Email Address"
        
        groupClassName="group-class"
        labelClassName="label-class"
        />
         <Input
        type="password"
        value={this.state.password}
         help={this.validationError('password')} bsStyle={this.validationState('password')} hasFeedback
        placeholder="Your Password"
        label="Password"
        onChange={this.onChangePassword.bind(this)}
        groupClassName="group-class"
        labelClassName="label-class"
        />
         <Input
        type="password"
        value={this.state.confirmpassword}
        placeholder="Confirm Password"
        label="Confirm Password"
         help={this.validationError('confirmpassword')} bsStyle={this.validationState('confirmpassword')} hasFeedback
        onChange={this.onChangeConfirmPassword.bind(this)}
        groupClassName="group-class"
        labelClassName="label-class"
        />
        </Col></Row>
        </Grid>
        <Button onClick={this._onRegister.bind(this)}>Register</Button> 
        </Panel>
          </Col>
          </Row>
          </Grid>
      </div>;
      
  }
}

