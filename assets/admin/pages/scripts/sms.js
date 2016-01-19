var Sms = function () {
    var initGrid = function () {
        var grid = new Datatable();
        grid.init({
            src: $("#tblGrid"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 10,
                stateSave: true,
                ajax: {
                    url: "/admin/sms/get.do?pattern=" + $('#frmGridSearch').find("input").val()
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3]
                }]
            }
        });
        
        $('#frmGridSearch').submit(function(){
            var pattern = $(this).find("input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.setAjaxParam("nguoi_dang", $('#nguoi_dang').val());
            grid.getDataTable().ajax.reload();
            return false;
        });
        $('#nguoi_dang').change(function(){
            $('#frmGridSearch').submit();
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        head = $($('.table-container .row')[1]);
        head.find('.col-md-4').remove();
        head.find('.col-md-8').removeClass('col-md-8');
        
        var check = $.readCookie("menu_click");
        $.deleteCookie("menu_click");
        if (check == 1) grid.getDataTable().ajax.reload();
        Sms.grid = grid;
    };
    
    var fnDelete = function(o){
        if (o === false){
            if (Sms.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các mục bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "SMS",
                    message: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/sms/delete.do",
                                    data : {id: Sms.grid.getSelectedRows(), sms_id : Metronic.getURLParameter("sms_id")},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('SMS', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Sms.grid.getDataTable().ajax.reload();
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
                title: "SMS",
                message: "Bạn có chắc chắn muốn xóa SMS này?",
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            $.ajax({
                                url : "/admin/sms/delete.do",
                                data : {id : [o.id], sms_id  : o.id},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('SMS', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    Sms.grid.getDataTable().ajax.reload();
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
    };
    
    var fnAdd = function(document_id){
        $.ajax({
            url : "/admin/sms/getEditForm.do",
            data : {document_id : document_id},
            success : function(html){
                html = $(html);
                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Thêm SMS",
                    message: html,
                    buttons: {
                        success: {
                            label: "Gửi",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var subject = html.find('#subject').val();
                                if (subject.length === 0){
                                    Metronic.showMessage("SMS", "Bạn chưa nội dung đề SMS.", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/sms/add.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            if ($('#panel_sms_info').length === 0){
                                                Metronic.showMessage("SMS", "Đã thêm SMS thành công!", "OK");
                                            }
                                            else Sms.grid.getDataTable().ajax.reload();
                                        }
                                        else Metronic.showMessage("SMS", d.msg, "OK");
                                    },
                                    error : function(){
                                        html.parents('.modal-content').unmask();
                                        Metronic.showMessage("SMS", "Lỗi cập nhật lên hệ thống Server", "OK");
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
            url : "/admin/sms/getEditForm.do?id=" + o.id,
            success : function(html){
                html = $(html);
                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Sửa SMS",
                    message: html,
                    buttons: {
                        success: {
                            label: "Gửi",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var subject = html.find('#subject').val();
                                if (subject.length === 0){
                                    Metronic.showMessage("SMS", "Bạn chưa nội dung đề SMS.", "OK");
                                    return false;
                                }
                                
                                var content = html.find('#content').code().trim();
                                html.find('#content').val(content);
                                if (content.length === 0){
                                    Metronic.showMessage("SMS", "Bạn chưa nhập nội dung SMS.", "OK");
                                    return false;
                                }

                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/sms/save.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            Sms.grid.getDataTable().ajax.reload();
                                        }
                                        else Metronic.showMessage("SMS", d.msg, "OK");
                                    },
                                    error : function(){
                                        html.parents('.modal-content').unmask();
                                        Metronic.showMessage("SMS", "Lỗi cập nhật lên hệ thống Server", "OK");
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
    
    return {
        init: function () {
            initGrid();
        },
        delete : fnDelete,
        edit : fnEdit,
        add : fnAdd
    };
}();