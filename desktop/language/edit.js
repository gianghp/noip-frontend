Ext.define('Ext.Language.Edit', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function(args) {

        var winId = Ext.util.md5(args["name"]);

        var form = new Ext.FormPanel({
            id: winId + '_form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            url: initData.service_path + "/core/language/save",
            frame: true,
            bodyPadding: 5,
            defaults: {
                anchor: '100%',
                labelWidth: 90
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    value: args.data ? args.data.id : '',
                    name: 'id'
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    value: args.data ? args.data.name : '',
                    fieldLabel: 'Tên',
                    allowBlank: false,
                    blankText: 'Bắt buộc nhập'
                },
                {
                    xtype: 'textfield',
                    name: 'vn',
                    value: args.data ? args.data.vn : '',
                    fieldLabel: 'Tiếng việt',
                    allowBlank: false,
                    blankText: 'Bắt buộc nhập'
                },
                {
                    xtype: 'textfield',
                    name: 'en',
                    value: args.data ? args.data.en : '',
                    fieldLabel: 'Tiếng anh'
                }
            ]
        });

        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        if (!win) {
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 400,
                height: 200,
                iconCls: args.iconCls ? args.iconCls : 'notepad',
                animCollapse: false,
                border: false,
                maximizable: false,
                minimizable: false,
                resizable: false,
                modal: true,
                autoScroll: false,
                layout: 'fit',
                parent: args.parent ? args.parent : false,
                items: [form],
                buttons: {
                    items: [{
                        text: 'Cập nhật',
                        iconCls : 'fa fa-save',
                        handler: function() {
                            var formx = form.getForm();
                            if (formx.isValid()) {
                                formx.submit({
                                    success: function(form, action) {
                                        win.close();
                                        args.grid.store.load();
                                    },
                                    failure: onExtSubmitError
                                });
                            }
                        }
                    },
                    {
                        text: 'Bỏ qua',
                        iconCls : 'fa fa-circle-o-notch',
                        handler: function() {
                            form.getForm().reset();
                            win.close();
                        }
                    }]
                }
            });
        }

        var parentWin = args.grid.up("window");
        var aXY = parentWin.getPosition();
        var iLeft = aXY[0] + (parentWin.width - win.width) / 2;
        var iTop = aXY[1] + (parentWin.height - win.height) / 2;
        win.setPosition(iLeft, iTop);
        win.show();

        return win;
    }
});

