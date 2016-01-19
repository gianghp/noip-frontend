Ext.define('Ext.Language.Manager', {
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
                store.proxy.extraParams.pattern = txtSearch.value;
                store.load();
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
                    url: initData.service_path + "/language/seach",
                    reader: {
                        type: 'json',
                        root: 'rows',
                        totalProperty: 'count'
                    }
                },
                fields: [
                    {name: 'id', type: 'string'},
                    {name: 'name', type: 'string'},
                    {name: 'vn', type: 'string'},
                    {name: 'en', type: 'string'}
                ]
            });

            var tbar = new Ext.Toolbar({
                items: [
                    {
                        text: Language.get('add', 'Thêm'),
                        iconCls: 'fa fa-plus-square-o tbar-icon tbar-add',
                        handler: function()
                        {
                            loadJS("language/edit.js", function() {
                                var dlg = new Ext.Language.Edit();
                                dlg.createWindow({
                                    parent: winId,
                                    title: Language.get('add', 'Thêm'),
                                    name: "admin-edit-language" + winId,
                                    grid: grid
                                });
                            });

                            return false;
                        }
                    },
                    {
                        text: Language.get('edit', 'Sửa'),
                        iconCls: 'fa fa-pencil-square-o tbar-icon tbar-edit',
                        handler: function()
                        {
                            if (grid.getSelectionModel().selected.items.length === 0)
                                grid.getSelectionModel().select(0, true);

                            var selectednode = grid.getSelectionModel().selected.items[0];
                            var data = selectednode ? selectednode.data : null;

                            loadJS("language/edit.js", function() {
                                var dlg = new Ext.Language.Edit();
                                dlg.createWindow({
                                    parent: winId,
                                    title: Language.get('edit', 'Sửa'),
                                    name: "admin-edit-language" + winId,
                                    data: data,
                                    grid: grid
                                });
                            });

                            return false;
                        }
                    },
                    {
                        text: Language.get('delete', 'Xóa'),
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
                                            url: initData.service_path + "/language/" + data.id,
                                            dataType: "json",
                                            type: "delete",
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
                        text: Language.get('refresh', 'Làm tươi'),
                        iconCls: 'fa fa-refresh tbar-icon tbar-refresh',
                        handler: function()
                        {
                            fnSearch();
                            return false;
                        }
                    },
                    '->',
                    txtSearch, btnSearch
                ]}
            );

            var grid = Ext.create('Ext.grid.Panel', {
                id: winId + '_panel',
                border: false,
                xtype: 'grid',
                store: store,
                columns: [
                    new Ext.grid.RowNumberer({width: 40}),
                    {
                        text: Language.get('core.Name', 'Tên'),
                        sortable: false,
                        flex: 1,
                        dataIndex: 'name'
                    },
                    {
                        text: "Tiếng việt",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'vn'
                    },
                    {
                        text: "Tiếng anh",
                        sortable: false,
                        flex: 1,
                        dataIndex: 'en'
                    }
                ],
                tbar: tbar,
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
                layout: 'fit',
                activateChildren : true,
                items: [grid]
            });

            fnSearch();
        }

        win.show();

        return win;
    }
});

