Ext.define('MyExt.Desktop.QuickStart', {
    extend: 'Ext.ux.desktop.Module',
    stretch : false,
    createWindow : function(args){
        
        args = args ? args : {};
        args.title = args.title ? args.title : "Mở nhanh";
        var winId = args["name"] ? Ext.util.md5(args["name"]) : Ext.util.md5("desktop-QuickStart");
       
       var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: initData.service_path + "/core/desktop/getQuickstart"
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
                    text: 'Chọn các chức năng sẽ đặt trong mục mở nhanh'
                }
            }],
            listeners:
            {
                checkchange : {
                    fn : function(rec, checked, eOpts ){
                        var id = rec.get('id');
                        var desktop = App.getDesktop();
                        
                        desktop.taskbar.quickStart.setWidth(500);
                        
                        var count = 0;
                        for (i=0; i<desktop.taskbar.quickStart.items.length; ++i)
                        {
                            if (desktop.taskbar.quickStart.items.getAt(i).data.id == id)
                            {
                                if (checked)
                                    desktop.taskbar.quickStart.items.getAt(i).show();
                                else 
                                {
                                    desktop.taskbar.quickStart.items.getAt(i).hide();
                                }
                            }
                            if(!desktop.taskbar.quickStart.items.getAt(i).isHidden())
                                ++count;
                        }
                        
                        if (count == 0) desktop.taskbar.quickStart.hide();
                        else desktop.taskbar.quickStart.show();
                        
                        if (count == 1)
                            desktop.taskbar.quickStart.setWidth(30);
                        else if (count < 4)
                            desktop.taskbar.quickStart.setWidth(25*count);
                        else desktop.taskbar.quickStart.setWidth(100);
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
                            
                            
                            var i = 0;
                            for (i=0; i<desktop.taskbar.quickStart.items.length; ++i)
                            {
                                if (desktop.taskbar.quickStart.items.getAt(i).isHidden())
                                    desktop.taskbar.quickStart.items.getAt(i).hidden1 = 1;
                                else desktop.taskbar.quickStart.items.getAt(i).hidden1 = 0;
                            }

                            $.ajax({
                                url : "?call=core.quickstart.save",
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
                        desktop.taskbar.quickStart.setWidth(500);
                        
                        var count = 0;
                        for (i=0; i<desktop.taskbar.quickStart.items.length; ++i)
                        {
                            if (desktop.taskbar.quickStart.items.getAt(i).hidden1 == 0)
                            {
                                desktop.taskbar.quickStart.items.getAt(i).show();
                                ++count;
                            }
                            else desktop.taskbar.quickStart.items.getAt(i).hide();
                        }

                        if (count == 0) desktop.taskbar.quickStart.hide();
                        else desktop.taskbar.quickStart.show();

                        if (count < 4)
                            desktop.taskbar.quickStart.setWidth(25*count);
                        else desktop.taskbar.quickStart.setWidth(100);
                    }
                }
            });
        }                
        
        win.show();
    }
});

