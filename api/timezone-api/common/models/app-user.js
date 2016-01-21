module.exports = function(AppUser) {
     AppUser.getRoles = function(id, cb) {
         var Role = AppUser.app.models.Role;
         var RoleMapping = AppUser.app.models.RoleMapping;
    Role.getRoles({principalType: RoleMapping.USER, principalId: id}, function(err, roles) {
    
        cb(null,roles);  // everyone, authenticated, etc (hopefully)
    });
        
  };
    
     /**
   * Add a user to the given role.
   * @param {string} userId
   * @param {string} roleId
   * @param {Function} cb
   */
  AppUser.addRole = function(userId, roleId, cb) {
    var error;
     var Role = AppUser.app.models.Role;
       var RoleMapping = AppUser.app.models.RoleMapping;
    AppUser.findOne({ where: { id: userId } }, function(err, user) { // Find the user...
      if (err) cb(err); // Error

      if (user.length != 0) {
        Role.findOne({ where: { id: roleId } }, function(err, role) { // Find the role...
          if (err) cb(err); // Error

          if (role.length != 0) {
            RoleMapping.findOne({ where: { principalId: userId, roleId: roleId } }, function(err, roleMapping) { // Find the role mapping...
              if (err) cb(err); // Error

              if (roleMapping ==  null) { // Only create if one doesn't exist to avoid duplicates
                role.principals.create({
                  principalType: RoleMapping.USER,
                  principalId: user.id
                }, function(err, principal) {
                  if (err) cb(err); // Error

                  cb(null, role); // Success, return role object
                });
              } else {
                cb(null, role); // Success, return role object
              }
            });

          } else {
            error = new Error('Role.' + roleId + ' was not found.');
            error.http_code = 404;
            cb(error); // Error
          }
        });
      } else {
        error = new Error('User.' + userId + ' was not found.');
        error.http_code = 404;
        cb(error); // Error
      }
    });
  };

    
    /**
   * Remove a user from the given role.
   * @param {string} userId
   * @param {string} roleId
   * @param {Function} cb
   */
  AppUser.removeRole = function(userId, roleId, cb) {
    var error;
  var Role = AppUser.app.models.Role;
       var RoleMapping = AppUser.app.models.RoleMapping;
   
    AppUser.findOne({ where: { id: userId } }, function(err, user) { // Find the user...
      if (err) cb(err); // Error

      if (user.length != 0) {
        Role.findOne({ where: { id: roleId } }, function(err, role) { // Find the role...
          if (err) cb(err); // Error

          if (role.length != 0) {
            RoleMapping.findOne({ where: { principalId: userId, roleId: roleId } }, function(err, roleMapping) { // Find the role mapping...
              if (err) cb(err); // Error

              if (roleMapping!= null) {
                roleMapping.destroy(function(err) {
                  if (err) cb(err); // Error

                  cb(null, role); // Success, return role object
                });
              } else {
                cb(null, role); // Success, return role object
              }
            });
          } else {
            error = new Error('Role.' + roleId + ' was not found.');
            error.http_code = 404;
            cb(error); // Error
          }
        });
      } else {
        error = new Error('User.' + userId + ' was not found.');
        error.http_code = 404;
        cb(error); // Error
      }
    });
  };
    AppUser.observe('after save', function(ctx, next) {
      if (ctx.instance) {
          
         var Role = AppUser.app.models.Role;
         var RoleMapping = AppUser.app.models.RoleMapping;
          if (ctx.instance.userRole == undefined)
              return next();
          AppUser.removeRole(ctx.instance.id,1, function() { 
              AppUser.removeRole(ctx.instance.id,2, function() { 
                  AppUser.addRole(ctx.instance.id,ctx.instance.userRole, function(err,d) {
                    if (ctx.instance.userRole == 2)
                        return next();
                      
                        AppUser.addRole(ctx.instance.id,1, function(err,d) {
                            return next();   
                        });
                  });

              });
              
              
          });
              
           
           

        console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
      } else {
          
        console.log('Updated %s matching %j',
          ctx.Model.pluralModelName,
          ctx.where);
          
       return next();  
      }
      
    });
    AppUser.observe('loaded',function(ctx, next,  unload) { 
         var Role = AppUser.app.models.Role;
         var RoleMapping = AppUser.app.models.RoleMapping;
        var inst = ctx.data || ctx.instance;
         Role.getRoles({principalType: RoleMapping.USER, principalId: inst.id}, function(err, roles) {
            inst.roles = roles;
             inst.userRole = roles.indexOf(1) !== -1 ? 1 : roles.indexOf(2) !== -1 ? 2 : "";
            return next();
         });
         
    });
    
    AppUser.remoteMethod (
        'getRoles',
        {
          http: {path: '/getroles', verb: 'get'},
          accepts: {arg: 'id', type: 'number', http: { source: 'query' } },
          returns: {arg: 'roles', type: 'array'}
        }
    );

};
