var Tasks = function () {

    var initGrid = function () {
        var grid = new Datatable();
        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 10,
                ajax: {
                    url: "/admin/tasks/get.do"
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
            grid.setAjaxParam("user_id", $('#tools #user_id').val());
            grid.setAjaxParam("status_id", $('#tools #status_id').val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        $('#tools #user_id, #tools #status_id').change(function(){
            $('#frmGridSearch').submit();
        });
        
        $('#btn_export_tasks').click(function(){
            var ids = grid.getSelectedRows();
            window.location.href='/admin/tasks/export.do?user_id=' + $('#tools #user_id').val() + "&ids=" + ids + "&status_id=" + $('#tools #status_id').val() + "&pattern=" + $('#txtGridFind').val();
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        Tasks.grid = grid;
    };

    var initDateTime = function(){
        $('#thoi_gian').daterangepicker({
            opens: (Metronic.isRTL() ? 'left' : 'right'),
            format: 'DD/MM/YYYY H:m',
            separator: ' to ',
            startDate: moment(),
            endDate: moment().subtract('days', -7),
            minDate: moment(),
            //maxDate: '12/31/2014',
            timePicker: true,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Hôm nay': [moment(), moment()],
                'Ngày mai': [moment(), moment().subtract('days', -1)],
                'Ngày kia': [moment(), moment().subtract('days', -2)]
            },
            buttonClasses: ['btn'],
            applyClass: 'green',
            cancelClass: 'default',
            locale: {
                applyLabel: 'Đồng ý',
                cancelLabel: 'Bỏ qua',
                fromLabel: 'Từ ngày',
                toLabel: 'Đến ngày',
                customRangeLabel: 'Tùy chọn',
                daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: ['Thg1', 'Thg2', 'Thg3', 'Thg4', 'Thg5', 'Thg6', 'Thg7', 'Thg8', 'Thg9', 'Thg10', 'Thg11', 'Thg12'],
                firstDay: 1,
                days: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"],
                daysShort: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
                daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7", "CN"],
                months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
                monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
                today: "Hôm nay",
                clear: "Xóa",
                format: "dd/mm/yyyy"
            }
        },
        function (start, end) {
            $('#thoi_gian input').val(start.format('DD/MM/YYYY H:m') + ' - ' + end.format('DD/MM/YYYY H:m'));
        });

        $('#thoi_gian input').val(moment().format('DD/MM/YYYY H:m') + ' - ' + moment().subtract('days', -7).format('DD/MM/YYYY H:m'));
    };
    
    var initSlide = function(){
        $("#hoan_thanh_slider").slider({
            isRTL: Metronic.isRTL(),
            range: "max",
            min: 0,
            max: 100,
            value: 0,
            slide: function (event, ui) {
                $("#hoan_thanh_slider_amount").text(ui.value);
                $('#hoan_thanh').val(ui.value);
            }
        });

        $("#hoan_thanh_slider_amount").text($("#hoan_thanh_slider").slider("value"));
        $('#hoan_thanh').val($("#hoan_thanh_slider").slider("value"));
    };
    
    return {
        init: function () {
            initGrid();
            initDateTime();
            initSlide();
            
        },
        setDelete: function(o)
        {
            if (o === false){
                if (Tasks.grid.getSelectedRowsCount() === 0)
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
                                        url : "/admin/tasks/delete.do",
                                        data : {id: Tasks.grid.getSelectedRows()},
                                        dataType : 'json',
                                        type : 'post',
                                        success: function(d)
                                        {
                                            if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                            Tasks.grid.getDataTable().ajax.reload();
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
                    title: "Xóa công việc",
                    message: "Bạn có chắc chắn muốn xóa công việc: " + o.name,
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/tasks/delete.do",
                                    data : {id : [o.id]},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Tasks.grid.getDataTable().ajax.reload();
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