import React from 'react';
import WarningDialog from '../controls/WarningDialog.jsx';

import {Roles} from '../../constants/Roles';
import Auth from '../../services/Auth.js';

import TimezoneStore from '../../services/TimezoneStore.js';
import {Button, Glyphicon} from 'react-bootstrap';
import moment from 'moment';
export default class TimezoneItem extends React.Component {

  constructor(props) {
    super(props);
    //this._delete = this._delete.bind(this);
    this.state = { currentTime: this.calcTime(), showDeleteWarning: false };
  }
   displayOffset(val) { 
     let sec = Math.round((val-Math.floor(val))*60);
     if (sec < 10)
        sec = "0" + sec;
     return ((val < 0) ? "" : "+") + Math.floor(val) + ":" + sec;
 }
  componentDidMount() { 
    TimezoneStore.addTickListener(this._onTick.bind(this));
  }
  _onTick() { 
    this.setState({currentTime:this.calcTime()});
  }
  calcTime() {
    let d = new Date();
    let offset = this.props.item.gmtOffset;
    //Deal with dates in milliseconds for most accuracy
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let newDateWithOffset = new Date(utc + (3600000*offset));

    //This will return the date with the locale format (string), or just return newDateWithOffset
    //and go from there.
    return moment(newDateWithOffset).format('Do MMM, h:mm A');

    }
    parseOffset() { 
      let regex =  /^(\+|\-)([\d]{1,2})(?:\:([\d]{2}))?$/;
      
       let result = regex.exec(this.props.item.gmtOffset);
       if (result == null)
       return 0;
       let timeDiff =  0;
       let hours = parseFloat(result[2]);

        let mins  = result[3] == null ? 0 : parseFloat(result[3]);

        timeDiff = hours + (mins/60);
        return result[1] == '-' ? 0 - timeDiff : timeDiff;

    }
    _editClick() {
    
            this.props.onEdit(this.props.item.id);
    }
  _delete() {
  this.setState({ showDeleteWarning : true});
  // deleteTimezone(this.props.index);
  }
  _performDelete()  { 
     this.props.onDelete(this.props.item.id);
     // this._closeDeleteWarning();
  }
  _closeDeleteWarning()  {  
  this.setState({ showDeleteWarning : false});
  
  }

  render() {
  
    var addColumn = "";
    if (Auth.isInRole(Roles.USER_MANAGER))
    addColumn = this.props.item.createdBy;
    return (
      <tr>
      <td>
        <Button onClick={this._delete.bind(this)} bsSize='small'><Glyphicon glyph="trash" />
        </Button>&nbsp;
        
        <Button onClick={this._editClick.bind(this)} bsSize='small'><Glyphicon glyph="pencil" />
        </Button>
        <WarningDialog 
        text={"Are you sure you want to delete the Timezone named '" + this.props.item.name + "'?"}
        show={this.state.showDeleteWarning} 
        onConfirm={this._performDelete.bind(this)}
        onCancel={this._closeDeleteWarning.bind(this)}
        />
        
      </td>
      <td>{this.props.item.id}</td>
        <td>
        {this.props.item.name}
        </td>
        <td>
        {this.props.item.cityName}
        </td>
        <td>
        {this.displayOffset(this.props.item.gmtOffset)}
        </td>
        <td>
        {this.state.currentTime}
        </td>
        <td>{addColumn}</td>
      </tr>

    );
  }
}

TimezoneItem.propTypes = {
  index: React.PropTypes.number,
  item: React.PropTypes.object,
};

