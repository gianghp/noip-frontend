var Role = function () {
    return {
        init: function () {
            $('#frmAssign #btnAssign').click(function(){
                $.ajax({
                    url : "/admin/assign/save.do",
                    dataType : 'json',
                    data : $('#frmAssign').serializeArray(),
                    success : function(d){
                        if (d.success)
                        {
                            bootbox.dialog({
                                title: "Thông báo",
                                message: "Bạn đã cập nhật quyền thành công.",
                                buttons: {
                                    success: {
                                        label: "OK",
                                        className: "btn-success",
                                        callback: function () {
                                            window.location.href = '/admin/user.html';
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                
            });
        }
    };
}();