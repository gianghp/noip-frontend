/**
Core script to handle the entire theme and core functions
**/
var QuickSidebar = function () {
    
    var getLastPostPos = function() {
        var chatContainer = $('.page-quick-sidebar-chat-user-messages');
        var height = 0;
        chatContainer.find(".post").each(function() {
            height = height + $(this).outerHeight() + 20;
        });

        return height;
    };  
        
    var preparePost = function(id, dir, time, name, avatar, message, user_id) {
        var tpl = '';
        tpl += '<div class="post '+ dir +'" id="post' + id + '">';
        tpl += '<img class="avatar" alt="" src="' + avatar +'"/>';
        tpl += '<div class="message">';
        tpl += '<span class="arrow"></span>';
        tpl += '<a href="/admin/profile.html?id=' + user_id + '" class="name">' + name + '</a>&nbsp;';
        tpl += '<span class="datetime">, ' + time + '</span>';
        tpl += '<span class="body">';
        tpl += message;
        tpl += '</span>';
        tpl += '</div>';
        tpl += '</div>';

        return tpl;
    };
    
    // Handles quick sidebar toggler
    var handleQuickSidebarToggler = function () {
        // quick sidebar toggler
        $('.top-menu .dropdown-quick-sidebar-toggler a, .page-quick-sidebar-toggler').click(function (e) {
            $('body').toggleClass('page-quick-sidebar-open');
            if ($('.page-quick-sidebar-open').length > 0){
                $('.page-quick-sidebar-chat-users ul').load('/admin/quick_sidebar_chat.html', function(){
                    QuickSidebar.handleQuickSidebarChat();
                });
            }
        });
        
        $('.top-menu .dropdown-quick-sidebar-toggler2 a').click(function (e) {
            $('body').toggleClass('page-quick-sidebar-open');
            if ($('.page-quick-sidebar-open').length > 0){
                $('.page-quick-sidebar-chat-users ul').load('/admin/quick_sidebar_chat.html', function(){
                    QuickSidebar.handleQuickSidebarChat();
                });
            }
            $('.page-quick-sidebar .tab-pane').removeClass('active');
            $('.page-quick-sidebar .page-quick-sidebar-chat').addClass('active');
            $('.page-quick-sidebar ul li').removeClass('active');
            $('.page-quick-sidebar #quick-sidebar-tab-chat').addClass('active');
        });
        
        $('.page-quick-sidebar-toggler').click(function (e) {
            $('body').removeClass('page-quick-sidebar-open');
        });
    };

    // Handles quick sidebar chats
    var handleQuickSidebarChat = function () {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperChat = wrapper.find('.page-quick-sidebar-chat');

        var initChatSlimScroll = function () {
            var chatUsers = wrapper.find('.page-quick-sidebar-chat-users');
            var chatUsersHeight;

            chatUsersHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

            // chat user list 
            Metronic.destroySlimScroll(chatUsers);
            chatUsers.attr("data-height", chatUsersHeight);
            Metronic.initSlimScroll(chatUsers);

            var chatMessages = wrapperChat.find('.page-quick-sidebar-chat-user-messages');
            var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.page-quick-sidebar-chat-user-form').outerHeight() - wrapperChat.find('.page-quick-sidebar-nav').outerHeight();

            // user chat messages 
            Metronic.destroySlimScroll(chatMessages);
            chatMessages.attr("data-height", chatMessagesHeight);
            Metronic.initSlimScroll(chatMessages);
        };

        initChatSlimScroll();
        Metronic.addResizeHandler(initChatSlimScroll); // reinitialize on window resize

        wrapper.find('.page-quick-sidebar-chat-users .media-list > .media').click(function () {
            $('.page-quick-sidebar-chat-user-messages').load('/admin/quick_sidebar_chat_message.html?user_id=' + $(this).attr('user_id'), function(){
                var chatContainer = wrapperChat.find(".page-quick-sidebar-chat-user-messages");
                chatContainer.slimScroll({
                    scrollTo: getLastPostPos()
                });
                $('.chat-badge-' + $(this).attr('user_id')).html('');
            });
            wrapperChat.addClass("page-quick-sidebar-content-item-shown");
            $(".page-quick-sidebar-chat-user-messages").attr('user_id', $(this).attr('user_id'));
        });

        wrapper.find('.page-quick-sidebar-chat-user .page-quick-sidebar-back-to-list').click(function () {
            wrapperChat.removeClass("page-quick-sidebar-content-item-shown");
            $('.page-quick-sidebar-chat-user-messages').html('');
            $(".page-quick-sidebar-chat-user-messages").attr('user_id', 0);
        });

        var handleChatMessagePost = function (e) {
            e.preventDefault();

            var chatContainer = wrapperChat.find(".page-quick-sidebar-chat-user-messages");
            var input = wrapperChat.find('.page-quick-sidebar-chat-user-form .form-control');

            var text = input.val();
            if (text.length === 0) {
                return;
            }

            // handle post
            var time = new Date();
            var user_id = $(".page-quick-sidebar-chat-user-messages").attr('user_id');
            $.ajax({
                url : '/admin/chat/post.do',
                type : 'post',
                dataType: 'json',
                data: {body: text, user_id: user_id},
                success : function(d){
                    if (d.id> 0)
                    {
                        var message = preparePost(d.id, d.stype, d.time, d.full_name, d.avatar, d.body, d.create_user);
                        message = $(message);
                        chatContainer.append(message);
                        chatContainer.slimScroll({
                            scrollTo: getLastPostPos()
                        });
                    }
                }
            });
            input.val("");

            // simulate reply
//            setTimeout(function(){
//                var time = new Date();
//                var message = preparePost(0, 'in', (time.getHours() + ':' + time.getMinutes()), "Ella Wong", '/assets/admin/layout/img/avatar2.jpg', 'Lorem ipsum doloriam nibh...', 0);
//                message = $(message);
//                chatContainer.append(message);
//
//                chatContainer.slimScroll({
//                    scrollTo: getLastPostPos()
//                });
//            }, 3000);
        };

        wrapperChat.find('.page-quick-sidebar-chat-user-form .btn').click(handleChatMessagePost);
        wrapperChat.find('.page-quick-sidebar-chat-user-form .form-control').keypress(function (e) {
            if (e.which === 13) {
                handleChatMessagePost(e);
                return false;
            }
        });
    };

    // Handles quick sidebar tasks
    var handleQuickSidebarAlerts = function () {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperAlerts = wrapper.find('.page-quick-sidebar-alerts');

        var initAlertsSlimScroll = function () {
            var alertList = wrapper.find('.page-quick-sidebar-alerts-list');
            var alertListHeight;

            alertListHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

            // alerts list 
            Metronic.destroySlimScroll(alertList);
            alertList.attr("data-height", alertListHeight);
            Metronic.initSlimScroll(alertList);
        };

        initAlertsSlimScroll();
        Metronic.addResizeHandler(initAlertsSlimScroll); // reinitialize on window resize
    };

    // Handles quick sidebar settings
    var handleQuickSidebarSettings = function () {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperAlerts = wrapper.find('.page-quick-sidebar-settings');

        var initSettingsSlimScroll = function () {
            var settingsList = wrapper.find('.page-quick-sidebar-settings-list');
            var settingsListHeight;

            settingsListHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

            // alerts list 
            Metronic.destroySlimScroll(settingsList);
            settingsList.attr("data-height", settingsListHeight);
            Metronic.initSlimScroll(settingsList);
        };

        initSettingsSlimScroll();
        Metronic.addResizeHandler(initSettingsSlimScroll); // reinitialize on window resize
    };

    var startGetMessage = function(){
            
        $('.page-quick-sidebar-chat-user-messages').mouseover(function(){
            if ($('.chat-badge-' + $(this).attr('user_id')).html().length > 0)
            {
                $('.chat-badge-' + $(this).attr('user_id')).html('');
                var i = 0;
                $('.chat-badge').each(function(){
                    if ($(this).html().length > 0) ++ i;
                });
                if (i == 0) $('.badge_chat_all').html('');
                $.ajax({
                    url : "/admin/quick_sidebar_chat_message/setread.do",
                    data : {user_id : $(this).attr('user_id')}
                });
            }
        });
        
        if ($('.page-quick-sidebar-chat-user-messages').length > 0)
        {
            setInterval(function(){
                var chatContainer = $('.page-quick-sidebar-chat-user-messages');
                var iMaxId = chatContainer.attr('maxid');
                $.ajax({
                    url : "/admin/quick_sidebar_chat_message/get.do",
                    data : {maxid : iMaxId},
                    dataType: 'json',
                    success : function(data){
                        var updateRead = 0;
                        for(var i=0; i<data.length; ++i)
                        {
                            var d = data[i];
                            if (chatContainer.attr('user_id') == d.user_id && $('#post' + d.id).length === 0)
                            {
                                var message = preparePost(d.id, d.stype, d.time, d.full_name, d.avatar, d.body, d.create_user);
                                message = $(message);
                                chatContainer.append(message);
                                chatContainer.slimScroll({
                                    scrollTo: getLastPostPos()
                                });
                            }

                            if (d.stype === "in")
                            {
                                var read = chatContainer.attr('user_id') == d.user_id && $('.page-quick-sidebar-content-item-shown').length > 0 && $('.page-quick-sidebar-open').length > 0 && $('#quick-sidebar-tab-chat').attr('class') == "active";
                                if (!read)
                                {
                                    if ($('.chat-badge-' + d.user_id).length > 0)
                                    {
                                        var badge = $('.chat-badge-' + d.user_id).html();
                                        if (badge.length > 0)
                                            badge = parseInt(badge) + 1;
                                        else badge = 1;

                                        $('.chat-badge-' + d.user_id).html(badge);
                                    }

                                    if ($('.badge_chat_all').length > 0)
                                    {
                                        var badge = $('.badge_chat_all').html();
                                        if (badge.length > 0)
                                            badge = parseInt(badge) + 1;
                                        else badge = 1;
                                        $('.badge_chat_all').html(badge);
                                    }
                                }
                                else if (updateRead == 0)
                                    {
                                        $.ajax({
                                            url : "/admin/quick_sidebar_chat_message/setread.do",
                                            data : {user_id : d.user_id}
                                        });
                                        updateRead = 1;
                                    }
                            }

                            if (d.id > iMaxId)
                            {
                                iMaxId = d.id;
                                chatContainer.attr('maxid', iMaxId);
                            }

                            if (d.stype === "in")
                            {
                                Metronic.notification(d.full_name, d.body, d.avatar, 7000);
                            }
                        }
                    }
                });
            }, 5000);
        }
    };
    
    return {
        init: function () {
            //layout handlers
            handleQuickSidebarToggler(); // handles quick sidebar's toggler
            handleQuickSidebarChat(); // handles quick sidebar's chats
            handleQuickSidebarAlerts(); // handles quick sidebar's alerts
            handleQuickSidebarSettings(); // handles quick sidebar's setting
            startGetMessage();
            
            $('.dropdown-notification .external').click(function(){
                $('body').addClass('page-quick-sidebar-open'); 
                if ($('.page-quick-sidebar-open').length > 0){
                    $('.page-quick-sidebar-chat-users ul').load('/admin/quick_sidebar_chat.html', function(){
                        QuickSidebar.handleQuickSidebarChat();
                    });
                }
                $('.page-quick-sidebar .tab-pane').removeClass('active');
                $('.page-quick-sidebar .page-quick-sidebar-alerts').addClass('active');
                
                $('.page-quick-sidebar ul li').removeClass('active');
                $('.page-quick-sidebar #quick-sidebar-tab-alerts').addClass('active');
            });
        }, 
        handleQuickSidebarChat : handleQuickSidebarChat
    };

}();