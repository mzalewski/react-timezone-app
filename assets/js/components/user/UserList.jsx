import React from 'react';
import UserRow from './UserRow.jsx';
import { Table } from 'react-bootstrap';
export default class UserList extends React.Component {
    
  render() {
    let rows = [];
    
    if (this.props.list && this.props.list.length) {
      this.props.list.map((item, index) => {
      rows.push(<UserRow key={index} onDelete={this.props.onDelete} onEdit={this.props.onEdit} index={index} item={item} />);
      });
      } else {
      rows = <tr><td colSpan="6" style={{textAlign:"center"}}>
        No Users available. Please add one using the Add User button below
      </td></tr>;
      }

    if (this.props.editing) {
      rows.push(<UserRow key={-1} />);
    }

    return (
        <div>
       <Table responsive>
    <thead>
      <tr>
      <th></th>
        <th>#</th>
        <th>Email Address</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Role</th>
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

UserList.propTypes = {
  editing: React.PropTypes.bool,
  list: React.PropTypes.array,
};

