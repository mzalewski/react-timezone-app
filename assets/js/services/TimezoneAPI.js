// Random User API logic
import request from 'superagent';
import Promise from 'bluebird';
import cookie from 'react-cookie';
import AuthError from './AuthError';



let performTimezoneAPIRequest = function(type,path,data = false) { 
    
    return (new Promise(function(resolve,reject) {
        
            let qs = path.indexOf('?') !== -1  ? "&":"?";
            let token = AuthAPI._loggedInUser == null ? "" : qs + "access_token=" + AuthAPI._loggedInUser.id;
          let req = request(type,'http://localhost:5600/api/' + path + token)
            .set('Accept', 'application/json');
        if (data)  {  
         req.send(data);
        }
            req.end((err, response) => {
              if (err) 
              {
                  if (err.status == '401')
                      reject( new AuthError(err.response.body.error));
                   else{
                       let error = new Error(err.response.body.error.message);
                       error.data =  err.response.body.error;
                       reject( error );
                   }
              }
                  
                resolve(response.body);
            });   
    }));
};
let authApi = {
    _loggedInUser: null,
    
    loggedIn: function() { 
        return authApi._loggedInUser; 
    },
    updateCookie: function() { 
        
          cookie.save('auth', {user:authApi._loggedInUser });
    
    },
    getUserDetails: function(id) { 
         return performTimezoneAPIRequest('get','appusers/'+id).then(function(data) { 
            authApi._loggedInUser.data = data; 
            authApi.updateCookie();
            return true;
        }); 
    },
    logout: function() { 
        authApi._loggedInUser = null;
            authApi.updateCookie();
    },
    login: function(email, password) { 
        return performTimezoneAPIRequest('post','appusers/login', {email:email,password:password}).then(function(data) { 
            authApi._loggedInUser = data; 
            authApi.updateCookie();
            return true;
        });
    },
    
    isInRole: function(role) {  
        
        if (authApi._loggedInUser == null || authApi._loggedInUser.data.roles == null)
            return false;
      return authApi._loggedInUser.data.roles.indexOf(role) !== -1;  
    },
    requireAuth: function() { 
        
        TimezoneStore.emit(AUTH_EVENT);
    }, init: function() { 
        
        let cookiedata = cookie.load('auth');
        if (cookiedata) { 
            
            authApi._loggedInUser = cookiedata.user;
        }
    }
};
authApi.init();
export const AuthAPI = authApi;
export const Timezones = {
    get: function(filter = '') {
        let id = "";
        let filterobj = {where:{createdById:authApi._loggedInUser.data.id}};
        if (filter != '')
        filterobj.where.name = { like: '%'+filter+'%' };
        return performTimezoneAPIRequest('get','timezones/' + id + "?filter=" + encodeURIComponent(JSON.stringify(filterobj)));    
    },
    getAll: function(filter = '') {
        let id = "";
        let filterobj = {where:{}};
        if (filter != '')
        filterobj.where.name = { like: '%'+filter+'%' };
        return performTimezoneAPIRequest('get','timezones/' + id+ "?filter=" + encodeURIComponent(JSON.stringify(filterobj)));    
    },
    post: function(data) { 
        if (data.createdById == undefined)
            data.createdById = AuthAPI.loggedIn().data.id;
        return performTimezoneAPIRequest('post','timezones',data);   
    },
    put: function(data) { 
        
        if (data.createdById == undefined)
            data.createdById = AuthAPI.loggedIn().data.id;
        
        return performTimezoneAPIRequest('put','timezones/'+data.id,data);   
    },
    delete: function(id) { 
        return performTimezoneAPIRequest('delete','timezones/'+id);   
        
    }
    
};



export const Users = {
    get: function(id = '') {
        return performTimezoneAPIRequest('get','appusers/' + id);    
    },
    post: function(data) { 
        return performTimezoneAPIRequest('post','appusers',data);   
    },
    put: function(data) {
        return performTimezoneAPIRequest('put','appusers/'+data.id,data);   
    },
    delete: function(id) { 
        return performTimezoneAPIRequest('delete','appusers/'+id);   
        
    }
    
};
