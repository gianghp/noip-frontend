Ext.define('MyExt.Desktop.Shortcut', {
    extend: 'Ext.ux.desktop.Module',
    stretch : false,
    createWindow : function(args){
        
        args = args ? args : {};
        args.title = args.title ? args.title : "Biểu tượng";
        var winId = args["name"] ? Ext.util.md5(args["name"]) : Ext.util.md5("desktop-shortcut");
       
       var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: initData.service_path + "/core/desktop/getShortcut"
            }            
        });

        var tree = Ext.create('Ext.tree.Panel', {
            store: store,
            rootVisible: false,
            useArrows: true,
            frame: false,
            border : false,
            title: '',
            bodyStyle:"padding:5 0 0 0px;",
            dockedItems: [{
                style : {"padding": 10},
                xtype: 'toolbar',
                items: {
                    xtype : "label",
                    text: 'Chọn các chức năng sẽ đặt biểu tượng trên màn hình'
                }
            }],
            listeners:
            {
                checkchange : {
                    fn : function(record, checked, eOpts ){
                        var me = $('.ux-desktop-shortcut[shortcutid=' + record.get('id') + ']');
                        if (checked)
                        {
                            me.attr("hide", 0);
                            me.show();
                        }
                        else
                        {
                            me.attr("hide", 1);
                            me.hide();
                        }
                        
                        App.getDesktop().arrangeDesktopIcon();
                    }
                }
            }

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
                activateChildren: true,
                parent : args.parent ? args.parent : false,
                layout : "fit",
                items : [tree],
                buttons :{
                    height : 30,
                    items: [
                    { 
                        text: 'Chấp nhận', 
                        handler: function()
                        {
                            Ext.util.Mask.show(winId);
                            
                            var records = tree.getView().getChecked();
                            
                            var names = [];

                            Ext.Array.each(records, function(rec){
                                names.push(rec.get('id'));
                            });

                            $('.ux-desktop-shortcut').each(function(){
                                var me = $(this);
                                me.attr("hide1", me.attr("hide"));
                            });
                            
                            $.ajax({
                                url : "?call=core.shortcut.user_save",
                                type : "post",
                                dataType : "script",
                                data : {"data" : names.join(",")},
                                success : function(){
                                    win.close();
                                    Ext.util.Mask.hide(winId);                                    
                                }
                            });                                                        
                        }
                    },
                    { 
                        text: 'Hủy bỏ', 
                        handler: function()
                        {                            
                            win.close();                                                        
                        }
                    }
                ]},
                listeners: {
                    beforeclose : function(){
                        $('.ux-desktop-shortcut').each(function(){
                            var me = $(this);
                            me.attr("hide", me.attr("hide1"));

                            if (me.attr("hide") == 0) me.show();
                            else me.hide();
                        });

                        App.getDesktop().arrangeDesktopIcon();
                    }
                }
            });
        }                
        
        win.show();
    }
});

