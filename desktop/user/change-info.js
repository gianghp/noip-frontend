Ext.define('MyExt.User.ChangeInfo', {
    extend: 'Ext.ux.desktop.Module',
    createWindow : function(args){
        var winId = Ext.util.md5(args["name"]);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        
        if(!win){
            var cboLanguage = Ext.create('Ext.form.field.ComboBox',{
                name : 'language',
                fieldLabel: Language.get('language', 'Ngôn ngữ'),
                queryMode: 'local',
                value: initData.language,
                displayField: 'value',
                valueField: 'id',
                store: Ext.create('Ext.data.Store', {
                    fields: ['id', 'value'],
                    data: [
                        {id: 'vn', value: 'Tiếng việt'},
                        {id: 'en', value: 'English'}
                    ]
                }),
                editable: false
            });
        
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width:400,
                height:200,
                iconCls: 'icon-info',
                animCollapse:false,
                border: true,
                maximizable : false,
                minimizable : false,
                resizable : false,
                
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
                    fieldDefaults: {msgTarget: 'side', labelWidth: 70},
                    items: [
                        {
                            fieldLabel: Language.get('user_name', 'Tài khoản'),
                            xtype: 'textfield',
                            value : initData.user_name,
                            name : 'username',
                            allowBlank: false,
                            readOnly : true
                        },
                        {
                            fieldLabel: Language.get('full_name', 'Họ và tên'),
                            xtype: 'textfield',
                            allowBlank: false,
                            name : 'name',
                            value : initData.full_name
                        },
                        {
                            fieldLabel: Language.get('email', 'Email'),
                            xtype: 'textfield',
                            allowBlank: true,
                            vtype: 'email',
                            name : 'email',
                            value : initData.email
                        },
                        cboLanguage
                    ],
                    buttons: { 
                        height : 40,
                        items : [{
                        text: Language.get('update', 'Cập nhật'),
                        iconCls: 'accept',
                        handler: function() {
                            var form = this.up('form').getForm();
                            if (form.isValid()){
                                $.ajax({
                                    url: Services.user + "/current/update",
                                    type: 'PUT',
                                    data: JSON.stringify(form.getValues()),
                                    success : function(resp) {
                                        if (resp.success){
                                            initData.email = form.findField("email").getValue();
                                            initData.full_name = form.findField("name").getValue();
                                                
                                            if (initData.language !== cboLanguage.getValue()){
                                                initData.language = cboLanguage.getValue();
                                                Language.setLanguage(initData.language);
                                            }
                                            
                                            Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(resp.code, resp.message));
                                            //win.close();
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
                        text: Language.get('close', 'Đóng'),
                        iconCls: 'cancel',
                        handler: function() {
                            this.up('form').getForm().reset();
                            this.up('window').close();
                        }
                    }]}
                }]
            });
        }
        win.show();
        return win;
    }
});

