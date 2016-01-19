Ext.define('MyExt.Role.Manager', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function (args) {
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        var roleNames = {
            add: "roles.add",
            edit: "roles.edit",
            delete: "roles.delete"
        };
        
        if (!win) {

            var txtSearch = Ext.create("Ext.form.field.Text", {
                xtype: "textfield",
                fieldLabel: Language.get('seach', 'Tìm kiếm'),
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

            var fnAdd = function ()
            {
                var checkRole = Role.check(roleNames.add);
                if (!checkRole) return false;
                
                loadJS("role/edit.js", function () {
                    var dlg = new MyExt.Role.Edit();
                    dlg.createWindow({
                        parent: winId,
                        title: 'add',
                        name: "admin-edit-role" + winId,
                        grid: grid
                    });
                });

                return false;
            };

            var fnEdit = function ()
            {
                var checkRole = Role.check(roleNames.edit);
                if (!checkRole) return false;
                
                if (grid.getSelectionModel().selected.items.length === 0)
                    grid.getSelectionModel().select(0, true);

                var selectednode = grid.getSelectionModel().selected.items[0];
                var data = selectednode ? selectednode.data : null;

                loadJS("role/edit.js", function () {
                    var dlg = new MyExt.Role.Edit();
                    dlg.createWindow({
                        parent: winId,
                        title: 'edit',
                        name: "admin-edit-role" + winId,
                        data: data,
                        grid: grid
                    });
                });

                return false;
            };

            var fnDelete = function ()
            {
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
                                url: Services.role + "/" + data.id + "/delete",
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

            var fnRefresh = function ()
            {
                grid.store.load();
                return false;
            };

            var store = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: Services.role,
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
                    {name: 'active', type: 'boolean'}
                ]
            });

            var tbar = new Ext.Toolbar({
                items: [
                    {
                        text: Language.get('add', 'Thêm'),
                        roleName: roleNames.add,
                        iconCls: 'fa fa-plus-square-o tbar-icon tbar-add',
                        handler: fnAdd
                    },
                    {
                        text: Language.get('edit', 'Sửa'),
                        roleName: roleNames.edit,
                        iconCls: 'fa fa-pencil-square-o tbar-icon tbar-edit',
                        handler: fnEdit
                    },
                    {
                        text: Language.get('delete', 'Xóa'),
                        roleName: roleNames.delete,
                        iconCls: 'fa fa-minus-square-o tbar-icon tbar-delete',
                        handler: fnDelete
                    },
                    {
                        text: Language.get('refresh', 'Refresh'),
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
                border: false,
                xtype: 'grid',
                plugins: [cellEditing],
                store: store,
                columns: [
                    new Ext.grid.RowNumberer({width: 40}),
                    {
                        text: Language.get('name', 'Tên'),
                        sortable: false,
                        flex: 1,
                        dataIndex: 'name'
                    },
                    {
                        text: Language.get('description', 'Mô tả'),
                        sortable: false,
                        flex: 1,
                        dataIndex: 'desc'
                    },
                    {
                        xtype: 'templatecolumn',
                        text: Language.get('active', 'Kích hoạt'),
                        width: 80,
                        align: 'center',
                        dataIndex: 'active',
                        tpl: Ext.create('Ext.XTemplate', '{active:this.formatStatus}', {
                            formatStatus: function (v) {
                                return v ? "<img src='resources/images/check.png' style='cursor:pointer;'/>" : "";
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        header: Language.get('permission', 'Quyền'),
                        width: 80,
                        sortable: false,
                        dataIndex: 'id',
                        align: 'center',
                        action: 'permissions',
                        tpl: Ext.create('Ext.XTemplate', '{id:this.formatStatus}', {
                            formatStatus: function () {
                                var checkRole = Role.check(roleNames.edit);
                                var textCls = checkRole ? 'text-black' : 'text-gray';
                                var s = "<a href='javascript:;'><i class='fa fa-tasks " + textCls + " grid-edit'></i></a>";
                                return s;
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        header: Language.get('user', 'Người dùng'),
                        width: 80,
                        sortable: false,
                        dataIndex: 'id',
                        align: 'center',
                        action: 'users',
                        tpl: Ext.create('Ext.XTemplate', '{id:this.formatStatus}', {
                            formatStatus: function () {
                                var checkRole = Role.check(roleNames.edit);
                                var textCls = checkRole ? 'text-black' : 'text-gray';
                                var s = "<a href='javascript:;'><i class='fa fa-user " + textCls + " grid-edit'></i></a>";
                                return s;
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        roleName: roleNames.edit,
                        roleType: 0,
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
                        roleName: roleNames.delete,
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
                        if (iView.getGridColumns()[iColIdx].action === "users")
                        {
                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;

                            loadJS("user/seach.js", function () {
                                var dlg = new MyExt.User.Seach();
                                dlg.createWindow({
                                    parent: winId,
                                    title: 'user',
                                    name: "seach-user-" + winId,
                                    data: data,
                                    url_get_users: Services.role + "/" + data.id + "/all_users",
                                    handler: function (result, gridSeach) {
                                        $.ajax({
                                            url: Services.role + "/" + data.id + "/change_role_user",
                                            type: 'post',
                                            data: JSON.stringify(result),
                                            success: function (resp) {
                                                if (resp.success) {
                                                    gridSeach.store.load();
                                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                                } else {
                                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                                }
                                            }
                                        });
                                    }
                                });
                            });

                            return false;
                        } else if (iView.getGridColumns()[iColIdx].action === "permissions")
                        {
                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;

                            loadJS("permission/seach.js", function () {
                                var dlg = new MyExt.Permission.Seach();
                                dlg.createWindow({
                                    parent: winId,
                                    title: 'permission',
                                    name: "seach-permission-" + winId,
                                    data: data,
                                    url_get_permissions: Services.role + "/" + data.id + "/trees_all_permissions",
                                    handler: function (result, gridSeach) {
                                        $.ajax({
                                            url: Services.role + "/" + data.id + "/change_role_permission",
                                            type: 'post',
                                            data: JSON.stringify(result),
                                            success: function (resp) {
                                                if (resp.success) {
                                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                                } else {
                                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                                }
                                            }
                                        });
                                    }
                                });
                            });

                            return false;
                        }
                        else if (iView.getGridColumns()[iColIdx].action === "edit")
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
                activateChildren: true,
                items: [grid]
            });

            store.load();
        }

        win.show();

        return win;
    }
});

