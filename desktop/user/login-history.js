
Ext.define('MyExt.User.LoginHistory', {
    extend: 'Ext.ux.desktop.Module',

    createWindow : function(args){
        var winId = Ext.util.md5(args.name);
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        if(!win){
            var store = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: initData.service_path + "/core/user/login_history",
                    reader: {
                        type: 'json',
                        root: 'aRoot',
                        totalProperty: 'iCount'
                    }
                },
                fields: [
                    {name: 'client_ip', type: 'string'},
                    {name: 'session_id', type: 'string'},
                    {name: 'time_start', type: 'date', dateFormat : 'Y-m-d H:i:s.0'},
                    {name: 'time_end', type: 'date', dateFormat : 'Y-m-d H:i:s.0'},
                    {name: 'time_total', type: 'string'},
                    {name: 'me', type: 'int'}
                ]
            });
        
            win = desktop.createWindow({
                id: winId,
                title: args.title ? args.title : "Lịch sử truy cập: " + initData.user_name,
                width: 700,
                height:400,
                iconCls: 'notepad',
                animCollapse:false,
                border: true,
                maximizable : true,
                minimizable : true,
                resizable : true,
                layout: 'fit',
                items: [
                    {
                        border: false,
                        xtype: 'grid',
                        store: store,
                        columns: [
                            new Ext.grid.RowNumberer({width: 40}),
                            {
                                text: "Client IP",
                                flex : 1,
                                dataIndex: 'client_ip'
                            },
                            {
                                text: "Ngày đăng nhập",
                                align: 'center',
                                flex : 1,
                                sortable: true,
                                dataIndex: 'time_start',
                                renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
                            },
                            {
                                text: "Ngày đăng xuất",
                                align: 'center',
                                flex : 1,
                                sortable: true,
                                dataIndex: 'time_end',
                                renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
                            },
                            {
                                text: "Thời gian (phút)",
                                width : 100,
                                sortable: true,
                                align: 'center',
                                dataIndex: 'time_total'
                            },
                            {
                                xtype: 'templatecolumn',
                                text: 'Ghi chú',
                                width : 80,
                                sortable: true,
                                dataIndex: 'time_start',
                                align: 'center',
                                tpl: Ext.create('Ext.XTemplate', '{time_start:this.formatStatus}', {
                                    formatStatus: function(v) {
                                        var c = new Date();
                                        if (v && v.getFullYear() === c.getFullYear() && v.getMonth() === c.getMonth() && v.getDate() === c.getDate()) return "Hôm nay";
                                        else return "";
                                    }
                                })
                            }
                        ],
                        bbar: new Ext.PagingToolbar({
                            store: store,
                            displayInfo: true
                        })
                    }
                ]                
            });
            
            store.load();
        }
        
        win.show();
        
        return win;
    }
});

