var Socket = {};
Socket.Main = function () {

    var stompClient = null;

    function connect() {
        var app_token = $.cookie("app_token");
        var socket = new SockJS('http://localhost:9001/live');
        stompClient = Stomp.over(socket);
        stompClient.connect(app_token, app_token, function (frame) {
            
            loadJS("socket/user.js", function(){
                Socket.User.init(stompClient, '/user/queue/current');
            });
            
            loadJS("socket/p2p.js", function(){
                Socket.P2P.init(stompClient, '/user/queue/p2p');
            });
            
            loadJS("socket/notification.js", function(){
                Socket.Notification.init(stompClient, '/user/queue/notification');
            });
            
        });
    }

    function disconnect() {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
    }

    return {
        init: function () {
            connect();
        },
        connect : connect,
        disconnect : disconnect
    };
}();

Socket.Main.init();