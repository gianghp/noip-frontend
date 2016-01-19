var Utilityview = function () {
    return {
        init: function () {
            $(window).resize(function(){
                var win = $(this);
                var w = win.width();
                if (w < 1200){
                    $('#panel_utility_comments').css('width','100%');
                    $('#panel_utility_info').css('width','100%');
                }
                else{
                    $('#panel_utility_comments').css('width','');
                    $('#panel_utility_info').css('width','');
                }
            });
            $(window).resize();
        }
    };
}();