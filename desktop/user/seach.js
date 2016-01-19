Ext.define('MyExt.User.Seach', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function(args) {
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();

        var win = desktop.getWindow(winId);

        if (!win) {

            var txtSearch = Ext.create("Ext.form.field.Text", {
                xtype: "textfield",
                fieldLabel: Language.get('seach', 'Tìm kiếm'),
                labelAlign: "right",
                labelWidth: 60,
                width: 200,
                enableKeyEvents: true,
                listeners: {
                    keydown: function(t, e, o) {
                        if (e.getKey() === e.ENTER) {
                            fnSearch();
                        }
                    }
                }
            });

            var fnSearch = function() {
                store.proxy.extraParams.query = txtSearch.value;
                store.loadPage(1);
            };

            var btnSearch = Ext.create("Ext.button.Button", {
                iconCls: 'search',
                handler: function() {
                    fnSearch();
                }
            });

            var tbar = new Ext.Toolbar({
                items: [
                    {
                        text: Language.get('update', 'Cập nhật'),
                        iconCls: 'fa fa-save',
                        handler: function()
                        {
                            var selection = grid.getSelectionModel();
                            var items=[];
                            for(var i=0;i < grid.store.getCount();i++){  
                                var data = grid.store.getAt(i).data;
                                if(selection.isSelected(i)){
                                    if (!data.checked) items.push({item_id: data.id, checked : true});
                                }
                                else{
                                    if (data.checked) items.push({item_id: data.id, checked : false});
                                }
                            }
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
                    },
                    '->',
                    txtSearch, btnSearch
                ]}
            );

            var store = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: args.url_get_users,
                    reader: {
                        type: 'json',
                        root: 'collection',
                        totalProperty: 'size'
                    }
                },
                fields: [
                    {name: 'checked', type: 'boolean'},
                    {name: 'id', type: 'string'},
                    {name: 'username', type: 'string'},
                    {name: 'name', type: 'string'},
                    {name: 'address', type: 'string'},
                    {name: 'email', type: 'string'},
                    {name: 'department_id', type: 'string'},
                    {name: 'locked', type: 'boolean'},
                    {name: 'dob', type: 'date', dateFormat: 'd/m/Y'}
                ],
                listeners: {
                    load : function (records, operation, success){
                        var sm = grid.getSelectionModel();
                        Ext.each(records.data.items, function(record) {
                            if(record.data.checked){
                                var row = record.index;
                                sm.select(row, true);
                            }
                        });
                    }
                }
            });
            
            var modelCheck = new Ext.selection.CheckboxModel({
                mode: 'MULTI',
                checkOnly: true
            });
            
            var grid = Ext.create('Ext.grid.Panel', {
                id: winId + '_panel',
                border: false,
                xtype: 'grid',
                store: store,
                selModel:modelCheck,
                multiSelect: true,
                columns: [
                    {
                        text: Language.get('account', "Tài khoản"),
                        flex: 1,
                        dataIndex: 'username'
                    },
                    {
                        text: Language.get('full_name', "Họ và tên"),
                        flex: 1,
                        dataIndex: 'name'
                    },
                    {
                        text: Language.get('email', "Email"),
                        flex: 1,
                        dataIndex: 'email'
                    },
                    {
                        text: Language.get('birthday', "Ngày sinh"),
                        align: 'center',
                        width: 80,
                        sortable: true,
                        dataIndex: 'dob',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    },
                    {
                        xtype: 'templatecolumn',
                        text: Language.get('locked', 'Locked'),
                        width : 50,
                        align: 'center',
                        dataIndex: 'Locked',
                        tpl: Ext.create('Ext.XTemplate', '{locked:this.formatStatus}', {
                            formatStatus: function(v) {
                                return v == true ? "<img src='resources/images/lock.png' style='cursor:pointer;'/>" : "";
                            }
                        })
                    }
                ],
                bbar: new Ext.PagingToolbar({
                    store: store,
                    displayInfo: true
                })
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
                activateChildren : true,
                layout: 'fit',
                tbar: tbar,
                items: [grid]
            });

            store.load();
        }

        win.show();

        return win;
    }
});

