var Auth = function(){

    return {
        init : function(){
            var access_token = $.query.get("access_token");
            var access_state = "" + $.query.get("state");
            var app_state = $.cookie("app_state");
            if (access_token !== undefined && access_token !== '' && app_state === access_state)
                $.cookie("app_token", access_token); 
            
            window.location.href = 'index.html';
        }
    };
    
}().init();

