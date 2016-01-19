var GroupLeader = function () {

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#table_list"),
            onSuccess: function (grid) {
            },
            onError: function (grid) {
            },
            loadingMessage: 'Loading...',
            dataTable: {
                ajax: {
                    url: "/admin/group_user/get.do?group_id=" + Metronic.getURLParameter("group_id")
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3]
                }]
            }
        });

        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var pattern = $(".table-group-action-input", grid.getTableWrapper());
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
        });
        
        $('#frmSearchUser').submit(function(){
            var pattern = $(".table-group-action-input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        GroupLeader.grid = grid;
    };

    return {
        init: function () {
            handleRecords();
            
            $('#btn_add_user').click(function(){
                $('#div_list_user').addClass('hidden');
                $('#div_add_user').removeClass('hidden');
                $('#div_edit_user').addClass('hidden');
                $('#div_add_user #user_id').val(0);
                $('#div_add_user #user_id').change();
                $('#div_edit_user #role_id').val(0);
                $('#div_edit_user #role_id').change();
            });
            
            $('#div_add_user #btn-close').click(function(){
                $('#div_list_user').removeClass('hidden');
                $('#div_add_user').addClass('hidden');
                $('#div_edit_user').addClass('hidden');
            });
            
            $('#form-add-user').submit(function(){
                $.ajax({
                    url : "/admin/group_user/save.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#div_edit_user #btn-close').click(function(){
                $('#div_list_user').removeClass('hidden');
                $('#div_edit_user').addClass('hidden');
                $('#div_add_user').addClass('hidden');
            });
            
            $('#form-edit-user').submit(function(){
                $.ajax({
                    url : "/admin/group_user/save.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            var head = $($('.table-container .row')[0]);
            head.hide();
            
            $(".numericInput").inputmask('999.999.999.999', {
                numericInput: true,
                clearMaskOnLostFocus: true
            });
            
            $('#importFromExcel').click(function(){
                Metronic.showImportExcel(function(aFiles){
                    $.ajax({
                        url : "/admin/group_user/import.do",
                        data : {files : aFiles, group_id : Metronic.getURLParameter("group_id")},
                        dataType : 'json',
                        type : 'post',
                        success : function(r){
                            if (r.success){
                                Metronic.showMessage("Thông báo", "Đã thực hiện import thành công.", "OK");
                                $('#fileupload_').parents('.modal-content').find('.btn-danger').click();
                                GroupLeader.grid.getDataTable().ajax.reload();
                            }
                            else Metronic.showMessage("Thông báo", r.msg, "OK");
                        }
                    });
                    return false;
                });
                return false;
            });
        },
        edit : function(o)
        {
            $('#div_list_user').addClass('hidden');
            $('#div_add_user').addClass('hidden');
            $('#div_edit_user').removeClass('hidden');
            
            $('#div_edit_user #user_id').val(o.user_id);
            $('#div_edit_user #cbx_user_id').val(o.user_id);
            $('#div_edit_user #cbx_user_id').change();
            
            $('#div_edit_user #role_id').val(o.role_id);
            $('#div_edit_user #role_id').change();
        },
        delete: function(o)
        {
            if (o === false){
                if (GroupLeader.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các nhân viên bạn muốn xóa."); 
                else{
                    bootbox.dialog({
                        title: "Xóa nhân viên",
                        message: "Bạn có chắc chắn muốn xóa các nhân viên đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url : "/admin/group_user/delete.do",
                                        data : {id: GroupLeader.grid.getSelectedRows(), group_id : Metronic.getURLParameter("group_id")},
                                        dataType : 'json',
                                        type : 'post',
                                        success: function(d)
                                        {
                                            if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            GroupLeader.grid.getDataTable().ajax.reload();
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
                    title: "Xóa nhân viên",
                    message: "Bạn có chắc chắn muốn xóa nhân viên: " + o.full_name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/group_user/delete.do",
                                    data : {id : [o.user_id], group_id : o.group_id},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        GroupLeader.grid.getDataTable().ajax.reload();
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