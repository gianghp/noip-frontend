Ext.define('MyExt.List.EditItem', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function(args) {

        var winId = Ext.util.md5(args["name"]);

        var form = new Ext.FormPanel({
            id: winId + '_form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
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
                    xtype: 'hiddenfield',
                    value: args.list,
                    name: 'list'
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    value: args.data ? args.data.code : '',
                    fieldLabel: 'Code',
                    allowBlank: false,
                    readOnly: args.data ? true : false,
                    blankText: 'Bắt buộc nhập'
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
                    xtype: 'textarea',
                    name: 'desc',
                    flex : 1,
                    value: args.data ? args.data.desc : '',
                    fieldLabel: 'Mô tả',
                    allowBlank: true
                },
                {
                    xtype: 'numberfield',
                    name: 'no',
                    value: args.data ? args.data.no : 0,
                    fieldLabel: 'Số thứ tự',
                    allowBlank: true,
                    minValue: 0,
                    maxValue: 999999
                },
                {
                    xtype: 'checkboxfield',
                    margin: '0 0 5 0',
                    fieldLabel: 'Tình trạng',
                    boxLabel  : 'Kích hoạt',
                    name      : 'active',
                    inputValue: true,
                    checked   : args.data? args.data.active : true
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
                height: 250,
                iconCls: args.iconCls ? args.iconCls : 'notepad',
                animCollapse: false,
                border: false,
                maximizable: false,
                minimizable: false,
                resizable: false,
                modal: false,
                autoScroll: false,
                layout: 'fit',
                parent: args.parent ? args.parent : false,
                items: [form],
                buttons: {
                    items: [
                        {
                            text: 'Cập nhật',
                            iconCls : 'fa fa-save',
                            handler: function() {
                                var frm = form.getForm();
                                if (frm.isValid()){
                                    $.ajax({
                                        url: args.data ? (args.listtype ? Services.category + "/" + args.list + "/" + args.data.id + "/update" : Services.listItem + "/" + args.data.id + "/update") : (args.listtype ? Services.category + "/" + args.list + "/create" : Services.listItem + "/create"),
                                        type: args.data ? 'PUT' : "POST",
                                        data: JSON.stringify(frm.getValues()),
                                        success : function(resp) {
                                            if (resp.success){
                                                Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                                win.close();
                                                args.grid.store.load();
                                            }
                                            else{
                                                Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                            }
                                        }
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
                        }
                    ]
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

