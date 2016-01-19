var Dashboard = {};
Dashboard.Main = function () {
    
    var loadPage = function (url) {
        $('.dashboard .page-content').load(url);
    };
    
    var fnInit = function () {
        Metronic.init();
        Layout.init();

        $('.btnToggle2').hide();
        $('.btnToggle1').click(function () {
            var pageContent = $('.page-content-wrapper');
            var pageHeader = $('.page-header');
            $('.dashboard').css('width', '45px');
            pageContent.addClass("hidden");
            pageHeader.addClass("hidden");
            $('.btnToggle2').show();
            return false;
        });
        
        $('.btnToggle2').click(function () {
            var pageContent = $('.page-content-wrapper');
            var pageHeader = $('.page-header');
            $('.dashboard').css('width', '570px');
            pageContent.removeClass("hidden");
            pageHeader.removeClass("hidden");
            $('.btnToggle2').hide();
            return false;
        });
        
        $('.dashboard .page-header .username').html(initData.user_name);
        $('.dashboard .loadpage').click(function(){
            var me = $(this);
            loadPage(me.attr("url"));
            $('.btnToggle2').click();
        });
        
        $('.dashboard #btnLanguage').click(function(){
            var me = $(this);
            if (Language.getLanguage() === "vn"){
                me.find("img").attr('src', 'resources/core/icons/nam/VI.gif');
                me.find("span").html('Tiếng việt');
                Language.setLanguage("en");
            }
            else{
                me.find("img").attr('src', 'resources/core/icons/nam/EN.gif');
                me.find("span").html('English');
                Language.setLanguage("vn");
            }
        });
        
        if (Language.getLanguage() === "en"){
            var me = $('.dashboard #btnLanguage');
            me.find("img").attr('src', 'resources/core/icons/nam/VI.gif');
            me.find("span").html('Tiếng việt');
        }

        $('.btnBadgeChat').click(function(){
            var desktop = App.getDesktop();
            var win = desktop.getWindow('chatApp');
            if (!win){
                $('.chat-shortcut').click();
                return false;
            }
            return false;
        });
        
//        if(typeof(Storage) !== undefined) {
//            if (localStorage["chatUserItems_" + initData.user_name] !== undefined)
//                chatUserItems = JSON.parse(Ext.util.base64.decode(localStorage["chatUserItems_" + initData.user_name]));
//            else chatUserItems = {};
//        }
//        else chatUserItems = {};
        
        loadPage("html/home.html");
    };

    var fnSetBadgeChat = function(inc){
        var badge = $('.nav .badge_chat').html();
        badge = badge.replace("+", "");
        if (badge === "") badge = 0;
        badge = parseInt(badge) + inc;
        if (badge > 9) badge = "9+";
        else if (badge === 0) badge = "";
        $('.nav .badge_chat').html(badge);
        fnsetTotalBadge();
    };
    
    var fnSetBadgeChat2 = function(badge){
        if (badge > 9) badge = "9+";
        $('.nav .badge_chat').html(badge > 0 ? badge : '');
        fnsetTotalBadge();
    };
    
    var fnSetBadgeNotification = function(inc){
        var badge = $('.nav .badge_notification').html();
        badge = badge.replace("+", "");
        if (badge === "") badge = 0;
        badge = parseInt(badge) + inc;
        if (badge > 9) badge = "9+";
        else if (badge === 0) badge = "";
        $('.nav .badge_notification').html(badge);
        fnsetTotalBadge();
    };
    
    var fnsetTotalBadge = function(){
        var badge = $('.nav .badge_chat').html();
        badge = badge.replace("+", "");
        if (badge === "") badge = 0;
        var badgeChat = parseInt(badge);
        
        badge = $('.nav .badge_notification').html();
        badge = badge.replace("+", "");
        if (badge === "") badge = 0;
        var badgeNotification = parseInt(badge)
        
        var badgeTotal = badgeChat + badgeNotification;
        if (badgeTotal > 9) badgeTotal = "9+";
        else if (badgeTotal === 0) badgeTotal = "";
        
        $('.page-sidebar .badge_total').html(badgeTotal);
    };
    
    var badgeUserChat = {};
    var updateBadgeChat = function(){
        var tmp = 0;
        for (var prop in badgeUserChat) {
            if(!badgeUserChat.hasOwnProperty(prop)) continue;
            tmp += badgeUserChat[prop];
        }
        fnSetBadgeChat2(tmp);
    };
    
    var fnSetBadgeUserChatInc = function(username, inc){
        if (badgeUserChat[username] === undefined)
            badgeUserChat[username] = 0;
        badgeUserChat[username] = badgeUserChat[username] + inc;
        var chatUsers = $('.page-quick-sidebar-chat-users ul');
        
        var badge = chatUsers.find('.user_' + username).find('.badge');
        if (badgeUserChat[username] === 0) badge.html('');
        else badge.html(badgeUserChat[username]);
        $('.chatBadgeUser_' + username).html(badgeUserChat[username]> 0 ? badgeUserChat[username] : '');
        updateBadgeChat();
    };
    
    var fnSetBadgeUserChat = function(username, value){
        badgeUserChat[username] = value;
        var chatUsers = $('.page-quick-sidebar-chat-users ul');
        var badge = chatUsers.find('.user_' + username).find('.badge');
        if (badgeUserChat[username] === 0) badge.html('');
        else badge.html(badgeUserChat[username]);
        $('.chatBadgeUser_' + username).html(badgeUserChat[username]> 0 ? badgeUserChat[username] : '');
        updateBadgeChat();
    };
    
    var fnGetBadgeUserChat = function(username){
        if (badgeUserChat[username] === undefined)
            badgeUserChat[username] = 0;
        return badgeUserChat[username];
    };
    
    var chatUserItems = {};
    var loadChatItems = function(username){
        if (chatUserItems[username] == undefined){
            $.ajax({
                url: Services.chat + "/" + username + "/getByUsername",
                data : {query : '', start : 0, limit: 999999},
                success : function(d) {
                    chatUserItems[username] = d.collection;
                    $(chatUserItems[username]).each(function(){
                        loadChatItem(this);
                    });
                    console.info(d);
                }
            });
            //chatUserItems[username] = [];
        }
        else{
            $(chatUserItems[username]).each(function(){
                loadChatItem(this);
            });
        }
    };
    
    var addChatItem = function(key, result){
        if (chatUserItems[key] == undefined)
            chatUserItems[key] = [];
        chatUserItems[key].push(result);
        //if(typeof(Storage) !== undefined) {
        //    localStorage["chatUserItems_" + initData.user_name] = Ext.util.base64.encode(JSON.stringify(chatUserItems));
        //}
    };
    
    var receiveChat = function(result, bell){
        var desktop = App.getDesktop();
        var win = desktop.getWindow('chatApp');
        if (!win){
            $('.chat-shortcut').click();
            setTimeout(receiveChat, 1000, result, 1);
            return false;
        }
        
        var data = JSON.parse(result.message);
        var chatItems = $('.chatItems_' + result.sender);
        if (chatItems.length === 0){
            var node = Ext.getCmp('chatUsers').store.getRootNode().findChild('id', "nodechat_" + result.sender, true); //true means deep (recursive)
            win = desktop.getWindow('chatApp');
            win.addTab(result.sender, true, node.data);
            chatItems = $('.chatItems_' + result.sender);
        }
        
        if (chatItems.length > 0){
            var date = new Date(result.time);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ", " + ("0"+ date.getDate()).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + date.getFullYear();
            
            //console.info(time.getDate());
            //console.info(time.getMonth());
            //console.info(time.getFullYear());
            
            var item = $('<li class="in">\n\
                <img class="avatar" alt="" src="resources/images/no-avatar.jpg"/>\n\
                <div class="message">\n\
                    <span class="arrow">\n\
                    </span>\n\
                    <a href="#" class="name"></a>\n\
                    <span class="datetime"></span>\n\
                    <span class="body"></span>\n\
                </div>\n\
            </li>');

            item.find('.name').text(result.sender);
            item.find('.body').text(data.message);
            item.find('.datetime').text(' at ' + formattedTime);
            chatItems.find('ul').append(item);
            chatItems.scrollTop(99999);
            Dashboard.Main.setBadgeUserChat(result.sender, 0);
        }
        
        var tab = win.tabs.getActiveTab();
        var btn2 = $('.btnToggle2');
        if (bell===1 || !tab || !tab.data || tab.data.user !== result.sender || btn2.css('display') === 'block'){
            Metronic.notification(result.sender, data.message, undefined, undefined, undefined, data, function(d){
                var tab = win.tabs.getComponent(Ext.util.md5("tabchat_" + result.sender));
                if (tab) win.tabs.setActiveTab(tab);
            });
            Dashboard.Main.setBadgeChat(1);
            Dashboard.Main.setBadgeUserChatInc(result.sender, 1);
        }
        addChatItem(result.sender, result);
    };
    
    var loadChatItem = function(result){
        var data = JSON.parse(result.message);
        
        var date = new Date(result.time);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ", " + ("0"+ date.getDate()).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + date.getFullYear();
            
        if (initData.user_name !== result.sender){
            var chatItems = $('.chatItems_' + result.sender);
            var item = $('<li class="in">\n\
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
            item.find('.name').text(result.sender);
            item.find('.body').text(data.message);
            item.find('.datetime').text(' at ' + formattedTime);
            chatItems.find('ul').append(item);
            chatItems.scrollTop(9999999);
            Dashboard.Main.setBadgeUserChat(result.sender, 0);
        }
        else{
            var chatItems = $('.chatItems_' + result.receiver);
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
            item.find('.name').text(result.sender);
            item.find('.body').text(data.message);
            item.find('.datetime').text(' at ' + formattedTime);
            chatItems.find('ul').append(item);
            chatItems.scrollTop(9999999);
        }
    };
    
    return {
        addChatItem : addChatItem,
        loadChatItem : loadChatItem,
        loadChatItems : loadChatItems,
        receiveChat : receiveChat,
        setBadgeNotification : fnSetBadgeNotification,
        setBadgeChat : fnSetBadgeChat,
        setBadgeUserChatInc: fnSetBadgeUserChatInc,
        setBadgeUserChat : fnSetBadgeUserChat,
        getBadgeUserChat: fnGetBadgeUserChat,
        init: function () {
            fnInit();
        }
    };
}();

Dashboard.Main.init();