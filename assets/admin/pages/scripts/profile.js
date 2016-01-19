var Profile = function () {
    return {
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            $('#form-edit-user').submit(function(){
                $.ajax({
                    url : "/admin/user/updateProfile.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#frm-change-password').submit(function(){
                $.ajax({
                    url : "/admin/user/changePassword.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        }
    };
}();