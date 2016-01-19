Dashboard = Dashboard !== undefined ? Dashboard : {};
Dashboard.Chat = function () {
    var loadPage = function (url, fn) {
        if (fn !== undefined)
            $('.dashboard .page-content').load(url, fn);
        else $('.dashboard .page-content').load(url);
    };
    
    var fnInit = function () {
        $.ajax({
            url: Services.user,
            data: {start: 0, limit: 999999},
            success: function (data) {
                var chatUsers = $('.page-quick-sidebar-chat-users ul');
                $(data.collection).each(function () {
                    var me = this;
                    var item = $('<li class="media">\n\
                                    <div class="media-status">\n\
                                        <span class="badge badge-danger"></span>\n\
                                    </div>\n\
                                    <img class="media-object" src="resources/images/no-avatar.jpg" alt="...">\n\
                                    <div class="media-body">\n\
                                        <h4 class="media-heading"></h4>\n\
                                        <div class="media-heading-sub"></div>\n\
                                    </div>\n\
                                </li>');
                    
                    item.attr('user', me.username);
                    item.addClass('user_' + me.username);
                    item.find(".media-heading").html(me.username);
                    item.find(".media-heading-sub").html(me.name);
                    var badge = Dashboard.Main.getBadgeUserChat(me.username);
                    item.find(".media-status .badge").html(badge > 0 ? badge : '');
                    if ( me.username !== initData.user_name)
                        chatUsers.append(item);
                });
                
                chatUsers.find("li").click(function(){
                    var me = $(this);
                    loadPage("html/chat_item.html", function(){
                        $('.chatItems').attr('user', me.attr('user'));
                    });
                });
            }
        });
        
        $('.chatUsers').css('height', $(window).height() - 130);
        $(window).resize(function() {
            $('.chatUsers').css('height', $(window).height() - 130);
        });
    };

    return {
        init: function () {
            fnInit();
        }
    };
}();

Dashboard.Chat.init();