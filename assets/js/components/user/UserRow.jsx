import React from 'react';
import WarningDialog from '../controls/WarningDialog.jsx';

import {Roles,RoleLabels} from '../../constants/Roles';
import Auth from '../../services/Auth.js';
import TimezoneStore from '../../services/TimezoneStore.js';
import {Button, Glyphicon} from 'react-bootstrap';
import moment from 'moment';
export default class UserRow extends React.Component {

  constructor(props) {
    super(props);
    this._delete = this._delete.bind(this);
    this.state = { showDeleteWarning: false };
  }
  getRoles() { 
    let roles = '';
    if (this.props.item.roles.indexOf(Roles.ADMIN) !== -1 && this.props.item.roles.indexOf(Roles.USER_MANAGER)) {
          return RoleLabels.ADMIN;
    }
    
    if ( this.props.item.roles.indexOf(Roles.USER_MANAGER)) {
          return RoleLabels.USER_MANAGER;
    }
    return RoleLabels.USER;
    
    return roles;
  }
   _delete() {
  this.setState({ showDeleteWarning : true});
  // deleteTimezone(this.props.index);
  }
  _performDelete()  { 
     this.props.onDelete(this.props.item.id);
     this._closeDeleteWarning();
  }
  _closeDeleteWarning()  {  
  this.setState({ showDeleteWarning : false});
  
  }
  _editClick(id) { 
  
        this.props.onEdit(this.props.item.id);
    }
  
  componentDidMount() { 
  // TimezoneStore.addTickListener(this._onTick.bind(this));
  }
  render() {
    return (
    
      <tr>
      <td>
        <Button onClick={this._delete.bind(this)} bsSize='small'><Glyphicon glyph="trash" />
        </Button>&nbsp;
        
        <Button onClick={this._editClick.bind(this)} bsSize='small'><Glyphicon glyph="pencil" />
        </Button>
        <WarningDialog 
        text={"Are you sure you want to delete the User '" + this.props.item.email + "'?"}
        show={this.state.showDeleteWarning} 
        onConfirm={this._performDelete.bind(this)}
        onCancel={this._closeDeleteWarning.bind(this)}
        />
        
      </td>
      <td>{this.props.item.id}</td>
       
        <td>
        {this.props.item.email}
        </td>
        <td>
        {this.props.item.firstName}
        </td>
        <td>
        {this.props.item.lastName}
        </td>
        
        <td>{this.getRoles()}
        </td>
      </tr>

    );
  }
}

UserRow.propTypes = {
  index: React.PropTypes.number,
  item: React.PropTypes.object,
};

