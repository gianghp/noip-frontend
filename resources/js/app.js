Ext.define('Ext.ux.desktop.App', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: [
        'Ext.container.Viewport',

        'Ext.ux.desktop.Desktop'
    ],

    isReady: false,
    modules: null,
    useQuickTips: true,

    constructor: function (config) {
        var me = this;
        me.addEvents(
            'ready',
            'beforeunload'
        );

        me.mixins.observable.constructor.call(this, config);

        if (Ext.isReady) {
            Ext.Function.defer(me.init, 10, me);
        } else {
            Ext.onReady(me.init, me);
        }
    },

    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }

        desktopCfg = me.getDesktopConfig();
        me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);

        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [ me.desktop ]
        });

        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.fireEvent('ready', me);
    },

    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function () {
        var me = this, cfg = {
            app: me,
            taskbarConfig: me.getTaskbarConfig()
        };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,

    /**
     * This method returns the configuration object for the Start Button. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getStartConfig: function () {
        var me = this, cfg = {
            app: me,
            menu: []
        };

        Ext.apply(cfg, me.startConfig);

        Ext.each(me.modules, function (module) {
            if (module.launcher) {
                cfg.menu.push(module.launcher);
            }
        });

        return cfg;
    },

    /**
     * This method returns the configuration object for the TaskBar. A derived class
     * can override this method, call the base version to build the config and then
     * modify the returned object before returning it.
     */
    getTaskbarConfig: function () {
        var me = this, cfg = {
            app: me,
            startConfig: me.getStartConfig()
        };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    initModules : function(modules) {
        var me = this;
        Ext.each(modules, function (module) {
            module.app = me;
        });
    },

    getModule : function(name) {
    	var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id === name || m.appType === name) {
                return m;
            }
        }
        return null;
    },

    onReady : function(fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },

    getDesktop : function() {
        return this.desktop;
    },

    onUnload : function(e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});

var loadJsCache = [];
var loadJS = function(fileName, fn){
    fileName = initData.context_path + "/desktop/" + fileName;
    if (loadJsCache[fileName] === 1) fn();
    else{
        $.ajax({
            url : fileName,
            dataType : "script",
            success : function(){
                loadJsCache[fileName] = 1;
                fn();
            }
        });
    }
};

var openNotify = function(args)
{
    var i = 0;
    var win = false;
    for (i=0; i<=100; ++i){
        win = Ext.getCmp("frm_open_notify_" + i);
        if (!win) break;
    }
    var winId = "frm_open_notify_" + i;
    win = new Ext.window.Window({
        id : winId,
        iconCls : args.iconCls ? args.iconCls : "info16",
        plain : false,
        width : args.width ? args.width : 200,
        height : args.height ? args.height : 100,
        closable : true,
        frameHeader : false,
        title : args.title ? args.title : "System",
        bodyPadding : 10,
        html : args.html ? args.html : ""
    });

    win.animateTarget = args.from ? args.from : 'btnUnikey';
    win.x = $('body').width() - win.width;
    win.y = $('body').height() - win.height - win.height * i - i*2 - $('.ux-taskbar').height() - 3;

    win.show();
    
    args.time = args.time ? args.time : 7000;
    setTimeout("Ext.getCmp('" + winId + "').close();", args.time);
};

var onExtSubmitError = function(form, action)
{
    switch (action.failureType) 
    {
        case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
        case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
        case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Thông báo', action.result.msg);
    }
    
    Ext.util.Mask.hide();
};

var setUnikey = function()
{
    loadJS('util/mudim.js', function(){
        $("#btnUnikey").click(function(){
            var me = $(".btnUnikeyCls");
            if (Mudim.method !== 4)
            {
                me.removeClass("icon-en");
                me.addClass("icon-vi");
                Mudim.SetMethod(4);
            }
            else
                {
                    me.removeClass("icon-vi");
                    me.addClass("icon-en");
                    Mudim.SetMethod(0);
                }
        });
    });
};

var autoTaskbar = function()
{
    if ($('#apn-null-toolbar').length)
    {
        var top = $('body').height();
        top = top - $('#apn-null-toolbar').height() - $('.ux-taskbar').height();
        $('.ux-taskbar').css("top", top);
    }
};

var autoRun = function()
{
    setUnikey();
    autoTaskbar();
    
    $(ExtMenu.desktop_shortcut).each(function(){
        if(this.autorun === 1 || this.autorun === true)
            this.handler(this);
    });
    
    var dashboard = $('<div class="dashboard"></div>');
    dashboard.load("html/dashboard.html");
    $('body').append(dashboard);
    $('.ux-desktop-shortcut').dblclick(function(){
        return false;
    });
    $('#iddesktop').dblclick(function(){
        var btn1 = $('.btnToggle1');
        var btn2 = $('.btnToggle2');
        if (btn2.css('display') === 'none') btn1.click();
        else btn2.click();
    });
    //openNotify({html : "Chào bạn <b>" + initData.full_name + "</b>,<br>Hệ thống đã khởi động xong."});
};
        
Ext.define('Application.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel'
    ],

    init: function() {
        
        this.callParent();

        autoTaskbar();
        
        setTimeout("autoRun();", 1000);                
        
        Ext.util.Mask.hide();
    },

    getModules : function(){
        return new Application.Core.StartMenu();
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',
            contextMenuItems: [
                {text: 'Ẩn tất cả cửa sổ', handler: me.onMinimizeAll, scope: me, minWindows: 1},
                {text: 'Hiện tất cả cửa sổ', handler: me.onRestoreAll, scope: me, minWindows: 1},
                {text: 'Tắt tất cả cửa sổ', handler: me.onCloseAll, scope: me, minWindows: 1},
//                {text: 'Tile windows', handler: me.onTileWindows, scope: me, minWindows: 1},
                {text: 'Tự động sắp xếp', handler: me.onCascadeWindows, scope: me, minWindows: 1},
                '-',
                {text: 'Cấu hình hệ thống', handler: me.onSettings, scope: me, iconCls:'settings'}
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: ExtMenu.desktop_shortcut
            }),

            wallpaper: initData.wallpaper_id && initData.wallpaper_id.length > 0 ? initData.service_path + '/core/file/getWallpaper?file_id=' + initData.wallpaper_id : initData.context_path + '/resources/images/bg.jpg',
            wallpaperStretch: initData.wallpaper_stretch
        });
    },

    getStartConfig : function() {
        var me = this, ret = me.callParent();
        return Ext.apply(ret, {
            id : 'startmenu_container',
            iconCls: 'user',
            height: 418,
            toolConfig: {
                items: [
                    {
                        text: Language.get('change_avatar', 'Đổi ảnh đại diện'),
                        iconCls:'avatar16',
                        handler: function(){
                            loadJS('user/change-avatar.js', function(){
                                var frm = new MyExt.User.ChangeAvatar();
                                frm.createWindow({name : 'Avatar', title : 'change_avatar'});
                            });
                        }
                    },
                    {
                        text: Language.get('user_info', 'Hồ sơ cá nhân'),
                        iconCls:'info16',
                        handler: me.changeInfo
                    },
                    {
                        text: Language.get('change_password', 'Thay đổi mật khẩu'),
                        iconCls:'key16',
                        handler: me.changePassword
                    },                    
                    {
                        text: Language.get('login_history', 'Lịch sử đăng nhập'),
                        iconCls:'access16',
                        handler: me.getHistory
                    },
                    '-',
                    {
                        text: Language.get('system_config', 'Cấu hình hệ thống'),
                        iconCls:'config16',
                        handler: me.onSettings
                    },
                    {
                        id : "btnUnikey1",
                        text: Language.get('unikey', 'Bật tắt Tiếng Việt'),
                        iconCls:'btnUnikeyCls ' + (($.readCookie("unikey") === 4)? "icon-vi" : "icon-en") ,
                        handler: function(){
                            $("#btnUnikey").click();
                            return false;
                        }
                    },
                    '-',
                    {
                        text: Language.get('logout', 'Đăng xuất'),
                        iconCls:'logout16',
                        handler: me.onLogout
                    }
                ]
            }
        });
    },
    changeInfo : function(){
        loadJS('user/change-info.js', function(){
            var frm = new MyExt.User.ChangeInfo();
            frm.createWindow({name : "Hồ sơ cá nhân", title: 'user_info'});
        });
    },
    changePassword : function(){
        loadJS('user/change-password.js', function(){
            var frm = new MyExt.User.ChangePassword();
            frm.createWindow({name : "Thay đổi mật khẩu", title: 'change_password'});
        });
    },
    getHistory : function(){
        loadJS('user/login-history.js', function(){
            var frm = new MyExt.User.LoginHistory();
            frm.createWindow({"name" : Language.get('login_history', 'Lịch sử đăng nhập')});
        });
    },
    getTaskbarConfig: function () {
        var ret = this.callParent();
        var tray = [];
        tray = [
            {id : "btnUnikey", name: 'Bộ gõ', iconCls: 'btnUnikeyCls icon-en'}, 
            {xtype: 'trayclock', flex: 1}                                
        ];
        
        return Ext.apply(ret, {
            quickStart: ExtMenu.desktop_quickstart,
            trayItems: tray
        });
    },
    logout: function () {
        $.removeCookie("app_state");
        $.removeCookie("app_token");
        window.location.href = initData.url_logout;
    },
    onLogout: function () {
        var me = this;
        Ext.Msg.confirm(Language.get('notice', 'Thông báo'), Language.get('confirm_logout', 'Đăng xuất khỏi hệ thống?'), 
            function(btn){
                if (btn === "yes"){
                    $.removeCookie("app_state");
                    $.removeCookie("app_token");
                    window.location.href = initData.url_logout;
                }
            }
        );
    },

    onSettings: function () {
        loadJS('desktop/preferences.js', function(){
            var dlg = new Ext.Desktop.Preferences();
            dlg.createWindow({
                desktop: this.desktop
            });
        });
    },
    onCloseAll : function(){
        var desktop = this.desktop;
        
        desktop.getWindows().each(function(win) {
           win.close(); 
        });
    },
    onMinimizeAll : function(){
        var desktop = this.desktop;
        
        desktop.getWindows().each(function(win) {
           win.minimize(); 
        });
    },
    onRestoreAll : function(){
        var desktop = this.desktop;
        desktop.getWindows().each(function(win) {
           win.show();
           win.restore(); 
           win.toFront();
        });
    },
    
    onTileWindows : function()
    {
        var desktop = this.desktop;
        desktop.tileWindows();
    },
    
    onCascadeWindows : function()
    {
        var desktop = this.desktop;
        desktop.cascadeWindows();
    }
});

