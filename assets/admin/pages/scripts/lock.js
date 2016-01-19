var Lock = function () {
    return {
        init: function () {
            $.backstretch([
                "/assets/admin/pages/media/bg/1.jpg",
                "/assets/admin/pages/media/bg/2.jpg",
                "/assets/admin/pages/media/bg/3.jpg",
                "/assets/admin/pages/media/bg/4.jpg"
            ], 
            {
                fade: 1000,
                duration: 8000
            });
            
            $('.form-inline').submit(function(){
                $.ajax({
                    url : "/admin/lock/auth.do",
                    data : $(this).serializeArray(),
                    dataType : 'json',
                    type : 'post',
                    success : function(r){
                        if (!r.success)
                        {
                            var pass = $('.form-inline input[name=password]');
                            pass.val('');
                            pass.focus();
                            pass.showTitle(r.msg);
                        }
                        else 
                        {
                            $('.page-lock').hide();
                            window.location.href = "/admin/index.html";
                        }
                    }
                });
                return false;
            });
        }
    };
}();