var ListManager = function () {

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
                    url: "/admin/list/get.do?type_id=" + Metronic.getURLParameter('type_id')
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6]
                }]
            }
        });
        
        grid.reloadData = function(){
            grid.setAjaxParam("type_id", Metronic.getURLParameter('type_id'));
            grid.getDataTable().ajax.reload();
        };
        
        $('#frmGridSearch').submit(function(){
            var pattern = $(this).find("input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        ListManager.grid = grid;
    };

    var quick_add_quan_huyen = function(fn){
        $.ajax({
            url : "/admin/list/getFormQuickAddQuanHuyen.do",
            success : function(html){
                html = $(html);
               
                html.find('.select2me').select2({
                    placeholder: "Select a State",
                    allowClear: true
                });

                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Thêm Quận/Huyện",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/list/saveQuickAddQuanHuyen.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            fn(d.data);
                                        }
                                        else Metronic.showMessage("Thông báo", d.msg, "OK");
                                    },
                                    error : function(){
                                        html.parents('.modal-content').unmask();
                                        Metronic.showMessage("Thông báo", "Lỗi cập nhật lên hệ thống Server", "OK");
                                    }
                                });
                                return false;
                            }
                        },
                        danger: {
                            label: "Bỏ qua",
                            className: "btn-danger",
                            callback: function() {
                                $('.dvShowTitle').remove();
                            }
                        }
                    }
                });

                html.parents('.modal-content').find("form").submit(function(){
                    html.parents('.modal-content').find(".btn-success").click();
                    return false;
                });
            }
        });
    };
    
    var quick_add = function(stype, fn){
        $.ajax({
            url : "/admin/list/getFormQuickAdd.do?stype=" + stype,
            success : function(html){
                html = $(html);
               
                html.find('.select2me').select2({
                    placeholder: "Select a State",
                    allowClear: true
                });

                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Thêm",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/list/saveQuickAdd.do?stype=" + stype,
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            fn(d.data);
                                        }
                                        else Metronic.showMessage("Thông báo", d.msg, "OK");
                                    },
                                    error : function(){
                                        html.parents('.modal-content').unmask();
                                        Metronic.showMessage("Thông báo", "Lỗi cập nhật lên hệ thống Server", "OK");
                                    }
                                });
                                return false;
                            }
                        },
                        danger: {
                            label: "Bỏ qua",
                            className: "btn-danger",
                            callback: function() {
                                $('.dvShowTitle').remove();
                            }
                        }
                    }
                });

                html.parents('.modal-content').find("form").submit(function(){
                    html.parents('.modal-content').find(".btn-success").click();
                    return false;
                });
            }
        });
    };
    
    return {
        quick_add_quan_huyen : quick_add_quan_huyen,
        quick_add : quick_add,
        init: function () {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });
            
            handleRecords();
            
            $('#btn_add_list').click(function(){
                $('#div_list_list').addClass('hidden');
                $('#div_edit_list').addClass('hidden');
                $('#div_add_list').removeClass('hidden');
            });
            
            $('#div_add_list #btn-close').click(function(){
                $('#div_list_list').removeClass('hidden');
                $('#div_add_list').addClass('hidden');
                $('#div_edit_list').addClass('hidden');
            });
            
            $('#div_edit_list #btn-close').click(function(){
                $('#div_list_list').removeClass('hidden');
                $('#div_add_list').addClass('hidden');
                $('#div_edit_list').addClass('hidden');
            });
            
            $('#form-add-list').submit(function(){
                $.ajax({
                    url : "/admin/list/add.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $('#form-edit-list').submit(function(){
                $.ajax({
                    url : "/admin/list/update.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
        },
        edit : function(o)
        {
            $('#div_list_list').addClass('hidden');
            $('#div_edit_list').removeClass('hidden');
            
            $('#div_edit_list #parent_code').val(o.parent_code);
            $('#div_edit_list #parent_code').change();
            
            $('#div_edit_list #parent2_code').val(o.parent2_code);
            $('#div_edit_list #parent2_code').change();
            
            $('#div_edit_list #stype').val(o.stype);
            $('#div_edit_list #id').val(o.id);
            $('#div_edit_list #code').val(o.code);
            $('#div_edit_list #name').val(o.name);
            $('#div_edit_list #description').val(o.description);
            $('#div_edit_list #active').prop('checked', o.active == 1);
            if (o.active == 1) $('#div_edit_list #active').parent().addClass('checked');
            else $('#div_edit_list #active').parent().removeClass('checked');
        },
        remove : function(o)
        {
            bootbox.dialog({
                    title: "Xóa danh mục",
                    message: "Bạn có chắc chắn muốn xóa: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/list/delete.do",
                                    data : {id : o.id},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        ListManager.grid.reloadData();
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
            if (ListManager.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các mục bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Xóa danh mục",
                    message: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/list/deleteA.do",
                                    data : {id: ListManager.grid.getSelectedRows()},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        ListManager.grid.reloadData();
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
                url : "/admin/list/updateNo.do",
                data : aNo,
                dataType : 'json',
                type : 'post',
                success : function(d)
                {
                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                    else Metronic.showMessage('Thông báo', 'Bạn lưu lại số thứ tự thành công.', 'OK');
                    ListManager.grid.reloadData();
                }
            });
        }
    };
}();