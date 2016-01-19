Ext.define('MyExt.Department.Manager', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function (args) {
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        var roleNames = {
            add: "permissions.add",
            edit: "permissions.edit",
            delete: "permissions.delete"
        };

        var fnAdd = function (){
            var checkRole = Role.check(roleNames.add);
            if (!checkRole) return false;
            
            if (grid.getSelectionModel().selected.items.length === 0)
                grid.getSelectionModel().select(0, true);

            var selectednode = grid.getSelectionModel().selected.items[0];
            var data = selectednode ? selectednode.data : null;
            loadJS("department/edit.js", function () {
                var dlg = new MyExt.Department.Edit();
                dlg.createWindow({
                    parent: winId,
                    title: "Thêm",
                    name: "admin-edit-department" + winId,
                    grid: grid,
                    parent_id: data.id
                });
            });

            return false;
        };
        
        var fnEdit = function (){
            var checkRole = Role.check(roleNames.edit);
            if (!checkRole) return false;
            
            if (grid.getSelectionModel().selected.items.length === 0)
                grid.getSelectionModel().select(0, true);

            var selectednode = grid.getSelectionModel().selected.items[0];
            var data = selectednode ? selectednode.data : null;
            loadJS("department/edit.js", function () {
                var dlg = new MyExt.Department.Edit();
                dlg.createWindow({
                    parent: winId,
                    title: "Sửa",
                    name: "admin-edit-department" + winId,
                    data: data.data,
                    grid: grid,
                    parent_id: data.data.parent_id
                });
            });

            return false;
        };

        var fnDelete = function (){
            var checkRole = Role.check(roleNames.delete);
            if (!checkRole) return false;
            
            if (grid.getSelectionModel().selected.items.length === 0)
                grid.getSelectionModel().select(0, true);

            var selectednode = grid.getSelectionModel().selected.items[0];
            var data = selectednode ? selectednode.data : null;

            Ext.MessageBox.show({
                title: Language.get('core.CanhBao', 'Cảnh báo'),
                msg: Language.get('core.BanDaChacChanMuonXoa', 'Bạn đã chắc chắn muốn xóa?') + ": " + data.name,
                buttons: Ext.MessageBox.YESNO,
                fn: function (btn) {
                    if (btn === "yes")
                    {
                        $.ajax({
                            url: Services.department + "/" + data.data.id + "/delete",
                            type: "delete",
                            dataType: "json",
                            success: function (data) {
                                if (data.success){
                                    selectednode.remove(true);
                                    store.sync();
                                }
                                else
                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), data.msg);
                            }
                        });
                    }
                },
                icon: Ext.MessageBox.WARNING
            });
        };

        var fnRefresh = function (){
            grid.store.load();
            return false;
        };

        if (!win) {
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
                        text: "Refresh",
                        iconCls: 'fa fa-refresh tbar-icon tbar-refresh',
                        handler: fnRefresh
                    }
                ]}
            );

            var store = Ext.create('Ext.data.TreeStore', {
                autoLoad: false,
                clearOnLoad: true,
                root: {
                    name: 'Cục SHTT',
                    id: 'root',
                    expanded: true,
                    loaded: true
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
                    url: Services.department + "/trees",
                    reader: {
                        type: 'json',
                        root: 'children'
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
                columns: [
                    {
                        xtype: 'treecolumn',
                        text: Language.get('name', 'Tên'),
                        flex: 1,
                        sortable: true,
                        dataIndex: 'name'
                    },
                    {
                        text: Language.get('description', 'Mô tả'),
                        sortable: false,
                        flex: 1,
                        dataIndex: 'data.desc'
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
                listeners : {
                    itemmove: function (me, oldParent, newParent, index, eOpts) {
                        $.ajax({
                            url: Services.department + "/" + me.data.id + "/update_parent",
                            data: JSON.stringify({parent_id: newParent.data.id}),
                            type: "put",
                            dataType: "json",
                            success: function (data) {

                            }
                        });
                    },
                    cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
                        if (iView.getGridColumns()[iColIdx].action === "users")
                        {
                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;

                            loadJS("user/seach.js", function () {
                                var dlg = new MyExt.User.Seach();
                                dlg.createWindow({
                                    parent: winId,
                                    title: Language.get('user', 'Người dùng'),
                                    name: "seach-user-" + winId,
                                    data: data,
                                    url_get_users: Services.department + "/" + data.id + "/all_users",
                                    handler: function (result, gridSeach) {
                                        $.ajax({
                                            url: Services.department + "/" + data.id + "/change_dept_user",
                                            type: 'PUT',
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
                        }
                        else if (iView.getGridColumns()[iColIdx].action === "edit")
                            fnEdit();
                        else if (iView.getGridColumns()[iColIdx].action === "delete")
                            fnDelete();
                    }
                },
                tbar: tbar
            });

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
                layout: 'fit',
                activateChildren: true,
                items: [grid]
            });
        }

        win.show();

        return win;
    }
});

