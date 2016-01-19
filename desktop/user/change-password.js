Ext.define('MyExt.User.ChangePassword', {
    extend: 'Ext.ux.desktop.Module',

    createWindow : function(args){
        
        var winId = Ext.util.md5(args["name"]);
        
        var user_id = args.uid ? args.uid : 0;
        
        var desktop = App.getDesktop();
        
        var win = desktop.getWindow(winId);
        
        if(!win){
            win = desktop.createWindow({
                id: winId,
                title: args.title ? args.title : "Thay đổi mật khẩu",
                width:400,
                height:250,
                iconCls: 'notepad',
                animCollapse:false,
                border: true,
                maximizable : false,
                minimizable : false,
                resizable : false,
                hideMode: 'offsets',
                layout: 'fit',
                items: [
                {
                    xtype: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: false,
                    bodyPadding: 10,	
                    defaults: {anchor: '100%'},
                    fieldDefaults: {msgTarget: 'side', labelWidth: 130},
                    items: [
                        {
                            fieldLabel: 'Tài khoản của bạn',
                            xtype: 'textfield',
                            value : initData.user_name,
                            allowBlank: false,
                            readOnly : true
                        },
                        {
                            fieldLabel: 'Nhập mật khẩu cũ',
                            xtype: 'textfield',
                            inputType: 'password',
                            allowBlank: false,
                            name : 'old_password'
                        },
                        {
                            fieldLabel: 'Nhập mật khẩu mới',
                            id : winId + "new_password",
                            xtype: 'textfield',
                            inputType: 'password',
                            allowBlank:false,
                            name : 'new_password'
                        },
                        {
                            fieldLabel: 'Nhập lại mật khẩu mới',
                            xtype: 'textfield',
                            inputType: 'password',
                            allowBlank:false,
                            vtype : "confirm",
                            initialField : winId + "new_password",
                            vtypeText : 'Mật khẩu nhập lại không đúng.'
                        }
                    ],
                    tbar : {
                        style : {"padding" : 10},
                        items : [
                        {
                            xtype : "label",
                            text : "Mật khẩu tối thiểu phải có 1 ký tự."
                        }
                    ]},
                    buttons: {
                        height : 40,
                        items : [
                            {
                                text: 'Cập nhật',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()){
                                        $.ajax({
                                            type: "PUT",
                                            url: Services.user + "/current/change_password",
                                            data: JSON.stringify(form.getValues()),
                                            success : function(resp) {
                                                if (resp.success){
                                                    Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
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
                                text: 'Hủy bỏ',
                                handler: function() {
                                    this.up('form').getForm().reset();
                                    this.up('window').close();
                                }
                            }
                        ]
                    }
                }]
            });
        }
        win.show();
        return win;
    }
});

