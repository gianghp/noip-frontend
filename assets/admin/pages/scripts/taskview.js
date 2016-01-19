var Taskview = function () {
    return {
        init: function () {
            $(window).resize(function(){
                var win = $(this);
                var w = win.width();
                if (w < 1200){
                    $('#panel_task_comments').css('width','100%');
                    $('#panel_task_info').css('width','100%');
                }
                else{
                    $('#panel_task_comments').css('width','');
                    $('#panel_task_info').css('width','');
                }
            });
            $(window).resize();
        }
    };
}();