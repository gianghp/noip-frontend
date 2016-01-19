var Newsview = function () {
    return {
        init: function () {
            $(window).resize(function(){
                var win = $(this);
                var w = win.width();
                if (w < 1200){
                    $('#panel_tasks_comments').css('width','100%');
                    $('#panel_tasks_info').css('width','100%');
                }
                else{
                    $('#panel_tasks_comments').css('width','');
                    $('#panel_tasks_info').css('width','');
                }
            });
            $(window).resize();
        }
    };
}();