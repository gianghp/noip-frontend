var Group = function () {

    var handleRecords = function () {

        var grid = new Datatable();
        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 9999999999,
                ajax: {
                    url: "/admin/group/get.do"
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4]
                }]
            }
        });

        $('#frmGridSearch').submit(function(){
            var pattern = $(this).find("input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        Group.grid = grid;
    };

    return {
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            handleRecords();
            
            $('#btn_add_group').click(function(){
                $('#div_list_group').addClass('hidden');
                $('#div_edit_group').addClass('hidden');
                $('#div_add_group').removeClass('hidden');
            });
            
            $('#div_add_group #btn-close').click(function(){
                $('#div_list_group').removeClass('hidden');
                $('#div_add_group').addClass('hidden');
                $('#div_edit_group').addClass('hidden');
            });
            
            $('#div_edit_group #btn-close').click(function(){
                $('#div_list_group').removeClass('hidden');
                $('#div_add_group').addClass('hidden');
                $('#div_edit_group').addClass('hidden');
            });
            
            $('#form-add-group').submit(function(){
                $.ajax({
                    url : "/admin/group/add.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#form-edit-group').submit(function(){
                $.ajax({
                    url : "/admin/group/update.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        },
        edit : function(o)
        {
            $('#div_list_group').addClass('hidden');
            $('#div_edit_group').removeClass('hidden');
            $('#div_edit_group #id').val(o.id);
            $('#div_edit_group #name').val(o.name);
            $('#div_edit_group #description').val(o.description);
        },
        remove : function(o)
        {
            bootbox.dialog({
                    title: "Xóa nhóm người dùng",
                    message: "Bạn có chắc chắn muốn xóa nhóm người dùng: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/group/delete.do",
                                    data : {id : o.id},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Group.grid.getDataTable().ajax.reload();
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
        },
        setDelete: function()
        {
            if (Group.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các nhóm người dùng bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Xóa nhóm người dùng",
                    message: "Bạn có chắc chắn muốn xóa các nhóm người dùng đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/group/deleteA.do",
                                    data : {id: Group.grid.getSelectedRows()},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Group.grid.getDataTable().ajax.reload();
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
        saveNo : function()
        {
            var aNo = $('#table_list .txtNo').serializeArray();
            $.ajax({
                url : "/admin/group/updateNo.do",
                data : aNo,
                type : 'post',
                dataType : 'json',
                success : function(d)
                {
                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                    else Metronic.showMessage('Thông báo', 'Bạn lưu lại số thứ tự thành công.', 'OK');
                    Group.grid.getDataTable().ajax.reload();
                }
            });
        }
    };
}();