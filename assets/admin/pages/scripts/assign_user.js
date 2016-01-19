var AssignUser = function () {
    return {
        init: function () {
            $('#frmAssign #btnAssign').click(function(){
                $.ajax({
                    url : "/admin/assign_user/save.do",
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
                                            window.location.href = '/admin/role.html';
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                
            });
        },
        checkAll : function(me)
        {
            me = $(me);
            var checked = me.prop('checked');
            $('.roleitem' + me.val()).each(function(){
                $(this).prop('checked', checked);
                if (checked) $(this).parent().addClass('checked');
                else $(this).parent().removeClass('checked');
            });
        }
    };
}();