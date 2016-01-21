import React from 'react';
import TimezoneStore from '../../services/TimezoneStore.js';
import AddTimezone from '../timezone/AddTimezone.jsx';
import TimezoneList from '../timezone/TimezoneList.jsx';
import { Header, Footer } from './Layout.jsx';
import LoginDialog from '../controls/LoginDialog.jsx';
import { Navbar, Nav,  NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';



export default class TimezoneApp extends React.Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    //TimezoneStore.getList();
  }

  componentDidMount() {
    TimezoneStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    TimezoneStore.removeChangeListener(this._onChange);
  }

  _onChange() {
  // this.setState(TimezoneStore.getList());
  }

  render() {
  
      
    return (
    
      <div className="">
      <Header />
      {this.props.children}
      <Footer />
    </div>

    );
  }
}

