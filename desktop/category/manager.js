Ext.define('MyExt.Category.Manager', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function (args) {
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        var roleNames = {
            add : args.list + ".add",
            edit : args.list + ".edit",
            delete : args.list + ".delete"
        };
        
        if (!win) {

            var txtSearch = Ext.create("Ext.form.field.Text", {
                xtype: "textfield",
                fieldLabel: "Tìm kiếm",
                labelAlign: "right",
                labelWidth: 60,
                width: 200,
                enableKeyEvents: true,
                listeners: {
                    keydown: function (t, e, o) {
                        if (e.getKey() === e.ENTER) {
                            fnSearch();
                        }
                    }
                }
            });

            var fnSearch = function () {
                store.proxy.extraParams.query = txtSearch.value;
                store.loadPage(1);
            };

            var btnSearch = Ext.create("Ext.button.Button", {
                iconCls: 'search',
                handler: function () {
                    fnSearch();
                }
            });

            var store = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: args.listtype ? Services.category + "/" + args.list : Services.listItem + "/list?list=" + args.list,
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
                    {name: 'active', type: 'boolean'}
                ]
            });

            var fnAdd = function () {
                var checkRole = Role.check(roleNames.add);
                if (!checkRole) return false;
                
                loadJS("category/edit.js", function () {
                    var dlg = new MyExt.Category.Edit();
                    dlg.createWindow({
                        parent: winId,
                        title: "add",
                        name: "admin-edit-category" + winId,
                        grid: grid,
                        list: args.list,
                        listtype: args.listtype
                    });
                });
                return false;
            };

            var fnEdit = function () {
                var checkRole = Role.check(roleNames.edit);
                if (!checkRole) return false;
                
                if (grid.getSelectionModel().selected.items.length === 0)
                    grid.getSelectionModel().select(0, true);

                var selectednode = grid.getSelectionModel().selected.items[0];
                var data = selectednode ? selectednode.data : null;

                loadJS("category/edit.js", function () {
                    var dlg = new MyExt.Category.Edit();
                    dlg.createWindow({
                        parent: winId,
                        title: "edit",
                        name: "admin-edit-category" + winId,
                        data: data,
                        grid: grid,
                        list: args.list,
                        listtype: args.listtype
                    });
                });
                return false;
            };

            var fnDelete = function () {
                var checkRole = Role.check(roleNames.delete);
                if (!checkRole) return false;
                
                if (grid.getSelectionModel().selected.items.length === 0)
                    grid.getSelectionModel().select(0, true);

                var selectednode = grid.getSelectionModel().selected.items[0];
                var data = selectednode ? selectednode.data : null;

                Ext.MessageBox.show({
                    title: Language.get('core.CanhBao', 'Cảnh báo'),
                    msg: Language.get('core.BanDaChacChanMuonXoa', 'Bạn đã chắc chắn muốn xóa') + ": " + data.name,
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn === "yes")
                        {
                            $.ajax({
                                url: args.listtype ? Services.category + "/" + args.list + "/" + data.id + "/delete" : Services.listItem + "/" + data.id + "/delete",
                                type: "delete",
                                data: {id: data.id},
                                dataType: "json",
                                success: function (data) {
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
            };

            var fnSaveOrder = function () {
                var checkRole = Role.check(roleNames.edit);
                if (!checkRole) return false;
                
                Ext.MessageBox.show({
                    title: 'Thông báo',
                    msg: 'Bạn có chắc chắn muốn lưu sắp xếp?',
                    buttons: Ext.MessageBox.YESNO,
                    buttonText: {
                        yes: 'Có',
                        no: 'Không'
                    },
                    icon: Ext.MessageBox.WARNING,
                    fn: function (btn) {
                        if (btn === 'yes') {
                            var data = "";
                            store.each(function (record) {
                                data += ";" + record.get('id') + ',' + record.get('no');
                            });
                            data = data.length > 0 ? data.substring(1) : "";

                            $.ajax({
                                url: args.listtype ? Services.category + "/" + args.list + "/updateNo" : Services.listItem + "/updateNo",
                                type: 'post',
                                data: data,
                                success: function () {
                                    store.load();
                                }
                            });
                        } else {
                            return;
                        }
                    }
                });
            };

            var fnRefresh = function () {
                grid.store.load();
                return false;
            };

            var tbar = new Ext.Toolbar({
                items: [
                    {
                        text: "Thêm",
                        roleName: roleNames.add,
                        iconCls: 'fa fa-plus-square-o tbar-icon tbar-add',
                        handler: fnAdd
                    },
                    {
                        text: "Sửa",
                        roleName: roleNames.edit,
                        iconCls: 'fa fa-pencil-square-o tbar-icon tbar-edit',
                        handler: fnEdit
                    },
                    {
                        text: "Xóa",
                        roleName: roleNames.delete,
                        iconCls: 'fa fa-minus-square-o tbar-icon tbar-delete',
                        handler: fnDelete
                    },
//                    {
//                        text: "Lưu sắp xếp",
//                        roleName: roleNames.edit,
//                        hidden: true,
//                        iconCls: 'number_order',
//                        handler: fnSaveOrder
//                    },
                    {
                        text: "Refresh",
                        iconCls: 'fa fa-refresh tbar-icon tbar-refresh',
                        handler: fnRefresh
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
                region:'center',
                border: false,
                xtype: 'grid',
                plugins: [cellEditing],
                store: store,
                columns: [
                    new Ext.grid.RowNumberer({width: 40}),
                    {
                        text: "Code",
                        sortable: false,
                        flex: 0.5,
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
                        hidden : true,
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
                        text: Language.get('core.KichHoat', 'Active'),
                        width: 50,
                        align: 'center',
                        dataIndex: 'active',
                        tpl: Ext.create('Ext.XTemplate', '{active:this.formatStatus}', {
                            formatStatus: function (v) {
                                return v ? "<span class='label label-sm label-info'><i class='fa fa-check grid-check'></i></span>" : "";
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        roleName : roleNames.edit,
                        roleType : 0,
                        text: Language.get('edit', 'Sửa'),
                        width: 50,
                        align: 'center',
                        dataIndex: 'id',
                        action: 'edit',
                        tpl: Ext.create('Ext.XTemplate', '{id:this.formatStatus}', {
                            formatStatus: function (v) {
                                var checkRole = Role.check(roleNames.edit);
                                var textCls = checkRole ? 'text-black' : 'text-gray';
                                return "<a href='javascript:;'><i class='fa fa-pencil-square-o " + textCls + " grid-edit'></i></a>";
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        roleName : roleNames.delete,
                        text: Language.get('delete', 'Xóa'),
                        width: 50,
                        align: 'center',
                        dataIndex: 'id',
                        action: 'delete',
                        tpl: Ext.create('Ext.XTemplate', '{id:this.formatStatus}', {
                            formatStatus: function (v) {
                                var checkRole = Role.check(roleNames.delete);
                                var textCls = checkRole ? 'text-black' : 'text-gray';
                                return "<a href='javascript:;'><i class='fa fa-minus-square-o " + textCls + " grid-delete'></i></a>";
                            }
                        })
                    }
                ],
                listeners: {
                    cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
                        if (iView.getGridColumns()[iColIdx].action === "edit")
                            fnEdit();
                        else if (iView.getGridColumns()[iColIdx].action === "delete")
                            fnDelete();
                    }
                },
                tbar: tbar,
                bbar: new Ext.PagingToolbar({
                    store: store,
                    displayInfo: true
                })
            });

            var storeList = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: Services.list,
                    reader: {
                        type: 'json',
                        root: 'collection',
                        totalProperty: 'size'
                    }
                },
                listeners:{
                    load : function(store, records, options ) {
                        if (records.length > 0 && gridList.getSelectionModel().selected.items.length === 0)
                            gridList.getSelectionModel().select(0, true);
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
            
            var txtSearchList = Ext.create("Ext.form.field.Text", {
                xtype: "textfield",
                fieldLabel: "",
                labelAlign: "right",
                labelWidth: 0,
                width: 170,
                enableKeyEvents: true,
                listeners: {
                    keydown: function (t, e, o) {
                        if (e.getKey() === e.ENTER) {
                            fnSearchList();
                        }
                    }
                }
            });

            var fnSearchList = function () {
                storeList.proxy.extraParams.query = txtSearchList.value;
                storeList.loadPage(1);
            };

            var btnSearchList = Ext.create("Ext.button.Button", {
                iconCls: 'search',
                handler: function () {
                    fnSearchList();
                }
            });
            
            var gridList = Ext.create('Ext.grid.Panel', {
                border: false,
                xtype: 'grid',
                store: storeList,
                tbar : [
                    txtSearchList, btnSearchList
                ],
                columns: [
                    new Ext.grid.RowNumberer({width: 25}),
                    {
                        text: "Chọn một danh mục",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'name'
                    }
                ],
                listeners: {
                    select: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
                        if (gridList.getSelectionModel().selected.items.length === 0)
                            gridList.getSelectionModel().select(0, true);

                        var selectednode = gridList.getSelectionModel().selected.items[0];
                        var data = selectednode ? selectednode.data : null;
                        args.list = data.code;
                        args.listtype = data.listtype;
                        store.proxy.url = data.listtype ? Services.category + "/" + data.code : Services.listItem + "/list?list=" + data.code;
                        store.load();
                    }
                }
            });
            storeList.load();
            
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 800,
                height: 450,
                iconCls: 'notepad',
                animCollapse: false,
                border: true,
                maximizable: true,
                minimizable: true,
                resizable: true,
                layout: 'border',
                activateChildren: true,
                parent: args.parent ? args.parent : false,
                items: [
                    {
                        title: '',
                        border: false,
                        layout: 'fit',
                        region:'west',
                        width: 200,
                        minSize: 100,
                        maxSize: 250,
                        split: true,
                        items: [gridList]
                    },
                    grid
                ]
            });

            store.load();
        }

        win.show();

        return win;
    }
});

