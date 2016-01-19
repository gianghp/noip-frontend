Ext.define('MyExt.List.Manager', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function(args) {
        var winId = Ext.util.md5(args.name);
        
        var desktop = App.getDesktop();

        var win = desktop.getWindow(winId);

        if (!win) {

            var txtSearch = Ext.create("Ext.form.field.Text", {
                xtype: "textfield",
                fieldLabel: "Tìm kiếm",
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

            var store = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: Services.list,
                    reader: {
                        type: 'json',
                        root: 'collection',
                        totalProperty: 'size'
                    }
                },
                fields: [
                    {name: 'id', type: 'string'},
                    {name: 'code', type: 'string'},
                    {name: 'name', type: 'string'},
                    {name: 'desc', type: 'string'},
                    {name: 'no', type: 'int'},
                    {name: 'listtype', type: 'boolean'}
                ]
            });

            var tbar = new Ext.Toolbar({
                items: [
                    {
                        text: "Thêm",
                        iconCls: 'fa fa-plus-square-o tbar-icon tbar-add',
                        handler: function()
                        {
                            loadJS("list/edit.js", function() {
                                var dlg = new MyExt.List.Edit();
                                dlg.createWindow({
                                    parent: winId,
                                    title: "Thêm",
                                    name: "admin-edit-list" + winId,
                                    grid: grid
                                });
                            });

                            return false;
                        }
                    },
                    {
                        text: "Sửa",
                        iconCls: 'fa fa-pencil-square-o tbar-icon tbar-edit',
                        handler: function()
                        {
                            if (grid.getSelectionModel().selected.items.length === 0)
                                grid.getSelectionModel().select(0, true);

                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;

                            loadJS("list/edit.js", function() {
                                var dlg = new MyExt.List.Edit();
                                dlg.createWindow({
                                    parent: winId,
                                    title: "Sửa",
                                    name: "admin-edit-list" + winId,
                                    data: data,
                                    grid: grid
                                });
                            });

                            return false;
                        }
                    },
                    {
                        text: "Xóa",
                        iconCls: 'fa fa-minus-square-o tbar-icon tbar-delete',
                        handler: function()
                        {
                            if (grid.getSelectionModel().selected.items.length === 0)
                                grid.getSelectionModel().select(0, true);

                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;

                            Ext.MessageBox.show({
                                title: Language.get('core.CanhBao', 'Cảnh báo'),
                                msg: Language.get('core.BanDaChacChanMuonXoa', 'Bạn đã chắc chắn muốn xóa') + ": " + data.name,
                                buttons: Ext.MessageBox.YESNO,
                                fn: function(btn) {
                                    if (btn === "yes")
                                    {
                                        $.ajax({
                                            url: Services.list + "/" + data.id + "/delete",
                                            type : "delete",
                                            data: {id: data.id},
                                            dataType: "json",
                                            success: function(data) {
                                                if (data.success)
                                                    store.load();
                                                else
                                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), data.msg);
                                            }
                                        });
                                    }
                                },
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    },
                    {
                        text : "Lưu sắp xếp",
                        checkRole : true,
                        iconCls : 'number_order',
                        handler : function()
                        {
                            Ext.MessageBox.show({
                                title: 'Thông báo',
                                msg: 'Bạn có chắc chắn muốn lưu sắp xếp?',
                                buttons: Ext.MessageBox.YESNO,
                                buttonText: {                        
                                    yes: 'Có',
                                    no: 'Không'
                                },
                                icon: Ext.MessageBox.WARNING,
                                fn: function(btn){
                                    if(btn === 'yes'){
                                        var data = "";
                                        store.each(function(record) {                        
                                            data += ";" + record.get('id') + ',' + record.get('no');                          
                                        });
                                        data = data.length > 0 ? data.substring(1) : "";

                                        $.ajax({
                                            url: Services.list + "/updateNo",
                                            type: 'post',
                                            data: data,
                                            success : function(){
                                                store.load(); 
                                            }
                                        });
                                    } else {
                                        return;
                                    }
                                }
                            });
                        }
                    },
                    {
                        text: "Refresh",
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

            var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            });
        
            var grid = Ext.create('Ext.grid.Panel', {
                id: winId + '_panel',
                border: false,
                xtype: 'grid',
                plugins: [cellEditing],
                store: store,
                columns: [
                    new Ext.grid.RowNumberer({width: 40}),
                    {
                        text: "Code",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'code'
                    },
                    {
                        text: "Tên",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'name'
                    },
                    {
                        text: "Mô tả",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'desc'
                    },
                    {
                        xtype: 'numbercolumn',
                        header: 'Sắp xếp',
                        dataIndex: 'no',
                        sortable: false,
                        name: 'no',
                        width: 70,
                        format: '0',
                        align: "center",
                        editor: {
                            xtype: 'numberfield',
                            allowBlank: false,
                            minValue: 0,
                            maxValue: 1000
                        }
                    },
                    {
                        xtype: 'templatecolumn',
                        text: Language.get('type', 'Loại'),
                        width : 100,
                        align: 'center',
                        dataIndex: 'listtype',
                        tpl: Ext.create('Ext.XTemplate', '{listtype:this.formatStatus}', {
                            formatStatus: function(v) {
                                return v ? "Bảng riêng" : "";
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        header: 'Danh mục',
                        width: 60,
                        sortable: false,
                        dataIndex: 'id',
                        align: 'center',
                        action : 'danhmuc',
                        tpl: Ext.create('Ext.XTemplate', '{id:this.formatStatus}', {
                            formatStatus: function() {
                                var s = "<image src='resources/images/grid.png' style='margin-left:5px; cursor:pointer;'/>";
                                return s;
                            }
                        })
                    }
                ],
                listeners : {
                    cellclick: function(iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
                        if (iView.getGridColumns()[iColIdx].action === "danhmuc")
                        {
                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;
                            loadJS("list/managerItem.js", function() {
                                var dlg = new MyExt.List.ManagerItem();
                                dlg.createWindow({
                                    parent: winId,
                                    title: "Danh mục: " + data.name,
                                    name: "admin-edit-list" + winId,
                                    grid: grid,
                                    list : data.code,
                                    listtype : data.listtype
                                });
                            });
                            
                            return false;
                        }
                    }
                },
                tbar: tbar,
                bbar: new Ext.PagingToolbar({
                    store: store,
                    displayInfo: true
                })
            });

            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 750,
                height: 450,
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

            store.load();
        }

        win.show();

        return win;
    }
});

