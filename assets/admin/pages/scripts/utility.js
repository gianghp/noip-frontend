var Utility = function () {

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                stateSave: true,
                ajax: {
                    url: "/admin/utility/get.do?pattern=" + $('#frmGridSearch').find("input").val()
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
            grid.getDataTable().ajax.reload();
            return false;
        });

        var head = $($('.table-container .row')[0]);
        head.hide();

        var check = $.readCookie("menu_click");
        $.deleteCookie("menu_click");
        if (check == 1) grid.getDataTable().ajax.reload();
        Utility.grid = grid;
    };
    
    return {
        init: function () {
            handleRecords();
        },
        delete: function (o)
        {
            if (o === false) {
                if (Utility.grid.getSelectedRowsCount() === 0)
                    bootbox.alert("Xin vui lòng chọn các mục bạn muốn xóa.");
                else {
                    bootbox.dialog({
                        title: "Thông báo",
                        message: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url: "/admin/utility/delete.do",
                                        data: {id: Utility.grid.getSelectedRows()},
                                        dataType: 'json',
                                        type: 'post',
                                        success: function (d)
                                        {
                                            if (!d.success)
                                                Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            Utility.grid.getDataTable().ajax.reload();
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
                    title: "Xóa mục",
                    message: "Bạn có chắc chắn muốn xóa mục: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url: "/admin/utility/delete.do",
                                    data: {id: [o.id]},
                                    dataType: 'json',
                                    type: 'post',
                                    success: function (d)
                                    {
                                        if (!d.success)
                                            Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Utility.grid.getDataTable().ajax.reload();
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