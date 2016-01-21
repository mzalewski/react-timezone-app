// Todo store
//
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import { EventEmitter } from 'events';
import { Users } from '../services/TimezoneAPI';

import Auth from './Auth';

import {Roles} from '../constants/Roles';


import AuthError from './AuthError';

const CHANGE_EVENT = 'change';


// Define the store as an empty array
let _store = {
  list: null,
  editing: false,
};




// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class UserStoreClass extends EventEmitter {
  loadInitialState() { 
      let obj = this;
     Users.get().then(function(d) { 
        _store.list = d;
        UserStore.emit(CHANGE_EVENT);
    },function(err) {
        if (err instanceof AuthError)
        obj.requireAuth();
     });
      
  }
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
        getUser(id) { 
        if (id == null || _store.list == null)
            return null;
        return _store.list[_store.list.findIndex(a=>a.id == id)];   
    }
  getList(forceRefresh) {
       if (_store.list != null && forceRefresh == undefined) { 
          return (new Promise(function(resolve,reject) {
            resolve(_store.list);
          }));
      }
     
          return Users.get().then(function(d) { 
              
            _store.list = d;

            UserStore.emit(CHANGE_EVENT);
              return _store.list;
        },function(err) {
            if (err instanceof AuthError)
            Auth.requireAuth();
         });
    return _store;
  }
    update(data) { 
        if (data.id == undefined || data.id == null) { 
            return Users.post(data).then(function(d) { 
                
                _store.list = null;
                TimezoneStore.refresh();
                UserStore.emit(CHANGE_EVENT);
            });
        } else {  
           return Users.put(data).then(function(d) { 
                let index  = _store.list.findIndex(a=>a.id == d.id);
                _store.list = null;
                TimezoneStore.refresh();
                UserStore.emit(CHANGE_EVENT);
            });
        }
    }
     
    delete(id) { 
       Users.delete(id).then(function(d) { 
            let index  = _store.list.findIndex(a=>a.id == id);
            delete _store.list[index];// = d;
            
            UserStore.emit(CHANGE_EVENT);
        });  
    }
    
    create(email, password, firstName, lastName) { 
        _store.list = null;
    return Users.post({email:email, password:password, firstName:firstName, lastName: lastName });
    }
    

}

// Initialize the singleton to register with the
// dispatcher and export for React components
const UserStore = new UserStoreClass();

//UserStore.loadInitialState();
export default UserStore;

