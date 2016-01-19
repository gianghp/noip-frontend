Ext.define('Ext.Desktop.Preferences', {
    extend: 'Ext.ux.desktop.Module',
    createWindow : function(args){
        args = args ? args : {};
        args.title = args.title ? args.title : "Cấu hình hệ thống";
        args.nam_hoc = args.nam_hoc ? args.nam_hoc : 0;
        var winId = args["name"] ? Ext.util.md5(args["name"]) : Ext.util.md5("Preferences");
        
        var panel = Ext.create('Ext.Panel', {
            border : false,
            autoLoad : {
                url : initData.context_path + '/desktop/desktop/preferences.htm',
                scripts : true
            },
            dockedItems : {
                style : {"padding": 10},
                xtype: 'toolbar',
                items : [
                {
                    xtype : "label",
                    text : "Cấu hình hệ thống:"
                }
            ]}
        });
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        if(!win){
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 560,
                height: 450,
                iconCls: args.iconCls ? args.iconCls : 'notepad',
                animCollapse:false,
                border: true,
                maximizable : false,
                minimizable : false,
                resizable : false,
                hideMode: 'offsets',
                layout: 'fit',  
                activateChildren: true,
                items : panel                
            });
        }                
        
        win.show();
    }
});

