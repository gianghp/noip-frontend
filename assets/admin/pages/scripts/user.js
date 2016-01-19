var User = function () {

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                ajax: {
                    url: "/admin/user/get.do?pattern=" + $('#frmGridSearch input').val()
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6]
                }]
            }
        });
        
        $('#frmGridSearch').submit(function(){
            var pattern = $(this).find("input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        User.grid = grid;
    };

    return {
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            handleRecords();
            
            $('#btn_add_user').click(function(){
                $('#div_add_user #group_id option').removeAttr('selected');
                $('#div_add_user #group_id').change();
                
                $('#div_add_user #position_id option').removeAttr('selected');
                $('#div_add_user #position_id').change();
                
                $('#div_add_user #depart_id option').removeAttr('selected');
                $('#div_add_user #depart_id').change();
                
                $('#div_add_user #cap_bac option').removeAttr('selected');
                $('#div_add_user #cap_bac').change();
                
                $('#div_add_user #chuc_vu option').removeAttr('selected');
                $('#div_add_user #chuc_vu').change();
                
                $('#div_list_user').addClass('hidden');
                $('#div_edit_user').addClass('hidden');
                $('#div_add_user').removeClass('hidden');
            });
            
            $('#div_add_user #btn-close').click(function(){
                $('#div_list_user').removeClass('hidden');
                $('#div_add_user').addClass('hidden');
                $('#div_edit_user').addClass('hidden');
            });
            
            $('#div_edit_user #btn-close').click(function(){
                $('#div_list_user').removeClass('hidden');
                $('#div_add_user').addClass('hidden');
                $('#div_edit_user').addClass('hidden');
            });
            
            $('#form-add-user').submit(function(){
                $.ajax({
                    url : "/admin/user/add.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#form-edit-user').submit(function(){
                $.ajax({
                    url : "/admin/user/update.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#changePassword #yes').click(function(){
                var pass = $('#changePassword #password');
                if (pass.val().length < 6){
                    bootbox.alert("Mật khẩu phải có tối thiểu 6 ký tự."); 
                }
                $.ajax({
                    url : "/admin/user/resertPass.do",
                    data : {id: User.grid.getSelectedRows()},
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        },
        edit : function(o)
        {
            $('#div_list_user').addClass('hidden');
            $('#div_edit_user').removeClass('hidden');
            
            $('#div_edit_user #id').val(o.id);
            $('#div_edit_user #user_name').val(o.user_name);
            $('#div_edit_user #full_name').val(o.full_name);
            $('#div_edit_user #phone').val(o.phone);
            $('#div_edit_user #mobile').val(o.mobile);
            $('#div_edit_user #email').val(o.email);
            $('#div_edit_user #website').val(o.website);
            $('#div_edit_user .date-picker').datepicker('update', o.birthday2);
            $('#div_edit_user #address').val(o.address);
            $('#div_edit_user #occupation').val(o.occupation);
            $('#div_edit_user #sex').val(o.sex);
            
            $('#div_edit_user #cap_bac').val(o.cap_bac);
            $('#div_edit_user #cap_bac').change();
            
            $('#div_edit_user #chuc_vu').val(o.chuc_vu);
            $('#div_edit_user #chuc_vu').change();
            
            $('#div_edit_user #position_id option').removeAttr('selected');
            $('#div_edit_user #position_id').change();
            if (o.user_position.length > 0){
                var t = o.user_position.split(",");
                $(t).each(function(){
                    $('#div_edit_user #position_id #' + this).attr('selected', 'selected');
                });
                $('#div_edit_user #position_id').change();
            }
            
            $('#div_edit_user #depart_id option').removeAttr('selected');
            $('#div_edit_user #depart_id').change();
            if (o.user_depart.length > 0){
                var t = o.user_depart.split(",");
                $(t).each(function(){
                    $('#div_edit_user #depart_id #' + this).attr('selected', 'selected');
                });
                $('#div_edit_user #depart_id').change();
            }
            
            $('#div_edit_user #group_id option').removeAttr('selected');
            $('#div_edit_user #group_id').change();
            if (o.user_group.length > 0){
                var t = o.user_group.split(",");
                $(t).each(function(){
                    $('#div_edit_user #group_id #' + this).attr('selected', 'selected');
                });
                $('#div_edit_user #group_id').change();
            }
        },
        setPassword: function(o)
        {
            if (o === false){
                if (User.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các tài khoản bạn cần đặt lại mật khẩu."); 
                else{
                    bootbox.dialog({
                        title: "Reset mật khẩu cho các tài khoản đã chọn.",
                        message: '<input id="password_to_change" type="password" value="" placeholder="Mật khẩu" class="form-control">',
                        buttons: {
                            success: {
                                label: "Đặt lại",
                                className: "btn-success",
                                callback: function () {
                                    var pass = $('#password_to_change');
                                    if (pass.val().length < 6){
                                        bootbox.alert("Mật khẩu phải có tối thiểu 6 ký tự."); 
                                        return false;
                                    }
                                    $.ajax({
                                        url : "/admin/user/resertpass.do",
                                        data : {id: User.grid.getSelectedRows(), password : pass.val()},
                                        dataType : 'json',
                                        type : 'post',
                                        success : function(d)
                                        {
                                            if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            else Metronic.showMessage("Thông báo", "Đã reset mật khẩu cho các tài khoản thành công!", "OK");
                                        }
                                    });
                                }
                            },
                            danger: {
                                label: "Không",
                                className: "btn-danger",
                                callback: function() {
                                }
                              }
                            }
                        }
                    );
                }
            }
            else{
                bootbox.dialog({
                    title: "Reset mật khẩu",
                    message: '<input id="password_to_change" type="password" value="" placeholder="Mật khẩu" class="form-control">',
                    buttons: {
                        success: {
                            label: "Đặt lại",
                            className: "btn-success",
                            callback: function () {
                                var pass = $('#password_to_change');
                                if (pass.val().length < 6){
                                    bootbox.alert("Mật khẩu phải có tối thiểu 6 ký tự."); 
                                    return false;
                                }
                                $.ajax({
                                    url : "/admin/user/resertpass.do",
                                    data : {id: [o.id], password : pass.val()},
                                    dataType : 'json',
                                    type : 'post',
                                    success : function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        else Metronic.showMessage("Thông báo", "Đã reset mật khẩu cho các tài khoản thành công!", "OK");
                                    }
                                });
                            }
                        },
                        danger: {
                            label: "Không",
                            className: "btn-danger",
                            callback: function() {
                            }
                          }
                        }
                    }
                );
            }
            return false;
        },
        setLockedLogin: function(o)
        {
            if (o === false){
                if (User.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các tài khoản bạn muốn khóa."); 
                else{
                    bootbox.dialog({
                        title: "Khóa tài khoản.",
                        message: "Bạn có chắc chắn muốn khóa các tài khoản đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url : "/admin/user/locked.do",
                                        data : {id: User.grid.getSelectedRows()},
                                        dataType : 'json',
                                        type : 'post',
                                        success: function(d)
                                        {
                                            if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            User.grid.getDataTable().ajax.reload();
                                        }
                                    });
                                }
                            },
                            danger: {
                                label: "Không",
                                className: "btn-danger",
                                callback: function() {
                                }
                            }
                        }
                    });
                }
            }
            else{
                bootbox.dialog({
                    title: "Khóa tài khoản.",
                    message: "Bạn có chắc chắn muốn khóa các tài khoản:" + o.full_name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/user/locked.do",
                                    data : {id: [o.id]},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        User.grid.getDataTable().ajax.reload();
                                    }
                                });
                            }
                        },
                        danger: {
                            label: "Không",
                            className: "btn-danger",
                            callback: function() {
                            }
                        }
                    }
                });
            }
            return false;
        },
        setUnlockedLogin: function(o)
        {
            if (o === false){
                if (User.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các tài khoản bạn muốn khóa."); 
                else{
                    bootbox.dialog({
                        title: "Mở khóa tài khoản.",
                        message: "Bạn có chắc chắn muốn mở khóa các tài khoản đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url : "/admin/user/unlocked.do",
                                        data : {id: User.grid.getSelectedRows()},
                                        dataType : 'json',
                                        type : 'post',
                                        success: function(d)
                                        {
                                            if (!d.success) Metronic.showMessage('Thông báo', d.msg, 'OK');
                                            User.grid.getDataTable().ajax.reload();
                                        }
                                    });
                                }
                            },
                            danger: {
                                label: "Không",
                                className: "btn-danger",
                                callback: function() {
                                }
                            }
                        }
                    });
                }
            }
            else{
                bootbox.dialog({
                    title: "Mở khóa tài khoản.",
                    message: "Bạn có chắc chắn muốn mở khóa tài khoản: " + o.full_name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/user/unlocked.do",
                                    data : {id: [o.id]},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', d.msg, 'OK');
                                        User.grid.getDataTable().ajax.reload();
                                    }
                                });
                            }
                        },
                        danger: {
                            label: "Không",
                            className: "btn-danger",
                            callback: function() {
                            }
                        }
                    }
                });
            }
            return false;
        },
        setDelete: function(o)
        {
            if (o === false){
                if (User.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các tài khoản bạn muốn xóa."); 
                else{
                    bootbox.dialog({
                        title: "Xóa tài khoản.",
                        message: "Bạn có chắc chắn muốn xóa các tài khoản đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url : "/admin/user/delete.do",
                                        data : {id: User.grid.getSelectedRows()},
                                        dataType : 'json',
                                        type : 'post',
                                        success: function(d)
                                        {
                                            if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            User.grid.getDataTable().ajax.reload();
                                        }
                                    });
                                }
                            },
                            danger: {
                                label: "Không",
                                className: "btn-danger",
                                callback: function() {
                                }
                            }
                        }
                    });
                }
            }
            else{
                bootbox.dialog({
                    title: "Xóa tài khoản.",
                    message: "Bạn có chắc chắn muốn xóa tài khoản: " + o.full_name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/user/delete.do",
                                    data : {id : [o.id]},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        User.grid.getDataTable().ajax.reload();
                                    }
                                });
                            }
                        },
                        danger: {
                            label: "Không",
                            className: "btn-danger",
                            callback: function() {
                            }
                        }
                    }
                });
            }
            return false;
        }
    };
}();