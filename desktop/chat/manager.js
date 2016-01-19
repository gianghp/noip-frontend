Ext.define('MyExt.Chat.Manager', {
    extend: 'Ext.ux.desktop.Module',
    createWindow: function (args) {
        var winId = 'chatApp';
        var desktop = App.getDesktop();
        var win = desktop.getWindow(winId);
        if (!win) {
            
            var users = {
                text: 'Online',
                expanded: true,
                children: [{
                        text: 'Users',
                        expanded: true,
                        children: [
                            
                        ]
                    }
//                    , {
//                        text: 'Groups',
//                        expanded: true,
//                        children: [
//                            {text: 'Tạo nhóm', iconCls: 'user-add', leaf: true},
//                            {text: 'Aubrey', iconCls: 'user-girl', leaf: true},
//                            {text: 'Cale', iconCls: 'user-girl', leaf: true}
//                        ]
//                    }
                ]
            };
                        
            $(App.collectionUser).each(function () {
                var me = this;
                var badge = Dashboard.Main.getBadgeUserChat(me.username);
                badge = badge > 0 ? badge : '';
                users.children[0].children.push({id : 'nodechat_' + me.username, text: me.username + " - " + me.name + ' <span class="badge badge-danger chatBadgeUser_' + me.username + '" style="height:13px; padding:0px;">' + badge + '</span>', user : me.username, iconCls: 'user', leaf: true});
            });
            
            var tree = Ext.create('Ext.tree.Panel', {
                id : 'chatUsers',
                title: 'Select one to chat ...',
                rootVisible: false,
                lines: false,
                autoScroll: true,
                tools: [{
                        type: 'refresh',
                        handler: function (c, t) {
                            tree.setLoading(true, tree.body);
                            var root = tree.getRootNode();
                            root.collapseChildren(true, false);
                            Ext.Function.defer(function () {
                                tree.setLoading(false);
                                root.expand(true, true);
                            }, 1000);
                        }
                    }
                ],
                store: Ext.create('Ext.data.TreeStore', {
                    fields: [
                        {name: 'id', type: 'string'},
                        {name: 'user', type: 'string'},
                        {name: 'text', type: 'string'},
                        {name: 'iconCls', type: 'string'},
                        {name: 'leaf', type: 'boolean'}
                    ],
                    root: users
                }),
                listeners : {
                    cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
                        var selectednode = tree.getSelectionModel().selected.items[0];
                        var data = selectednode ? selectednode.data : null;
                        if (data && data.user && data.user.length > 0){
                            var tab = tabs.getComponent(Ext.util.md5("tabchat_" + data.user));
                            if (!tab) addTab(data.user, true, data);
                            else tabs.setActiveTab(tab);
                        }
                    }
                }
            });

            var tbar = new Ext.Toolbar({
                items: [
                    {
                        tooltip: {title: 'Rich Tooltips', text: 'Let your users know what they can do!'},
                        iconCls: 'connect',
                        handler : function(){
                        }
                    },
                    '-',
                    {
                        tooltip: 'Add a new user',
                        iconCls: 'user-add'
                    },
                    ' ',
                    {
                        tooltip: 'Remove the selected user',
                        iconCls: 'user-delete'
                    }
                ]
            });

            var currentItem;
            var tabs = Ext.widget('tabpanel', {
                border: false,
                region: 'center',
                layout : "fit",
                resizeTabs: true,
                enableTabScroll: true,
                defaults: {
                    autoScroll: true,
                    bodyPadding: 10
                },
                items: [
                    {
                        border: false,
                        title: 'Home',
                        iconCls: 'tabs',
                        html: '',
                        closable: false,
                        flex : 1
                    }
                ],
                plugins: Ext.create('Ext.ux.TabCloseMenu', {
                    extraItemsTail: [],
                    listeners: {
                        aftermenu: function () {
                            currentItem = null;
                        },
                        beforemenu: function (menu, item) {
                            currentItem = item;
                        }
                    }
                })
            });

            function addTab(user, closable, data) {
                var badge = Dashboard.Main.getBadgeUserChat(user);
                badge = badge > 0 ? badge : '';
                
                tabs.add({
                    id: Ext.util.md5("tabchat_" + user),
                    data : data,
                    border: false,
                    closable: closable,
                    iconCls: 'user',
                    title: user.toUpperCase() + ' <span class="badge badge-danger chatBadgeUser_' + user + '" style="height:13px; padding:0px;">' + badge + '</span>',
                    listeners: {
                        afterrender : function(){
                            Dashboard.Main.loadChatItems(user);
                        },
                        beforeclose: function(element) {
                            console.info(element);
                            //return false;
                        },
                        activate : function(me, eOpts){
                            if (me.data && me.data.user)
                                Dashboard.Main.setBadgeUserChat(me.data.user, 0);
                        }
                    },
                    layout:'border',
                    defaults: {
                        //split: true
                        //bodyStyle: 'padding:5px'
                    },
                    items: [
                        {
                            title: '',
                            tbar : [
                                {
                                    html : data.text.toUpperCase()
                                }
                            ],
                            collapsible: false,
                            region:'center',
                            margins: '5 0 0 0',
                            html : '<div class="chatItems_' + user + '" style="height: 100%; padding:10px; overflow-y: auto;" data-always-visible="1" data-rail-visible1="1"><ul class="chats" style="margin-top: 5px;"></ul></div>'
                        },
                        {
                            title: '',
                            tbar : [
                                {
                                    tooltip: 'Add a new user',
                                    hidden : true,
                                    iconCls: 'user-add'
                                },
                                {
                                    tooltip: 'Remove the selected user',
                                    hidden : true,
                                    iconCls: 'user-delete'
                                },
                                '->',
                                {
                                    id: Ext.util.md5("tabchatsend_" + user),
                                    text : 'Send',
                                    tooltip: 'Send message',
                                    iconCls: 'sendsms',
                                    handler : function(){
                                        var txtMessage = Ext.getCmp("chatMessage_" + user);
                                        var message = txtMessage.getValue();
                                        message = message.trim();
                                        if (message === "") return false;
                                        
                                        var data = {action: 'chat', title: 'chat', message: message};
                                        
                                        var date = new Date();
                                        var hours = date.getHours();
                                        var minutes = "0" + date.getMinutes();
                                        var seconds = "0" + date.getSeconds();
                                        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ", " + ("0"+ date.getDate()).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + date.getFullYear();

                                        var item = $('<li class="out">\n\
                                            <img class="avatar" alt="" src="resources/images/no-avatar.jpg"/>\n\
                                            <div class="message">\n\
                                                <span class="arrow">\n\
                                                </span>\n\
                                                <a href="#" class="name"></a>\n\
                                                <span class="datetime">\n\
                                                    at 20:11 </span>\n\
                                                <span class="body"></span>\n\
                                            </div>\n\
                                        </li>');
                                        item.find('.name').text(initData.user_name);
                                        item.find('.body').text(message);
                                        item.find('.datetime').text(' at ' + formattedTime);
                                        
                                        var chatItems = $('.chatItems_' + user);
                                        chatItems.find('ul').append(item);
                                        chatItems.scrollTop(99999);
                                        Socket.P2P.send(user, JSON.stringify(data));

                                        var dataSend = {sender: initData.user_name, receiver: user, time : date.getTime(), message: {action: "chat", title: "chat", message: message}};
                                        dataSend.message = JSON.stringify(dataSend.message);
                                        
                                        $.ajax({
                                            url: Services.chat + "/create",
                                            type: "POST",
                                            data: JSON.stringify(dataSend),
                                            success : function(resp) {
                                                if (resp.success){
                                                    Dashboard.Main.addChatItem(user, dataSend);
                                                    txtMessage.setValue('');
                                                    txtMessage.focus();

                                                    var tab = tabs.getActiveTab();
                                                    Dashboard.Main.setBadgeUserChat(tab.data.user, 0);

                                                    $.ajax({
                                                        url: Services.chat + "/" + user + "/getByUsername",
                                                        success : function(d) {
                                                            console.info(d);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        
                                    
                                        
                                    }
                                }
                            ],
                            region: 'south',
                            height: 70,
                            minSize: 75,
                            maxSize: 250,
                            margins: '-1 0 0 0',
                            layout : 'fit',
                            items : [
                                {
                                    id : "chatMessage_" + user,
                                    enableKeyEvents : true,
                                    enforceMaxLength : true,
                                    maxLength : 1000,
                                    fieldStyle : {'border': '0px'},
                                    emptyText : 'Type a message here...',
                                    xtype: 'textfield',
                                    allowBlank: true,
                                    listeners: {                   
                                        keypress: function(field,event){
                                            if (event.getKey() === event.ENTER){
                                               $('#' + Ext.util.md5("tabchatsend_" + user)).click();
                                            }
                                        }                                   
                                    }
                                }
                            ]
                        }
                    ]
                }).show();
                var chatItems = $('.chatItems_' + user);
                chatItems.scrollTop(9999999);
            }

            win = desktop.createWindow({
                id: winId,
                title: args.title,
                width: 800,
                height: 500,
                iconCls: 'accordion',
                animCollapse: false,
                constrainHeader: true,
                bodyBorder: true,
                //tbar: tbar,
                layout: 'border',
                items: [
                    {
                        title: '',
                        border: false,
                        region: 'west',
                        width: 220,
                        minSize: 100,
                        maxSize: 250,
                        split: true,
                        layout: 'accordion',
                        items: [
                            tree
//                            ,
//                            {
//                                title: 'Settings',
//                                html: '',
//                                autoScroll: true
//                            }
                        ]
                    },
                    tabs
                ],
                listeners: {  
                    activate : function(){
                        var tab = tabs.getActiveTab();
                        if (tab && tab.data && tab.data.user)
                            Dashboard.Main.setBadgeUserChat(tab.data.user, 0);
                    }
                },
                activateChildren: true,
                parent: args.parent ? args.parent : false
            });
            win.addTab = addTab;
            win.tabs = tabs;
            win.setPosition($(window).width() - win.width - 30, 30);
        }

        win.show();

        return win;
    }
});

