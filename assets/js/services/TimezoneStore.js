// Todo store
//
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import { EventEmitter } from 'events';
import {Timezones} from './TimezoneAPI';
import Promise from 'bluebird';

import Auth from './Auth';

import {Roles} from '../constants/Roles';


import AuthError from './AuthError';

const CHANGE_EVENT = 'change';


const TICK_EVENT = 'timertick';

// Define the store as an empty array
let _store = {
  list: null,
  editing: false,
};




// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class TimezoneStoreClass extends EventEmitter {
  loadInitialState() { 
    let obj = this;
   
      
  }
   
  _handleTimer() { 
      if (this._timer == undefined){ 
        let prevMin = (new Date()).getMinutes();
        var component = this;
         
        this._timer  = window.setInterval(function() { 
            let newTime = new Date();
            if (newTime.getMinutes() != prevMin)
            {
                prevMin = newTime.getMinutes();
                // Trigger refresh
                component.emit(TICK_EVENT);
            }
        },1000);   
      }
  }
  addTickListener(cb) { 
      this._handleTimer();
    this.on(TICK_EVENT,cb);   
  }
    
  removeTickListener(cb) { 
    this.removeListener(TICK_EVENT,cb);   
  }
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
    getTimezone(id) { 
        if (id == null || _store.list == null)
            return null;
        return _store.list[_store.list.findIndex(a=>a.id == id)];   
    }
    refresh() { 
        _store.list = null;
         TimezoneStore.emit(CHANGE_EVENT);
    }

  getList(forceRefresh) {
      if (_store.list != null && forceRefresh  == undefined) { 
          return (new Promise(function(resolve,reject) {
            resolve(_store.list);
          }));
      }
      if (Auth.isInRole(Roles.ADMIN)) {
          return Timezones.getAll(_store.filter || "").then(function(d) { 
            _store.list = d;

            TimezoneStore.emit(CHANGE_EVENT);
              return _store.list;
        },function(err) {
            if (err instanceof AuthError)
            Auth.requireAuth();
         });
  }else {
          return Timezones.get(_store.filter || "").then(function(d) { 
            _store.list = d;

            TimezoneStore.emit(CHANGE_EVENT);
              return _store.list;
        },function(err) {
            if (err instanceof AuthError)
            Auth.requireAuth();
         });
      }
//      return loadInitialState();
    return _store;
  }
    cancelEdit() { 
         _store.editing = false;
        TimezoneStore.emit(CHANGE_EVENT);   
    }
    
    delete(id) { 
       Timezones.delete(id).then(function(d) { 
            let index  = _store.list.findIndex(a=>a.id == id);
            delete _store.list[index];// = d;
            
            TimezoneStore.emit(CHANGE_EVENT);
        });  
    }
    updateFilter(filter) {
        if (_store.timer )
            window.clearTimeout(_store.timer );
        _store.timer  = window.setTimeout(function() {
            _store.filter = filter;
            _store.list = null;
            TimezoneStore.getList();
        },500);
      
    }
    update(data) { 
        
    // Add the data defined in the TodoActions
    // which the View will pass as a payload
   
    if (data.id != undefined && data.id != null){ 
        Timezones.put(data).then(function(d) { 
            let index  = _store.list.findIndex(a=>a.id == d.id);
            _store.list[index] = d;
            
            TimezoneStore.emit(CHANGE_EVENT);
        });
        
    }
    else{
       
    Timezones.post(data).then(function(d) { 
        d.createdBy = Auth.loggedIn().data.firstName + " " +Auth.loggedIn().data.lastName;
        _store.list.push(d);
    
        TimezoneStore.emit(CHANGE_EVENT);
    });
    }
    _store.editing = false;
    TimezoneStore.emit(CHANGE_EVENT);
    }
    
}

// Initialize the singleton to register with the
// dispatcher and export for React components
const TimezoneStore = new TimezoneStoreClass();
//TimezoneStore.loadInitialState();


export default TimezoneStore;

