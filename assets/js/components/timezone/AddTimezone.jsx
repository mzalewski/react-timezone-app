import React from 'react';
import GMTOffsetInput from '../controls/GMTOffsetInput.jsx';
import Immutable from 'immutable';
import TimezoneStore from '../../services/TimezoneStore.js';
import { Input,Grid, Col, Row, Button,Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

export default class AddTimezone extends React.Component {
 constructor(props) {
    super(props);
    this._delete = this._delete;

    this.state =  { timezone: Object.assign({},TimezoneStore.getTimezone(this.props.editing)), showModal:false };
  }

    componentWillReceiveProps(nextProps, ) { 
           let tz = Object.assign({},TimezoneStore.getTimezone(nextProps.editing));
           this.setState({timezone: tz, showModal: nextProps.editing !== null});
    }
  componentDidMount() {
    TimezoneStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    TimezoneStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    let timezone = TimezoneStore.getTimezone();
    
    this.setState({timezone:  Object.assign({},timezone)});
    }

  isEditing() { 
    return (this.state.timezone.id != undefined && this.state.timezone.id  != null);
  }
  
  _saveTimezone() {
  TimezoneStore.update(this.state.timezone);
    this.setState({ showModal: false  });
    this.props.onClose();
  }
  showAddTimezoneModal() { 
  
    this.setState({showModal:true, timezone: {name:null} });
  }
  
  validationState(type) {
      
  if (this.state.timezone[type] == null)
    return '';
      if (this.validationError(type) == '')
        return 'success';
      return 'error';
      
      
  }
  validationError(type) { 
  if (this.state.timezone[type] == null)
    return '';
   if (type == 'gmtOffset') { 
       
       
        
    }
  if (this.state.timezone[type].length > 0)
        return '';
        
    return 'Please enter a value';
  }
  buttonText() { 
    if (this.state.timezone.id != undefined && this.state.timezone.id  != null)
        return 'Save Changes';
    return 'Add Timezone';
  }
  _cancelEdit() {
  
    this.setState({ showModal: false });
    cancelTimezoneEdit();
    
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
  this.state.timezone.gmtOffset = value;
  this.setState({timezone:this.state.timezone});
  }
  handleChange(type) {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    return ()=>{
    var obj = this.state;
        if (type == 'gmtOffset') {
        
            obj.timezone[type] = this.refs[type].getValue();
            if (this.validationError(type) == '')
                obj.timezone.gmtOffsetValue = this.parseOffset(data);
        } else { 
            obj.timezone[type] = this.refs[type].getValue();
        }
        this.setState(obj);
    };
  }
  

  render() {
  
  let Footer = ( <Modal.Footer>
            <Button onClick={this._saveTimezone.bind(this)} bsStyle="primary">Save Timezone</Button>
            <Button onClick={this._cancelEdit.bind(this)} bsStyle="">Cancel</Button>
          </Modal.Footer>);
  let title = "Add new Timezone";
  
  if (this.isEditing()) { 
    title = "Edit Timezone";
  }
    return (
      <div>
      <Button bsStyle="primary" onClick={this.showAddTimezoneModal.bind(this)}>Add Timezone</Button>
      <Modal bsSize="large" show={this.state.showModal} onHide={this._cancelEdit.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

       <Grid fluid="true">
          <Row>
          <Col xs="12">
          <Input type="text" value={this.state.timezone.name} placeholder="Name" label="Timezone Name" 
                 help={this.validationError('name')} bsStyle={this.validationState('name')} hasFeedback ref="name"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleChange('name')} />
                 </Col>
                 </Row>
                 <Row>
                 <Col xs="6">
                 
          <Input type="text" value={this.state.timezone.cityName} placeholder="City Name" label="City Name" 
                 help={this.validationError('cityName')} bsStyle={this.validationState('cityName')} hasFeedback ref="cityName"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.handleChange('cityName')} />
                 </Col><Col xs="6">
          <GMTOffsetInput type="text" value={this.state.timezone.gmtOffset} placeholder="GMT Offset" label="GMT Offset" 
                 help={this.validationError('gmtOffset')} bsStyle={this.validationState('gmtOffset')} hasFeedback ref="gmtOffset"
                 groupClassName="group-class" labelClassName="label-class" onChange={this.updateOffset.bind(this)} />
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



