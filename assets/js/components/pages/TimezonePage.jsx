import React from 'react';
import TimezoneStore from '../../services/TimezoneStore.js';
import AddTimezone from '../timezone/AddTimezone.jsx';
import TimezoneList from '../timezone/TimezoneList.jsx';

import { Navbar, Nav,  NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';

import {Roles} from '../../constants/Roles';
import Auth from '../../services/Auth.js';

export default class TimezonePage extends React.Component {

  constructor(props) {
    super(props);
    let obj = this;
    this._onChange = this._onChange.bind(this);
    
    TimezoneStore.getList(true).then(function(data) { 
    
    obj.setState({list:data});
    });
    this.state = { list: [], editing: null };
  }

    componentWillMount() { 
          Auth.requireAuth(Roles.USER);
   
    }
  componentDidMount() {
    TimezoneStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    TimezoneStore.removeChangeListener(this._onChange);
  }
  editTimezone(id) {
    this.setState({editing:id});
  }
  
  deleteTimezone(id) {
    TimezoneStore.delete(id);
  }
  onCloseDialog() { 
   this.setState({editing:null});
  }
  _onChange() {
    let obj = this;
    TimezoneStore.getList().then(function(data) { 
        obj.setState({list:data});
    });
  }

  render() {
  return   <div className="container ">
         
            <div className="pane">
            <TimezoneList onEdit={this.editTimezone.bind(this)} onDelete={this.deleteTimezone.bind(this)}
                list={this.state.list} 
              />
            </div>
               <div className="panel-footer">
               <AddTimezone  onClose={this.onCloseDialog.bind(this)} editing={this.state.editing} />
            </div>
          
      </div>;
      
  }
}

