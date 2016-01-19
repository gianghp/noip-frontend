Ext.define('MyExt.Permission.Seach', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function(args) {
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();

        var win = desktop.getWindow(winId);
        var itemsOld = [];
        var itemsOld2 = {};
        
        if (!win) {
            var tbar = new Ext.Toolbar({
                items: [
                    {
                        text: Language.get('update', 'Cập nhật'),
                        iconCls: 'fa fa-save',
                        handler: function()
                        {
                            var items = [];
                            var items2 = {};
                            var records = grid.getView().getChecked();
                            Ext.Array.each(records, function(rec){  
                                if (rec && rec.raw && rec.raw.id)
                                {
                                    if (itemsOld2[rec.raw.id] === undefined)
                                        items.push({item_id: rec.raw.id, checked : true});
                                    else items2[rec.raw.id] = true;
                                }
                            });
                            
                            $(itemsOld).each(function(){
                                if (items2[this.id] === undefined){
                                    items.push({item_id: this.id, checked : false});
                                }
                            });
                            args.handler(items, grid);
                            return false;
                        }
                    },
                    {
                        text: Language.get('refresh', 'Refresh'),
                        iconCls: 'fa fa-refresh tbar-icon tbar-refresh',
                        handler: function()
                        {
                            grid.store.load();
                            return false;
                        }
                    }
                ]}
            );

            var SetCheckNode = function(node,e) {
                var nodeState = node.data['checked'];        
                if(e.target.nodeName !== 'INPUT'){
                    node.set('checked', !nodeState);
                    nodeState = node.data['checked'];
                }
                else{
                    var tmp = e.target.getAttribute('aria-checked');
                    tmp = tmp ? true : false;
                    nodeState = !tmp;
                } 
                //neu co node cha
                var parentNode = node.parentNode;
                if(parentNode){
                    if(!nodeState){
                        parentNode.set('checked', nodeState);
                    }
                    else{
                        var check = true;
                        parentNode.eachChild(function(n){ 
                            if(n===node){
                                check=(check && nodeState)?true:false;
                            }else{
                                //alert(n.data['checked']);
                                if(!n.data['checked']){
                                    check = false; 
                                }
                            }                    
                        });
                        if(check){
                            parentNode.set('checked', 'true');
                        }
                    }
                }
                // neu co node con
                if(node.hasChildNodes()){
                    node.eachChild(function(n){                        
                        n.set('checked', nodeState);
                    });
                }
            };

            var store = Ext.create('Ext.data.TreeStore', {
                autoLoad: false,
                clearOnLoad: true,
                root: {
                    name: 'Cục SHTT',
                    id :  'root',
                    expanded: true,
                    loaded:true
                },
                //folderSort: true,
                fields: [
                    {name: 'data', type: 'auto'},
                    {name: 'id', type: 'string'},
                    {name: 'data.id', type: 'string'},
                    {name: 'data.parent_id', type: 'string'},
                    {name: 'data.name', type: 'string'},
                    {name: 'data.desc', type: 'string'},
                    {name: 'expanded', type: 'boolean'},
                    {name: 'leaf', type: 'boolean'},
                    {name: 'iconCls', type: 'string'},
                    {name: 'name', type: 'string'}
                ],
                proxy: {
                    type: 'ajax',
                    url: args.url_get_permissions,
                    reader : {
                        type : 'json',
                        root : 'children'
                    }
                },
                listeners: {
                    load : function(me, node, records, successful, eOpts ){
                        itemsOld = [];
                        itemsOld2 = {};
                        var records = grid.getView().getChecked();
                        Ext.Array.each(records, function(rec){  
                            if (rec && rec.raw && rec.raw.id)
                            {
                                itemsOld.push({id : rec.raw.id});
                                itemsOld2[rec.raw.id] = true;
                            }
                        });
                    }
                }
            });
            
            store.load();
            
            var grid = Ext.create('Ext.tree.Panel', {
                id: winId + '_panel',
                border: false,
                store: store,
                rootVisible: true,
                //multiSelect: true,
                //singleExpand: true,
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop',
                        containerScroll: true
                    }
                },
                listeners: {
                    itemmove : function( me, oldParent, newParent, index, eOpts ){
                        $.ajax({
                            url: Services.permission + "/" + me.data.id + "/update_parent",
                            data: JSON.stringify({parent_id : newParent.data.id}),
                            type : "put",
                            dataType: "json",
                            success: function(data) {
                                
                            }
                        });
                    },
                    itemclick: function(view,rec,item,index,eventObj) {
                        SetCheckNode(rec,eventObj);
                    }
                },
                columns: [
                    {
                        xtype: 'treecolumn',
                        text: 'Phòng ban',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'name'
                    },
                    {
                        text: "Mô tả",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'data.desc'
                    }
                ],
                tbar: tbar
            });
            
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 700,
                height: 400,
                iconCls: 'notepad',
                animCollapse: false,
                border: true,
                maximizable: true,
                minimizable: true,
                resizable: true,
                layout: 'fit',
                activateChildren : true,
                items: [grid]
            });
        }

        win.show();

        return win;
    }
});

