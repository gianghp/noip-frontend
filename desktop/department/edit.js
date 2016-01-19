Ext.define('MyExt.Department.Edit', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function(args) {
        var winId = Ext.util.md5(args["name"]);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        if (!win) {
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
                        value: args.parent_id,
                        name: 'parent_id'
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
                    }
                ]
            });
        
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 400,
                height: 180,
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
                                if (frm.isValid()) {
                                    var valuesUpdate = frm.getValues();
                                    $.ajax({
                                        url: args.data ? Services.department + "/" + args.data.id + "/update" : Services.department + "/create",
                                        type: args.data ? 'PUT' : "POST",
                                        data: JSON.stringify(valuesUpdate),
                                        success : function(resp) {
                                            if (resp.success){
                                                Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                                if (args.data){
                                                    var selectednode = args.grid.getSelectionModel().selected.items[0];
                                                    selectednode.data.name = valuesUpdate.name;
                                                    selectednode.data.data.name = valuesUpdate.name;
                                                    selectednode.data.desc = valuesUpdate.desc;
                                                    selectednode.data.data.desc = valuesUpdate.desc;
                                                    selectednode.set('text', valuesUpdate.name);
                                                }
                                                else
                                                {
                                                    var selectednode = args.grid.getSelectionModel().selected.items[0];
                                                    //selectednode.data.leaf = false;
                                                    selectednode.set('leaf', false);
                                                    selectednode.appendChild({
                                                        id: resp.information.id,
                                                        name: resp.information.name,
                                                        leaf: true,
                                                        data: resp.information
                                                    });
                                                    selectednode.expand(true);
                                                }
                                                win.close();
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

