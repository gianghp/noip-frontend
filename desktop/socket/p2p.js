Socket = Socket !== undefined ? Socket : {};
Socket.P2P = function() {
    
    var stompClient = null;
    
    return {
        init: function (client, endpoint) {
            stompClient = client;
            
            stompClient.subscribe(endpoint, function (d) {
                var result = JSON.parse(d.body);
                var data = JSON.parse(result.message);
                if (data.action === "chat") Dashboard.Main.receiveChat(result);
            });
            
        },
        send : function(receiver, message){
            stompClient.send("/app/p2p", {}, JSON.stringify({receiver: receiver, message: message }));
        }
    };
    
}();