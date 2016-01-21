
import { AuthAPI } from '../services/TimezoneAPI';
import UserStore from './UserStore';
import { EventEmitter } from 'events';

import cookie from 'react-cookie';


const AUTH_EVENT = 'auth';

const AUTH_CHANGE_EVENT = 'auth_change';

 let Auth = {
    emitter: new EventEmitter(),
    
    loggedIn: function() { 
        return AuthAPI._loggedInUser; 
    },
     logout: function() { 
        AuthAPI.logout();  
         Auth.emitter.emit(AUTH_CHANGE_EVENT);  
     },
    login: function(email, password) { 
        if (email == '')
            return;
        return AuthAPI.login(email,password).then(function(userdata) { 
           
          return AuthAPI.getUserDetails(AuthAPI._loggedInUser.userId).then(function() { 
                Auth.emitter.emit(AUTH_CHANGE_EVENT);   
              return AuthAPI._loggedInUser;
          });  

            
        });
    },
     
    register: function(email, password, firstName, lastName) { 
        return UserStore.create(email,password,firstName, lastName).then(function(data) { 
           return Auth.login(email,password);
        });  
    },
     addAuthListener: function(cb) { 
           Auth.emitter.on(AUTH_CHANGE_EVENT,cb);
     },
     removeAuthListener: function(cb) {
         
        Auth.emitter.removeEventListener(AUTH_CHANGE_EVENT,cb);
     },
     addAuthHandler: function(cb) { 
        Auth.emitter.on(AUTH_EVENT,cb);
    },
    removeAuthHandler: function(cb) {  
        Auth.emitter.removeEventListener(AUTH_EVENT,cb);
    },
    isInRole: function(role) { 
        return AuthAPI.isInRole(role);
    },
    requireAuth: function(role) {
        
        if (role == undefined)
            return Auth.emitter.emit(AUTH_EVENT);
        
        if (Auth.loggedIn() == null)
            return Auth.emitter.emit(AUTH_EVENT);
        
       if (!Auth.isInRole(role))
           return Auth.emitter.emit(AUTH_EVENT);
        
    }
};
export default Auth;