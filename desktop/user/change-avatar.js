Ext.define('MyExt.User.ChangeAvatar', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function (args) {

        var winId = Ext.util.md5(args["name"]);

        var user_id = args.uid ? args.uid : 0;

        var desktop = App.getDesktop();

        var win = desktop.getWindow(winId);
        if (!win) {
            var formUpload = Ext.create('Ext.form.Panel', {
                frame: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: '5 9 0',
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 120
                },
                items: [
                    {
                        xtype: 'filefield',
                        id: 'form-file',
                        emptyText: 'Chọn một tệp ảnh ...',
                        fieldLabel: '<div style="height:115px; width:115px; background-image: none; overflow: hidden;"><div class="imgAvatar115" style="height:115px; width:115px; background-image: url(' + initData.context_path + '/core/file/getAvatar115x115?r=' + Math.random() + '); overflow: hidden;"></div></div>',
                        name: 'filedata',
                        buttonText: 'Chọn ...',
                        buttonConfig: {
                            iconCls: 'upload-icon'
                        }
                    }],
                buttons: [{
                        text: 'Tải lên',
                        handler: function () {
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    headers : {abc:123},
                                    url: initData.service_path + '/core/user/changeAvatar',
                                    success: function (fp, o) {
                                        formUpload.getForm().reset();
                                        var f = initData.service_path + '/core/file/getAvatar115x115?r=' + Math.random();
                                        $(".imgAvatar115").css("background-image", "url(" + f + ")");
                                        f = initData.service_path + '/core/file/getAvatar50x50?r=' + Math.random();
                                        $(".imgAvatar50").css("background-image", "url(" + f + ")");
                                    },
                                    failure: onExtSubmitError,
                                    win: this.up('window')
                                });
                            }
                        }
                    }, {
                        text: 'Đóng',
                        handler: function () {
                            this.up('form').getForm().reset();
                            this.up('window').close();
                        }
                    }]
            });

            win = desktop.createWindow({
                id: winId,
                title: args.title ? args.title : "Thay đổi Avatar",
                width: 350,
                height: 190,
                iconCls: 'notepad',
                animCollapse: false,
                border: true,
                maximizable: false,
                minimizable: false,
                resizable: false,
                layout: 'fit',
                items: formUpload
            });
        }
        win.show();
        return win;
    }
});

