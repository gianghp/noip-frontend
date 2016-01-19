var web_page = function () {

    var handleRecords = function () {

        var grid = new Datatable();
        var parent_id = Metronic.getURLParameter("parent_id");
        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 9999999999,
                ajax: {
                    url: "/admin/web_page/get.do?parent_id=" + parent_id
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7]
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
        
        web_page.grid = grid;
    };

    var fnAdd = function(){
        $.ajax({
            url : "/admin/web_page/getEditForm.do",
            success : function(html){
                html = $(html);
                Metronic.updateUniform(html.find('#active'));
                var pid = Metronic.getURLParameter("parent_id");
                if(pid){
                    html.find('#parent_id').val(pid);
                    html.find('#parent_id').change();
                }
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
                                var name = html.find('#name').val();
                                if (name.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tên trang.", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/web_page/save.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            web_page.grid.getDataTable().ajax.reload();
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

                html.find('.select2me').select2({
                    placeholder: "Select a State",
                    allowClear: true
                });
            }
        });
    };
    
    var fnEdit = function(o){
        $.ajax({
            url : "/admin/web_page/getEditForm.do?id=" + o.id,
            success : function(html){
                html = $(html);
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
                                var name = html.find('#name').val();
                                if (name.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tên trang.", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/web_page/save.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            web_page.grid.getDataTable().ajax.reload();
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

                html.find('.select2me').select2({
                    placeholder: "Select a State",
                    allowClear: true
                });
            }
        });
            
        return false;
    };
    
    var fnSaveNo = function()
    {
        var aNo = $('#table_list .txtNo').serializeArray();
        $.ajax({
            url : "/admin/web_page/updateNo.do",
            data : aNo,
            type : 'post',
            dataType : 'json',
            success : function(d)
            {
                if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                else Metronic.showMessage('Thông báo', 'Bạn lưu lại số thứ tự thành công.', 'OK');
                web_page.grid.getDataTable().ajax.reload();
            }
        });
    };
    
    var fnDelete = function(o){
        if (o === false){
            if (web_page.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các mục bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Xóa Đơn vị",
                    message: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/web_page/deleteA.do",
                                    data : {id: web_page.grid.getSelectedRows()},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        web_page.grid.getDataTable().ajax.reload();
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
                title: "Xóa đơn vị",
                message: "Bạn có chắc chắn muốn xóa mục: " + o.name,
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            $.ajax({
                                url : "/admin/web_page/delete.do",
                                data : {id : o.id},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    web_page.grid.getDataTable().ajax.reload();
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
    };
        
    return {
        init: function () {
            handleRecords();
        },
        edit : fnEdit,
        add : fnAdd,
        delete : fnDelete,
        saveNo : fnSaveNo
    };
}();