var Position = function () {

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                ajax: {
                    url: "/admin/position/get.do"
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5]
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
        
        Position.grid = grid;
    };

    return {
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            handleRecords();
            
            $('#btn_add_position').click(function(){
                $('#div_list_position').addClass('hidden');
                $('#div_edit_position').addClass('hidden');
                $('#div_add_position').removeClass('hidden');
            });
            
            $('#div_add_position #btn-close').click(function(){
                $('#div_list_position').removeClass('hidden');
                $('#div_add_position').addClass('hidden');
                $('#div_edit_position').addClass('hidden');
            });
            
            $('#div_edit_position #btn-close').click(function(){
                $('#div_list_position').removeClass('hidden');
                $('#div_add_position').addClass('hidden');
                $('#div_edit_position').addClass('hidden');
            });
            
            $('#form-add-position').submit(function(){
                $.ajax({
                    url : "/admin/position/add.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#form-edit-position').submit(function(){
                $.ajax({
                    url : "/admin/position/update.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        },
        edit : function(o)
        {
            $('#div_list_position').addClass('hidden');
            $('#div_edit_position').removeClass('hidden');
            
            $('#div_edit_position #id').val(o.id);
            $('#div_edit_position #name').val(o.name);
            $('#div_edit_position #description').val(o.description);
        },
        remove : function(o)
        {
            bootbox.dialog({
                    title: "Xóa chức danh",
                    message: "Bạn có chắc chắn muốn xóa chức danh: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/position/delete.do",
                                    data : {id : o.id},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Position.grid.getDataTable().ajax.reload();
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
            if (Position.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các chức danh bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Xóa chức danh",
                    message: "Bạn có chắc chắn muốn xóa các chức danh đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/position/deleteA.do",
                                    data : {id: Position.grid.getSelectedRows()},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Position.grid.getDataTable().ajax.reload();
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
                url : "/admin/position/updateNo.do",
                data : aNo,
                dataType : 'json',
                type : 'post',
                success : function(d)
                {
                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                    else Metronic.showMessage('Thông báo', 'Bạn lưu lại số thứ tự thành công.', 'OK');
                    Position.grid.getDataTable().ajax.reload();
                }
            });
        }
    };
}();