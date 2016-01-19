Socket = Socket !== undefined ? Socket : {};
Socket.Notification = function() {
    var notificationData = null;
    var stompClient = null;
    
    return {
        init: function (client, endpoint) {
            stompClient = client;
            
            stompClient.subscribe(endpoint, function (d) {
                var result = JSON.parse(d.body);
                notificationData = result;
                Socket.Notification.show();
            });
            
        },
        show : function(){
            var iconBg = ['info', 'success','danger','default','warning'];
            var icons = ['fa-bar-chart-o','fa-check','fa-briefcase','fa-bell-o','fa-user','fa-shopping-cart','fa-bar-chart-o','fa-share','fa-bell-o','fa-shopping-cart'];
            
            if (notificationData !== null && notificationData !== undefined){
                var notificationItems = $('.notificationItems ul');
                //notificationItems.html('');
                $(notificationData.collection).each(function () {
                    var me = this;
                    var data = JSON.parse(me.data);
                    var item = $('<li>\n\
                        <div class="col1">\n\
                            <div class="cont">\n\
                                <div class="cont-col1">\n\
                                    <div class="label label-sm">\n\
                                        <i class="fa"></i>\n\
                                    </div>\n\
                                </div>\n\
                                <div class="cont-col2">\n\
                                    <div class="desc">\n\
                                        You have 4 pending tasks. <span class="label label-sm">\n\
                                            Take action\n\
                                        </span>\n\
                                    </div>\n\
                                </div>\n\
                            </div>\n\
                        </div>\n\
                        <div class="col2">\n\
                            <div class="date">\n\
                                Just now\n\
                            </div>\n\
                        </div>\n\
                    </li>');
                    
                    //item.attr('user', me.username);
                    
                    var indexBg = Math.round(Math.random() * 10000) % iconBg.length;
                    item.find(".cont-col1 .label").addClass('label-' + iconBg[indexBg]);
                    item.find(".cont-col2 .label").addClass('label-' + iconBg[indexBg]);
                    
                    var indexIcon = Math.round(Math.random() * 10000) % icons.length;
                    item.find(".cont-col1 .label .fa").addClass(icons[indexIcon]);
                    
                    item.find(".cont-col2 .desc").html(me.message);
                    if (notificationItems.html() === "")
                        notificationItems.append(item);
                    else notificationItems.find('li').first().before(item);
                });
                
                Dashboard.Main.setBadgeNotification(notificationData.size);
            }
        }
    };
    
}();