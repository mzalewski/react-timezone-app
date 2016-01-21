import React from 'react';
import Immutable from 'immutable';
import TimezoneStore from '../../services/TimezoneStore.js';
import { Input,Grid, Col, Row, Button,Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

export default class WarningDialog extends React.Component {
    constructor(props) {
        super(props);
  }
  render() { 
  return <Modal  show={this.props.show} onHide={this.props.onCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <p>
          {this.props.text}
          </p> </Modal.Body>
                 <Modal.Footer>
                 <Button onClick={this.props.onConfirm}>Yes</Button>
                 <Button onClick={this.props.onCancel}>No</Button>
                 </Modal.Footer>
        </Modal>;
  }
}