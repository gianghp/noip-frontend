var Depart = function () {

    var handleRecords = function () {

        var grid = new Datatable();
        var parent_id = Metronic.getURLParameter("parent_id");
        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 9999999999,
                ajax: {
                    url: "/admin/depart/get.do?parent_id=" + parent_id
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
            grid.setAjaxParam("parent_id", parent_id);
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        Depart.grid = grid;
    };

    return {
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            handleRecords();
            
            $('#btn_add_depart').click(function(){
                var parent_id = Metronic.getURLParameter("parent_id");
                $.ajax({
                    url : "/admin/depart/getParentOption.do",
                    dataType : 'html',
                    success : function(d){
                        $('#div_list_depart').addClass('hidden');
                        $('#div_edit_depart').addClass('hidden');
                        $('#div_add_depart').removeClass('hidden');
                        $('#div_add_depart #parent_id').html(d);
                        $('#div_add_depart #parent_id').val(parent_id);
                        $('#div_add_depart #parent_id').change();
                    }
                });
                
            });
            
            $('#div_add_depart #btn-close').click(function(){
                $('#div_list_depart').removeClass('hidden');
                $('#div_add_depart').addClass('hidden');
                $('#div_edit_depart').addClass('hidden');
            });
            
            $('#div_edit_depart #btn-close').click(function(){
                $('#div_list_depart').removeClass('hidden');
                $('#div_add_depart').addClass('hidden');
                $('#div_edit_depart').addClass('hidden');
            });
            
            $('#form-add-depart').submit(function(){
                $.ajax({
                    url : "/admin/depart/add.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#form-edit-depart').submit(function(){
                $.ajax({
                    url : "/admin/depart/update.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        },
        edit : function(o)
        {
            $.ajax({
                url : "/admin/depart/getParentOption.do",
                data : {id : o.id},
                dataType : 'html',
                success : function(d){
                    $('#div_list_depart').addClass('hidden');
                    $('#div_edit_depart').removeClass('hidden');
                    $('#div_edit_depart #id').val(o.id);
                    $('#div_edit_depart #name').val(o.name);
                    $('#div_edit_depart #description').val(o.description);
                    
                    $('#div_edit_depart #parent_id').html(d);
                    $('#div_edit_depart #parent_id').val(o.parent_id);
                    $('#div_edit_depart #parent_id').change();
                    
                    $('#div_edit_depart #bao_cao_ngay').prop('checked', o.bao_cao_ngay == 1 ? true : false);
                    Metronic.updateUniform($('#div_edit_depart #bao_cao_ngay'));
                    
                    $('#div_edit_depart #bao_cao_tuan').prop('checked', o.bao_cao_tuan == 1 ? true : false);
                    Metronic.updateUniform($('#div_edit_depart #bao_cao_tuan'));
                }
            });
        },
        remove : function(o)
        {
            bootbox.dialog({
                    title: "Xóa đơn vị",
                    message: "Bạn có chắc chắn muốn xóa đơn vị: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/depart/delete.do",
                                    data : {id : o.id},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Depart.grid.getDataTable().ajax.reload();
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
            if (Depart.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các đơn vị bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Xóa Đơn vị",
                    message: "Bạn có chắc chắn muốn xóa các đơn vị đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/depart/deleteA.do",
                                    data : {id: Depart.grid.getSelectedRows()},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Depart.grid.getDataTable().ajax.reload();
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
                url : "/admin/depart/updateNo.do",
                data : aNo,
                type : 'post',
                dataType : 'json',
                success : function(d)
                {
                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                    else Metronic.showMessage('Thông báo', 'Bạn lưu lại số thứ tự thành công.', 'OK');
                    Depart.grid.getDataTable().ajax.reload();
                }
            });
        }
    };
}();