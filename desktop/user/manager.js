Ext.define('MyExt.User.Manager', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function (args) {
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        var roleNames = {
            add: "users.add",
            edit: "users.edit",
            delete: "users.delete"
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

            var fnAdd = function () {
                var checkRole = Role.check(roleNames.add);
                if (!checkRole) return false;
                
                loadJS("user/edit.js", function () {
                    var dlg = new MyExt.User.Edit();
                    dlg.createWindow({
                        parent: winId,
                        title: 'add',
                        name: "admin-edit-user" + winId,
                        grid: grid
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

                loadJS("user/edit.js", function () {
                    $.ajax({
                        url: Services.user + "/" + data.id,
                        success: function (user) {
                            var dlg = new MyExt.User.Edit();
                            dlg.createWindow({
                                parent: winId,
                                title: 'edit',
                                name: "admin-edit-user" + winId,
                                data: user,
                                grid: grid
                            });
                        }
                    });
                });
                return false;
            };

            var fnDelete = function ()
            {
                var checkRole = Role.check(roleNames.delete);
                if (!checkRole)
                    return false;

                if (grid.getSelectionModel().selected.items.length === 0)
                    grid.getSelectionModel().select(0, true);

                var selectednode = grid.getSelectionModel().selected.items[0];
                var data = selectednode ? selectednode.data : null;

                Ext.MessageBox.show({
                    title: Language.get('core.CanhBao', 'Cảnh báo'),
                    msg: Language.get('core.BanDaChacChanMuonXoa', 'Bạn đã chắc chắn muốn xóa') + ": " + data.username,
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn === "yes")
                        {
                            $.ajax({
                                url: Services.user + "/" + data.id + "/delete",
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
                        handler: function ()
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
                    url: Services.user,
                    reader: {
                        type: 'json',
                        root: 'collection',
                        totalProperty: 'size'
                    }
                },
                fields: [
                    {name: 'id', type: 'string'},
                    {name: 'username', type: 'string'},
                    {name: 'name', type: 'string'},
                    {name: 'address', type: 'string'},
                    {name: 'email', type: 'string'},
                    {name: 'department_id', type: 'string'},
                    {name: 'login_count', type: 'string'},
                    {name: 'active', type: 'boolean'},
                    {name: 'locked', type: 'boolean'},
                    {name: 'dob', type: 'date', dateFormat: 'd/m/Y'},
                    {name: 'last_login_date', type: 'date', dateFormat: 'Y-m-d H:i:s.0'}
                ]
            });

            var grid = Ext.create('Ext.grid.Panel', {
                id: winId + '_panel',
                border: false,
                xtype: 'grid',
                store: store,
                columns: [
                    new Ext.grid.RowNumberer({width: 40}),
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
                        width: 80,
                        align: 'left',
                        dataIndex: 'Locked',
                        tpl: Ext.create('Ext.XTemplate', '{locked:this.formatStatus}', {
                            formatStatus: function (v) {
                                return v === true ? "<span class='label label-sm label-danger'><i class='fa fa-lock grid-lock'></i> Khóa</span>" : "<span class='label label-sm label-info'><i class='fa fa-unlock grid-unlock'></i> Không</span>";
                            }
                        })
                    },
                    {
                        xtype: 'templatecolumn',
                        roleName: roleNames.edit,
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
                        if (iView.getGridColumns()[iColIdx].action === "edit")
                            fnEdit();
                        else if (iView.getGridColumns()[iColIdx].action === "delete")
                            fnDelete();
                    }
                },
                bbar: new Ext.PagingToolbar({
                    store: store,
                    displayInfo: true
                })
            });

            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 760,
                height: 450,
                iconCls: 'notepad',
                animCollapse: false,
                border: true,
                maximizable: true,
                minimizable: true,
                resizable: true,
                activateChildren: true,
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

