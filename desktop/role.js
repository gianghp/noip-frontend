var Role = function(){
    
    var rolesData = {};
    
    return {
        init : function(){
            this.setRoles("role_test1, role_test2");
        },
        apply : function(){
            var records = Ext.ComponentMgr.all.map;
            for (var key in records) {
                if (records.hasOwnProperty(key)) {
                    var obj = records[key];
                    var roleName = obj.roleName !== undefined ? obj.roleName : "";
                    var roleType = obj.roleType ? obj.roleType : 0;

                    if (roleName === true){
                        obj.setDisabled(false);
                        obj.setVisible(true);
                    }
                    else if (roleName === false && (roleType === 0 || roleType === '0' || roleType === 'disabled')) obj.setDisabled(true);
                    else if (roleName === false && (roleType === 1 || roleType === '1' || roleType === 'hide')) obj.setVisible(false);
                    else if (roleName.length > 0){
                        var roles = roleName.split(",");
                        var check = false;
                        for(var role in roles){
                            role = roles[role].trim();
                            if (Role.check(role)){
                                check = true;
                                break;
                            }
                        }

                        if (check === true){
                            obj.setDisabled(false);
                            obj.setVisible(true);
                        }
                        else if (check === false && (roleType === 0 || roleType === '0' || roleType === 'disabled')) obj.setDisabled(true);
                        else if (check === false && (roleType === 1 || roleType === '1' || roleType === 'hide')) obj.setVisible(false);

                    }
                }
            }
        },
        setRoles : function(roles){
            rolesData = {};
            if (roles !== undefined && roles.length > 0){
                var aRoles = roles.split(",");
                for(var role in aRoles){
                    role = aRoles[role].trim();
                    rolesData[role] = true;
                }
            }
        },
        addRoles : function(roles){
            if (roles !== undefined && roles.length > 0){
                var aRoles = roles.split(",");
                for(var role in aRoles){
                    role = aRoles[role].trim();
                    rolesData[role] = true;
                }
            }
        },
        check : function(role){
            return rolesData["root"] === true || rolesData[role] === true;
        }
    };
}();

Role.init();