import React from 'react';
import TimezoneItem from './TimezoneItem.jsx';
import { Table } from 'react-bootstrap';

import TimezoneStore from '../../services/TimezoneStore.js';
import {Roles} from '../../constants/Roles';
import Auth from '../../services/Auth.js';

export default class TimezoneList extends React.Component {
constructor(props) { 
super(props);
this.state = {filter: ""};
}
    updateFilter(evt) { 
        this.setState(Object.assign(this.state,{filter:evt.target.value}));
        TimezoneStore.updateFilter(evt.target.value);
    }
    getFilter() { 
        return this.state != null ? this.state.filter : "";
    }
  render() {
    let rows = [];
    if (this.props.list && this.props.list.length) {
      this.props.list.map((item, index) => {
      rows.push(<TimezoneItem onEdit={this.props.onEdit} onDelete={this.props.onDelete} key={index} index={index} item={item} />);
      });
      } else {
      rows = <tr><td colSpan="7" style={{textAlign:"center"}}>
        No Timezones available. Please add  one using the Add Timezone button below
      </td></tr>;
      }

    if (this.props.editing) {
      rows.push(<TimezoneItem key={-1} />);
    }
  
  var addColumn = "";
  if (Auth.isInRole(Roles.USER_MANAGER))
  addColumn = "Created By";
    return (
        <div>
        <div>Filter <input type="text" onChange={this.updateFilter.bind(this)} value={this.getFilter()} /></div>
       <Table responsive>
    <thead>
      <tr>
      <th></th>
        <th>#</th>
        <th>Name</th>
        <th>City Name</th>
        <th>GMT Offset</th>
        <th>Current Time</th>
        <th>{addColumn}</th>
      </tr>
    </thead>
    <tbody>
       {rows}
      </tbody>
      </Table>
      </div>

    );
  }
}

TimezoneList.propTypes = {
  editing: React.PropTypes.bool,
  list: React.PropTypes.array,
};

