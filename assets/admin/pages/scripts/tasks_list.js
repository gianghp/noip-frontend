var TasksList = function () {

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                ajax: {
                    url: "/admin/tasks_list/get.do"
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
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        TasksList.grid = grid;
    };

    return {
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            handleRecords();
            
            $('#btn_add_tasks_list').click(function(){
                $('#div_list_tasks_list').addClass('hidden');
                $('#div_edit_tasks_list').addClass('hidden');
                $('#div_add_tasks_list').removeClass('hidden');
                $('#div_add_tasks_list #bao_cao option').removeAttr('selected');
                $('#div_add_tasks_list #bao_cao').change();
            });
            
            $('#div_add_tasks_list #btn-close').click(function(){
                $('#div_list_tasks_list').removeClass('hidden');
                $('#div_add_tasks_list').addClass('hidden');
                $('#div_edit_tasks_list').addClass('hidden');
            });
            
            $('#div_edit_tasks_list #btn-close').click(function(){
                $('#div_list_tasks_list').removeClass('hidden');
                $('#div_add_tasks_list').addClass('hidden');
                $('#div_edit_tasks_list').addClass('hidden');
            });
            
            $('#form-add-tasks_list').submit(function(){
                $.ajax({
                    url : "/admin/tasks_list/add.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#form-edit-tasks_list').submit(function(){
                $.ajax({
                    url : "/admin/tasks_list/update.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        },
        edit : function(o)
        {
            $('#div_list_tasks_list').addClass('hidden');
            $('#div_edit_tasks_list').removeClass('hidden');
            $('#div_edit_tasks_list #id').val(o.id);
            $('#div_edit_tasks_list #code').val(o.code);
            $('#div_edit_tasks_list #name').val(o.name);
            $('#div_edit_tasks_list #description').val(o.description);
            
            $('#div_edit_tasks_list #bao_cao option').removeAttr('selected');
            var tmp = o.bao_cao.split(',');
            $(tmp).each(function(){
                if (this.length > 0){
                $('#div_edit_tasks_list #bao_cao #' + this).attr('selected', 'selected');
                }
            });
            $('#div_edit_tasks_list #bao_cao').change();
        },
        remove : function(o)
        {
            bootbox.dialog({
                    title: "Xóa công việc",
                    message: "Bạn có chắc chắn muốn xóa công việc: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/tasks_list/delete.do",
                                    data : {id : o.id},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        TasksList.grid.getDataTable().ajax.reload();
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
            if (TasksList.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các công việc bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Xóa công việc",
                    message: "Bạn có chắc chắn muốn xóa các công việc đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/tasks_list/deleteA.do",
                                    data : {id: TasksList.grid.getSelectedRows()},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        TasksList.grid.getDataTable().ajax.reload();
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
                url : "/admin/tasks_list/updateNo.do",
                data : aNo,
                dataType : 'json',
                type : 'post',
                success : function(d)
                {
                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                    else Metronic.showMessage('Thông báo', 'Bạn lưu lại số thứ tự thành công.', 'OK');
                    TasksList.grid.getDataTable().ajax.reload();
                }
            });
        }
    };
}();