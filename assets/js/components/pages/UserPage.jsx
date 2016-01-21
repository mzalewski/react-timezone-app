import React from 'react';
import UserStore from '../../services/UserStore.js';
import AddUser from '../user/AddUser.jsx';
import UserList from '../user/UserList.jsx';
import { Navbar, Nav,  NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';


import {Roles} from '../../constants/Roles';
import Auth from '../../services/Auth.js';


export default class UserPage extends React.Component {

  constructor(props) {
    super(props);
    //UserStore.loadInitialState();
    let obj = this;
    this._onChange = this._onChange.bind(this);
   UserStore.getList().then(function(data) { 
    
    obj.setState({ list:data });
    });
    this.state = { list: [], editing: null  };
  }
   onCloseDialog() { 
   this.setState({editing:null});
  }

    componentWillMount() { 
          Auth.requireAuth(Roles.USER_MANAGER);
    }
  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
  }
  editUser(id) {
    this.setState({editing:id});
  }
  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  deleteUser(id) {
    UserStore.delete(id);
  }
  _onChange() {
     let obj = this;
    UserStore.getList().then(function(data) { 
        obj.setState({list:data});
    });
  }

  render() {
  return   <div className="container ">
         
            <div className="pane">
              <UserList onEdit={this.editUser.bind(this)} onDelete={this.deleteUser.bind(this)}
                list={this.state.list} 
              />
            </div>
               <div className="panel-footer">
               <AddUser  onClose={this.onCloseDialog.bind(this)} editing={this.state.editing} />
            </div>
          
      </div>;
      
  }
}

