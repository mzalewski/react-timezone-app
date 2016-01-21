module.exports = function(app) {
    var debug = console.log;
  var User = app.models.AppUser;
     var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
    User.create([
    {username: 'admin', email: 'matthew@minion.co.nz', password: 'admin1234', firstName: 'Admin', lastName: 'Istrator'}
], function(err, users) {
    if (err) return debug('%j', err);
    // Create the admin role
    Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) return debug(err);
      debug(role);
 
      // Make Bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) return debug(err);
      });
    });
        
         Role.create({
      name: 'usermanager'
    }, function(err, role) {
      if (err) return debug(err);
      debug(role);
 
      // Make Bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) return debug(err);
      });
    });
        
    
  });

}