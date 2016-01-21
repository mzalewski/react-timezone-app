import React from 'react';
import { Navbar, Nav,  NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';

import {Roles} from '../../constants/Roles';
import Auth from '../../services/Auth.js';
import { Router, Route, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import History from '../../services/History';

export class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = { loggedIn:Auth.loggedIn() !== null, 
        name: (Auth.loggedIn() !== null ?  Auth.loggedIn().data.email : ""),
        canManageUsers: Auth.isInRole(Roles.USER_MANAGER)
    };
    }
    _logout(e) { 
    
        e.preventDefault();
        Auth.logout();
        
        History().pushState(null,'/login');
        
    }
    _onAuthChange() { 
    
    this.setState({ 
    loggedIn:Auth.loggedIn() !== null, 
    name: (Auth.loggedIn() !== null ?  Auth.loggedIn().data.email : ""), 
    canManageUsers: Auth.isInRole(Roles.USER_MANAGER)
    });
    
    }
      componentDidMount() {
    Auth.addAuthListener(this._onAuthChange.bind(this));
  }

  componentWillUnmount() {
    Auth.removeAuthListener(this._onAuthChange);
  }
  render() {
      let accountLinks = <Nav pullRight>
              <LinkContainer to="/login"><NavItem eventKey={2} href="/login">Login</NavItem></LinkContainer>
              <LinkContainer to="/register"><NavItem eventKey={2} href="#">Register</NavItem></LinkContainer>
              </Nav>;
              if (this.state.loggedIn) { 
              accountLinks = <Nav pullRight>
              <NavDropdown eventKey={3} title={ this.state.name  } id="basic-nav-dropdown">
              <MenuItem eventKey={3.1} onClick={this._logout}>Logout</MenuItem>
       
               </NavDropdown>
               </Nav>;
              };
              let userLink = "";
              if (this.state.canManageUsers)
                userLink = <LinkContainer to="/users"><NavItem eventKey={2} href="/users">Users</NavItem></LinkContainer>;
      return <Navbar inverse staticTop>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Timezone App</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
              
              <LinkContainer to="/timezones"><NavItem eventKey={2} href="/timezones">Time Zones</NavItem></LinkContainer>
              {userLink}
              </Nav>
              {accountLinks}
            </Navbar.Collapse>
          </Navbar>;
  }
}


export  class Footer extends React.Component {

  constructor(props) {
    super(props);
    }

  render() {
  return <div></div>;
  }
}