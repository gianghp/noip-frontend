var Documentview = function () {
    return {
        init: function () {
            $(window).resize(function(){
                var win = $(this);
                var w = win.width();
                if (w < 1200){
                    $('#panel_document_comments').css('width','100%');
                    $('#panel_document_info').css('width','100%');
                }
                else{
                    $('#panel_document_comments').css('width','');
                    $('#panel_document_info').css('width','');
                }
            });
            $(window).resize();
        }
    };
}();