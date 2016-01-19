Dashboard = Dashboard !== undefined ? Dashboard : {};
Dashboard.ChatItems = function () {

    var fnInit = function () {
        $('.chatItems').css('height', $(window).height() - 220);
        $('.chatItems').scrollTop(99999);
        $('.chat-form .message').focus();
        $(window).resize(function() {
            $('.chatItems').css('height', $(window).height() - 220);
        });
        
//        $('#select_chat_user').select2({
//            placeholder: "Select more user ...",
//            allowClear: true
//        });
        
        $('#select_chat_user').change(function(){
            $('.chatItems').css('height', $(window).height() - 180 - $('#s2id_select_chat_user').height());
        });
        
        var toUser = $('.chatItems').attr('user');
        Dashboard.Main.setBadgeUserChat(toUser, 0);
    };

    var fnSend = function(){
        var txtMessage = $('.chat-form .input-cont input');
        txtMessage.keypress(function(e){
            if(e.charCode === 13) btnSend.click();
        });
        var chatItems = $('.chatItems ul');
        var btnSend = $('.chat-form .btn-cont');
        btnSend.click(function(){
            var message = txtMessage.val();
            var data = {action: 'chat', title: 'chat', message: message};
            var item = $('<li class="out">\n\
                <img class="avatar" alt="" src="assets/admin/layout/img/avatar2.jpg"/>\n\
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
            chatItems.append(item);
            txtMessage.val('');
            chatItems.find('.message').focus();
            
            var toUser = $('.chatItems').attr('user');
            Socket.P2P.send(toUser, JSON.stringify(data));
            $('.chatItems').scrollTop(99999);
            
            var dataSend = {sender: initData.user_name,receiver: toUser,message: {action: "chat", title: "chat", message: message}};
            dataSend.message = JSON.stringify(dataSend.message);
            Dashboard.Main.addChatItem(toUser, dataSend);
            return false;
        });
    };
    
    return {
        init: function () {
            var toUser = $('.chatItems').attr('user');
            Dashboard.Main.loadChatItems(toUser);
            fnInit();
            fnSend();
        }
    };
}();

Dashboard.ChatItems.init();