Socket = Socket !== undefined ? Socket : {};
Socket.User = function() {

    return {
        init: function (stompClient, endpoint) {
            
            stompClient.subscribe(endpoint, function (d) {
                var result = JSON.parse(d.body);
                if (result === null || !result.username) App.logout();
                else{
                    initData.user_name = result.username;
                    initData.full_name = result.name;
                    initData.email = result.email;
                    initData.theme_id = '';
                    initData.wallpaper_id = '';
                    initData.language = result.language === undefined || result.language === null ? "vn" : result.language;
                    initData.wallpaper_stretch = true;
                    Role.setRoles(result.permissions);
                    Language.setLanguage(initData.language);
                }
            });
            
        }
    };
    
}();