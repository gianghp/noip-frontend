var add_wallpaper_file = function(winId){
    var i = vnKitApp.desktop.getWindow(winId);
    i.items.getAt(0).loadData();
};

Ext.define('Ext.Wallpaper', {
    extend: 'Ext.ux.desktop.Module',
    stretch : false,
    createWindow : function(args){
        var me = this;
        me.stretch = initData.wallpaper_stretch;
        
        args = args ? args : {};
        args.title = args.title ? args.title : "Hình nền";
        args.nam_hoc = args.nam_hoc ? args.nam_hoc : 0;
       
        var winId = args["name"] ? Ext.util.md5(args["name"]) : Ext.util.md5("wallpaper");
        
        var store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: initData.service_path + "/core/desktop/getWallpaper",
                reader: {
                    type: 'json',
                    root: ''
                }
            },
            fields: [
                {name: 'id'},
                {name: 'file_id'}
            ]
        });
        
        store.load();
        
        var tmp_wallpaper_id = initData.wallpaper_id;
        var panel = Ext.create('Ext.Panel', {
            id: 'images-view',
            name: 'images-view',
            title: '',
            height : 345,
            autoScroll : true,
            border : false,
            items: [
                Ext.create('Ext.view.View', {
                store: store,
                tpl: [
                    '<tpl for=".">',
                        '<div class="thumb-wrap" id="{name}">',
                        '<div class="thumb"><img src="' + initData.service_path + '/core/file/getWallpaper?file_id={file_id}"></div>',
                        '<span class="x-editable">{shortName}</span></div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'
                ],
                multiSelect: false,
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                listeners: {
                    itemclick : function(el, record, item, index, e, eOpts )
                    {
                        tmp_wallpaper_id = record.data.file_id;
                        args.desktop.setWallpaper(initData.service_path + '/core/file/getWallpaper?file_id=' + record.data.file_id, me.stretch);
                    }
                }
            })
            ],
            loadData : function(){
                store.load();
            },
            dockedItems : {
                style : {"padding": 10},
                xtype: 'toolbar',
                items :[
                {
                    xtype : "label",
                    text : " Chọn một hình nền:"
                }
            ]}
            
        });
        
        var panel1 = Ext.create('Ext.form.Panel', {
            title: '',
            border : false,
            bodyStyle:"padding:10 10 0 10px;",
            items: [
            {
                xtype : "filefield",
                buttonText: 'Chọn ảnh từ máy tính ...',
                buttonOnly : true,
                name : "filedata",
                allowBlank: false,
                listeners: {
                    change: function (o) {
                        var form = this.up('form').getForm();
                        if(form.isValid()){
                            form.submit({
                                url: initData.service_path + "/core/file/addWallpaper",
                                success: function(fp, o) {
                                    store.load();
                                    panel1.getForm().reset(); 
                                    tmp_wallpaper_id = o.result.data.file_id;
                                    args.desktop.setWallpaper(initData.service_path + '/core/file/getWallpaper?file_id=' + tmp_wallpaper_id, me.stretch);
                                },
                                win : this.up('window')
                            });
                        }
                    }
                }
            }]            
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
                resizable : true,
                hideMode: 'offsets',
                activateChildren: true,
                parent : args.parent ? args.parent : false,
                items : [panel, panel1],
                buttons :{
                    height : 30,
                    items: [
                    {
                        xtype: 'checkbox',
                        boxLabel: 'Tràn màn hình',
                        checked: me.stretch,
                        listeners: {
                            change: function (comp) {
                                me.stretch = comp.checked;
                                args.desktop.setWallpaper(initData.service_path + '/core/file/getWallpaper?file_id=' + tmp_wallpaper_id, me.stretch);
                            }
                        }
                    },                    
                    { 
                        text: 'Cập nhật', 
                        iconCls : "accept",
                        handler: function()
                        {
                            $.ajax({
                                url : initData.service_path + "/core/desktop/setWallpaper",
                                data : {wallpaper_id : tmp_wallpaper_id, wallpaper_stretch : me.stretch ? 1: 0},
                                success : function(){

                                }
                            });

                            initData.wallpaper_id = tmp_wallpaper_id;
                            initData.wallpaper_stretch = me.stretch;
                            win.close();
                        }, 
                        scope: me
                    },
                    { 
                        text: 'Hủy bỏ', 
                        iconCls : "cancel",
                        handler: function()
                        {                            
                            win.close();
                            var wallpaper = initData.wallpaper_id && initData.wallpaper_id.length > 0 ? initData.service_path + '/core/file/getWallpaper?file_id=' + initData.wallpaper_id : initData.context_path + '/resources/images/bg.jpg';
                            args.desktop.setWallpaper(wallpaper, me.stretch);
                        }, 
                        scope: me
                    }
                ]},
                listeners: {
                    beforeclose : function(){
                        var wallpaper = initData.wallpaper_id && initData.wallpaper_id.length > 0 ? initData.service_path + '/core/file/getWallpaper?file_id=' + initData.wallpaper_id : initData.context_path + '/resources/images/bg.jpg';
                        args.desktop.setWallpaper(wallpaper, me.stretch);
                    }
                }
            });
        }                
        
        win.show();
    }
});

