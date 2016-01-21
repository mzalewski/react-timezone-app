module.exports = function(Timezone) {
 Timezone.observe('loaded',function(ctx, next,  unload) { 
         var AppUser = Timezone.app.models.AppUser;
         var RoleMapping = Timezone.app.models.RoleMapping;
        var inst = ctx.data || ctx.instance;
     
         AppUser.findById( inst.createdById, function(err, data) {
             if (data  != null)
            inst.createdBy = data.firstName + " " + data.lastName;
             
            return next();
         });
         
    });
    
};
