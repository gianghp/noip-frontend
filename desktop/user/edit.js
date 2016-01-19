Ext.define('MyExt.User.Edit', {
    extend: 'Ext.ux.desktop.Module',
    
    createWindow : function(args){
        
        var winId = Ext.util.md5(args["name"]);
        
        var departmentStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            clearOnLoad: true,
            root: {
                name: 'Cục SHTT',
                id :  'root',
                expanded: true,
                loaded:true
            },
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
                reader : {
                    type : 'json',
                    root : 'children'
                }
            }
        });

        departmentStore.on('load', function( store, records, options ) {
            var record = store.getNodeById(args.data ? args.data.department_id : '');
            if (record) cboDepartment.setValue(record.data.name);
        });  
        
        var cboDepartment = Ext.create('Ext.ux.TreeCombo',
        {
            editable : false,
            flex : 1,
            fieldLabel: '&nbsp;' + Language.get('department', 'Phòng ban'),
            labelWidth: 90,
            store: departmentStore,
            headerText : 'Chọn phòng ban',
            selectChildren: false,
            canSelectFolders: true,
            selectedId : args.data ? args.data.department_id : '',
            listeners:{
                valueSelected : function(me, data){
                    txtDepartmentId.setValue(data.id);
                },
                afterrender: function(pnl) {
                    cboDepartment.focus();
                }
            }
        });
        departmentStore.load();
        
        var txtDepartmentId = Ext.create('Ext.form.field.Hidden',{
            value: args.data ? args.data.department_id : '',
            name: 'department_id'
        });
        
        var txtPassword = Ext.create('Ext.form.field.Text',{
            id : winId + "password",
            labelWidth: 90,
            fieldLabel: Language.get('password', 'Mật khẩu'), 
            value: args.data ? args.data.password : '',
            inputType: 'password',
            name: 'password',
            blankText: 'Bắt buộc nhập',
            allowBlank: args.data ? true : false,
            flex: 1
        });
        
        var txtConfirmPassword = Ext.create('Ext.form.field.Text',{
            fieldLabel: '&nbsp;' + Language.get('re_password', 'Nhập lại MK'),
            vtype : "confirm",
            initialField : winId + "password",
            vtypeText : 'Mật khẩu nhập lại không đúng.',
            labelWidth: 90,
            inputType: 'password',
            value: args.data ? args.data.password : '',
            name: 'confirmpassword',
            blankText: 'Bắt buộc nhập',
            allowBlank: args.data ? true : false,
            flex: 1
        });
        
        var form = new Ext.FormPanel({
            id : winId + '_form',
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
                    value : args.data ? args.data.id : '',
                    name: 'id'
                }, 
                txtDepartmentId, 
                {
                    xtype: 'fieldcontainer',              
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'textfield',
                            vtype : 'username',
                            fieldLabel: Language.get('account', 'Tài khoản'),
                            labelWidth: 90,
                            name: 'username',
                            value: args.data ? args.data.username : '',
                            readOnly: args.data ? true : false,
                            emptyText: 'Tài khoản...',
                            allowBlank: false,
                            blankText: 'Bắt buộc nhập',
                            flex: 1
                        },
                        cboDepartment
                    ]
                },
                {
                    xtype: 'fieldcontainer',              
                    layout: 'hbox',
                    defaults: {
                        labelWidth: 90
                    },
                    items: [
                        txtPassword,
                        txtConfirmPassword
                    ]
                },
                {
                    xtype: 'checkboxfield',
                    margin: '0 0 5 0',
                    fieldLabel: Language.get('locked', 'Khóa truy cập'),
                    boxLabel  : '(Không được phép đăng nhập vào hệ thống)',
                    name      : 'locked',
                    inputValue: true,
                    checked   : args.data? args.data.locked : false
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {                        
                        labelWidth: 90
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: Language.get('full_name', 'Họ và tên'),  
                            value: args.data ? args.data.name : '',
                            anchor: '100%',
                            allowBlank: false,
                            flex: 1,
                            blankText: 'Bắt buộc nhập',
                            name: 'name'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '&nbsp;' + Language.get('birthday', 'Ngày sinh'), 
                            value: args.data ? args.data.dob : '',
                            format: 'd/m/Y',
                            flex: 1,
                            name: 'dob',                             
                            emptyText: 'Ngày sinh...'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {                        
                        labelWidth: 90
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            id : winId + "email",
                            vtype: 'email',
                            value: args.data ? args.data.email : '',
                            fieldLabel: 'Email', 
                            name: 'email',
                            blankText: '',
                            flex : 1
                        },
                        {
                            xtype: 'textfield',
                            vtype : "confirm",
                            initialField : winId + "email",
                            vtypeText : 'Email nhập lại không đúng.',
                            fieldLabel: '&nbsp;Email',
                            value: args.data ? args.data.email : '',
                            name: 'mobile',
                            blankText: '',
                            flex : 1,
                            allowBlank: false
                        }
                    ]
                },     
                {
                    xtype: 'textfield',
                    name: 'address',
                    value: args.data ? args.data.address : '',
                    fieldLabel: Language.get('address', 'Địa chỉ'),
                    allowBlank: true
                }
            ]
        });
        
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        if(!win){
            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width:600,
                height:280,
                iconCls: args.iconCls ? args.iconCls : 'notepad',
                animCollapse:false,
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
                    items : [
                        {
                            text: Language.get('update', "Cập nhật"),
                            iconCls : 'fa fa-save',
                            handler: function() {
                                var frm = form.getForm();
                                if (txtPassword.getValue() !== "" && txtConfirmPassword.getValue() === ""){
                                    txtConfirmPassword.allowBlank = false;
                                }
                                else txtConfirmPassword.allowBlank = true;
                                
                                if (frm.isValid()){
                                    $.ajax({
                                        url: args.data ? Services.user + "/" + args.data.id + "/update" : Services.user + "/create",
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
                            text: Language.get('cancel', "Bỏ qua"),
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
        var iLeft  = aXY[0] + (parentWin.width - win.width) / 2;
        var iTop  = aXY[1] + (parentWin.height - win.height) / 2;
        win.setPosition(iLeft,iTop);
        win.show();
        
        return win;
    }
});

