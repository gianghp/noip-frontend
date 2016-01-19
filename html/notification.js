Dashboard = Dashboard !== undefined ? Dashboard : {};
Dashboard.Notification = function () {

    var fnInit = function () {
        $('.notificationItems').css('height', $(window).height() - 130);
        $(window).resize(function() {
            $('.notificationItems').css('height', $(window).height() - 130);
        });
    };

    return {
        init: function () {
            fnInit();
        }
    };
}();

Dashboard.Notification.init();