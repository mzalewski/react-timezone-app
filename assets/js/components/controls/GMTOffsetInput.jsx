import React from 'react';
import { Input,Grid, Col, Row, Button,Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

export default class GMTOffsetInput extends React.Component {
 constructor(props) {
    super(props);
    this.state = { inputValue: this.displayOffset(props.value), error: '', style: '' }
 }
 displayOffset(val) { 
    if (val == undefined || val == null)
    return '';
     let sec = Math.round((val-Math.floor(val))*60);
     if (sec < 10)
        sec = "0" + sec;
     return ((val < 0) ? "" : "+") + Math.floor(val) + ":" + sec;
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
  validateInput(val) { 
   let regex =  /^(\+|\-)([\d]{1,2})(?:\:([\d]{2}))?$/;
        let result = regex.exec(val);
    
        if (result == null)
            return 'Please enter an offset in a valid timezone format (eg: +12:30 or -3:00)';
        let hours = parseFloat(result[2]);
        
        let mins  = result[3] == null ? 0 : parseFloat(result[3]);
        
        if (hours > 12)
            return 'GMT Offset must be between -12:00 and +12:45';
        if (result[1] == '-' && hours == 12 && mins > 0)
            return 'GMT Offset must be between -12:00 and +12:45';
        
        if (result[1] == '+' && hours == 12 && mins > 45)
            return 'GMT Offset must be between -12:00 and +12:45';
            
        if (mins > 59)
                return 'Please enter an offset in a valid timezone format (eg: +12:30 or -3:00)';
    return null;
  }
 _onChange(event) { 
  let val = event.target.value;
  this.setState({inputValue: val });
    let result = this.validateInput(val);
    if (result == null) { 
          this.setState({error:'',style:'success'});
          this.props.onChange(this.parseOffset(val));
        } else {
          this.setState({error:result,style:'error'});
    }
 }
 getDisplayState() { 
    if (this.state.inputValue == '')
    {
        return '';
    }
     let result = this.validateInput(this.state.inputValue);
     if (result == null)
     return 'success';
     return 'error';
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
  render() {
 
    return (
     
     <Input type="text" value={this.state.inputValue} placeholder={this.props.placeholder} label={this.props.label} 
                 help={this.state.error} bsStyle={this.getDisplayState()} hasFeedback 
                 groupClassName="group-class" labelClassName="label-class" onChange={this._onChange.bind(this)} />
               
    );
  }
}



