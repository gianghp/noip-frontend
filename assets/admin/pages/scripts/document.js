var Document = function () {

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
                stateSave: true,
                ajax: {
                    url: "/admin/document/get.do?pattern=" + $('#frmGridSearch').find("input").val()
                },
                columnDefs: [
                    {
                        orderable: false,
                        targets: [0, 1, 2, 3, 4, 5]
                    }]
            }
        });

        $('#frmGridSearch').submit(function () {
            var pattern = $(this).find("input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.setAjaxParam("loai_id", $('#div_list_document #loai_id').val());
            grid.setAjaxParam("co_quan_ban_hanh", $('#div_list_document #co_quan_ban_hanh').val());
            grid.setAjaxParam("linh_vuc_id", $('#div_list_document #linh_vuc_id').val());
            grid.getDataTable().ajax.reload();
            return false;
        });

        $('#div_list_document #loai_id, #div_list_document #co_quan_ban_hanh, #div_list_document #linh_vuc_id').change(function(){
            $('#frmGridSearch').submit();
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();

        var check = $.readCookie("menu_click");
        $.deleteCookie("menu_click");
        if (check == 1) grid.getDataTable().ajax.reload();
        Document.grid = grid;
    };
    
    return {
        init: function () {
            handleRecords();
        },
        delete: function (o)
        {
            if (o === false) {
                if (Document.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các văn bản bạn muốn xóa.");
                else {
                    bootbox.dialog({
                        title: "Xóa văn bản",
                        message: "Bạn có chắc chắn muốn xóa các văn bản đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url: "/admin/document/delete.do",
                                        data: {id: Document.grid.getSelectedRows()},
                                        dataType: 'json',
                                        type: 'post',
                                        success: function (d)
                                        {
                                            if (!d.success)
                                                Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            Document.grid.getDataTable().ajax.reload();
                                        }
                                    });
                                }
                            },
                            danger: {
                                label: "Không",
                                className: "btn-danger",
                                callback: function () {
                                }
                            }
                        }
                    });
                }
            }
            else {
                bootbox.dialog({
                    title: "Xóa văn bản",
                    message: "Bạn có chắc chắn muốn xóa văn bản: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url: "/admin/document/delete.do",
                                    data: {id: [o.id]},
                                    dataType: 'json',
                                    type: 'post',
                                    success: function (d)
                                    {
                                        if (!d.success)
                                            Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Document.grid.getDataTable().ajax.reload();
                                    }
                                });
                            }
                        },
                        danger: {
                            label: "Không",
                            className: "btn-danger",
                            callback: function () {
                            }
                        }
                    }
                });
            }
            return false;
        }
    };
}();