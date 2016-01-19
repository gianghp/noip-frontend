var menuHandler = function (data, record){
    loadJS(data.open_src, function(){
        var desktop = App.getDesktop();
        var args = data.args ? data.args : {};
        if (!args.iconCls) args.iconCls = data.iconClsMi;
        var win = Ext.create(data.open_class);
        win = win.createWindow(args);
        if (win) {
            if (win.maximized) win.maximize();
            else desktop.restoreWindow(win);
        }
    });
};
    
var ExtMenuItems = function(){                
    return {
        userManagerMenuItem : function(type){
            return {
                name: Language.get('user.TaiKhoan', "Tài khoản"),
                text: Language.get('user.QuanLyTaiKhoan', "Quản lý tài khoản"),
                iconCls: type === 32 ? "teachers32" : "notepad",
                open_src: "user/manager.js",
                open_class: "MyExt.User.Manager",
                args: {title : 'Quản lý người dùng', name : 'Quản lý người dùng'},
                hidden: 0,
                autorun: 0,
                handler: function (data, record){
                    menuHandler(data, record);
                }
            };
        }
    };
};

var ExtMenu = function(shortcut, quickstart){
    ExtMenuItems = ExtMenuItems();
    return {
        desktop_shortcut : shortcut,
        desktop_quickstart : quickstart,
        desktop_startmenu : [
            {
                text: Language.get('core.QuanTriHeThong', "Quản trị hệ thống"),
                hidden: false,
                iconCls: "admin16",
                hideOnClick : false,
                menu: {
                    items: [
                        ExtMenuItems.userManagerMenuItem(16)
                    ]
                }
            },
            {
                name: Language.get('dm.permission', "Danh mục quyền"),
                text: Language.get('dm.permission', "Danh mục quyền"),
                iconCls: "notepad",
                open_src: "permission/manager.js",
                open_class: "MyExt.Permission.Manager",
                args: {title : 'dm.permission', name : 'Quản lý permission'},
                hidden: 0,
                autorun: 0,
                handler: function (data, record){
                    menuHandler(data, record);
                }
            },
            {
                name: Language.get('dm.department', "Quản lý phòng ban"),
                text: Language.get('dm.department', "Quản lý phòng ban"),
                iconCls: "notepad",
                open_src: "department/manager.js",
                open_class: "MyExt.Department.Manager",
                args: {title : 'dm.department', name : 'Quản lý phòng ban'},
                hidden: 0,
                autorun: 0,
                handler: function (data, record){
                    menuHandler(data, record);
                }
            },
            {
                name: Language.get('role_manager', "Quản lý quyền"),
                text: Language.get('role_manager', "Quản lý quyền"),
                iconCls: "notepad",
                open_src: "role/manager.js",
                open_class: "MyExt.Role.Manager",
                args: {title : 'role_manager', name : 'Quản lý quyền'},
                hidden: 0,
                autorun: 0,
                handler: function (data, record){
                    menuHandler(data, record);
                }
            },
            {
                name: Language.get('quan_ly_danh_muc', "Quản lý danh mục"),
                text: Language.get('quan_ly_danh_muc', "Quản lý danh mục"),
                iconCls: "notepad",
                open_src: "category/manager.js",
                open_class: "MyExt.Category.Manager",
                args: {title : 'quan_ly_danh_muc', name : 'Quản lý danh mục'},
                hidden: 0,
                autorun: 0,
                handler: function (data, record){
                    menuHandler(data, record);
                }
            }
        ]
    };
};