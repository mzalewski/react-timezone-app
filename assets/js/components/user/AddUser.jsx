import React from 'react';
import GMTOffsetInput from '../controls/GMTOffsetInput.jsx';
import Immutable from 'immutable';
import UserStore from '../../services/UserStore.js';
import { Input,Grid, Col, Row, Button,Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

import {Roles,RoleLabels} from '../../constants/Roles';
export default class AddUser extends React.Component {
 constructor(props) {
    super(props);
    this._delete = this._delete;

    this.state =  { user: Object.assign({},UserStore.getUser(this.props.editing)), showModal:false };
  }

    componentWillReceiveProps(nextProps, ) { 
           let tz = Object.assign({},UserStore.getUser(nextProps.editing));
           this.setState({user: tz, showModal: nextProps.editing !== null});
    }
  componentDidMount() {
    UserStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    let user = UserStore.getUser();
    
    this.setState({user:  Object.assign({},user)});
    }

  isEditing() { 
    return (this.state.user.id != undefined && this.state.user.id  != null);
  }
  
  _saveUser() {
  
    var user = this.state.user;
    this.state.user = null;
    UserStore.update(user);
    this.setState({ showModal: false  });
    this.props.onClose();
  }
  showAddUserModal() { 
  
    this.setState({showModal:true, user: {name:null} });
  }
  
  validationState(type) {
      
  if (this.state.user[type] == null)
    return '';
      if (this.validationError(type) == '')
        return 'success';
      return 'error';
      
      
  }
  validationError(type) { 
  if (this.state.user[type] == null)
    return '';
   if (type == 'gmtOffset') { 
       
       
        
    }
  if (this.state.user[type].length > 0)
        return '';
        
    return 'Please enter a value';
  }
  buttonText() { 
    if (this.state.user.id != undefined && this.state.user.id  != null)
        return 'Save Changes';
    return 'Add User';
  }
  _cancelEdit() {
  
    this.setState({ showModal: false });
    cancelUserEdit();
    
  }
  parseOffset(data) { 
      let regex =  /^(\+|\-)([\d]{1,2})(?:\:([\d]{2}))?$/;
      
       let result = regex.exec(data);
       if (result == null)
       return 0;
       let timeDiff =  0;
       let hours = parseFloat(result[2]);

        let mins  = result[3] == null ? 0 : parseFloat(result[3]);

        timeDiff = hours + (mins/60);
        return result[1] == '-' ? 0 - timeDiff : timeDiff;

  }
  updateOffset(value) { 
  this.state.user.gmtOffset = value;
  this.setState({user:this.state.user});
  }
  handleChange(type) {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    return ()=>{
    var obj = this.state;
        if (type == 'gmtOffset') {
        
            obj.user[type] = this.refs[type].getValue();
            if (this.validationError(type) == '')
                obj.user.gmtOffsetValue = this.parseOffset(data);
        } else { 
            obj.user[type] = this.refs[type].getValue();
        }
        this.setState(obj);
    };
  }
  

  render() {
  console.log(this.state.user);
  let Footer = ( <Modal.Footer>
  <input type="button" onClick={this._saveUser.bind(this)} className="btn btn-primary" value="Save User" />
            <Button onClick={this._cancelEdit.bind(this)} className="btn btn-default">Cancel</Button>
          </Modal.Footer>);
  let title = "Add new User";
  
  if (this.isEditing()) { 
    title = "Edit User";
  }
    return (
      <div>
      <Button bsStyle="primary" onClick={this.showAddUserModal.bind(this)}>Add User</Button>
      <Modal bsSize="large" show={this.state.showModal} onHide={this._cancelEdit.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

       <Grid fluid="true">
          <Row>
          <Col xs="6">
          <Input type="text" value={this.state.user.firstName} placeholder="First Name" label="First Name" 
                 help={this.validationError('firstName')} bsStyle={this.validationState('firstName')} hasFeedback ref="firstName"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleChange('firstName')} />
                 </Col>
                 <Col xs="6">
          <Input type="text" value={this.state.user.lastName} placeholder="Last Name" label="Last Name" 
                 help={this.validationError('lastName')} bsStyle={this.validationState('lastName')} hasFeedback ref="lastName"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleChange('lastName')} />
                 </Col>
                 </Row>
                 <Row>
                 <Col xs="12">
                 
          <Input type="text" value={this.state.user.email} placeholder="Email Address" label="Email Address" 
                 help={this.validationError('email')} bsStyle={this.validationState('email')} hasFeedback ref="email"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleChange('email')} />
                 </Col>
                 
                 </Row>
                 
                 <Row>
                 <Col xs="12">
                 
          <Input type="select" value={this.state.user.userRole} placeholder="Role" label="Role" 
                  ref="userRole"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleChange('userRole')}>
                 <option value="">{RoleLabels.USER}</option>
                 <option value={Roles.USER_MANAGER}>{RoleLabels.USER_MANAGER}</option>
                 <option value={Roles.ADMIN}>{RoleLabels.ADMIN}</option>
                 </Input>
                 </Col>
                 
                 </Row>
                 </Grid>
                  </Modal.Body>
                  {Footer}
        </Modal>
      </div>
    );
  }
}



