var Nhacviec = function () {
    var initGrid = function () {
        var grid = new Datatable();
        grid.init({
            src: $("#tblGrid"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 10,
                ajax: {
                    url: "/admin/nhacviec/get.do?pattern=" + $('#frmGridSearch').find("input").val()
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
        
        
        Nhacviec.grid = grid;
    };
    
    var fnDelete = function(o){
        if (o === false){
            if (Nhacviec.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các mục bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Nhắc việc",
                    message: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/nhacviec/delete.do",
                                    data : {id: Nhacviec.grid.getSelectedRows(), nhacviec_id : Metronic.getURLParameter("nhacviec_id")},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Nhắc việc', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Nhacviec.grid.getDataTable().ajax.reload();
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
                title: "Nhắc việc",
                message: "Bạn có chắc chắn muốn xóa nhắc việc này?",
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            $.ajax({
                                url : "/admin/nhacviec/delete.do",
                                data : {id : [o.id], nhacviec_id  : o.id},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('Nhắc việc', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    Nhacviec.grid.getDataTable().ajax.reload();
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
            url : "/admin/nhacviec/getEditForm.do",
            data : {document_id : document_id},
            success : function(html){
                html = $(html);

                html.find('#thoi_gian').daterangepicker({
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
                        html.find('#thoi_gian input').val(start.format('DD/MM/YYYY H:m') + ' - ' + end.format('DD/MM/YYYY H:m'));
                    }
                );

                html.find('#thoi_gian input').val(moment().format('DD/MM/YYYY H:m') + ' - ' + moment().subtract('days', -7).format('DD/MM/YYYY H:m'));

                html.find('.date-picker').datepicker({
                    rtl: Metronic.isRTL(),
                    autoclose: true
                });
                html.find(".date-picker" ).datepicker("update", $.getDateNow());
                
                html.find("#files").select2({
                    tags: []
                });

                html.find('#btn_files').click(function(){
                    Metronic.showUpload("Tệp đính kèm", 2, function(a, b){
                        var s = "";
                        $(a).each(function(){
                            if (s === "") s = '<input type="hidden" name="form[files][]" value="' + this.url + ';' + this.name + '"/>' + this.name;
                            else s += ',' + '<input type="hidden" name="form[files][]" value="' + this.url + ';' + this.name + '"/>' + this.name;
                        });
                        if ($('#files').val() === "") 
                            $('#files').val(s);
                        else $('#files').val($('#files').val() + ',' + s);
                        $('#files').change();
                    });
                });

                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Thêm nhắc việc",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var subject = html.find('#subject').val();
                                if (subject.length === 0){
                                    Metronic.showMessage("Nhắc việc", "Bạn chưa nhập tiêu đề nhắc việc.", "OK");
                                    return false;
                                }
                                
                                var content = html.find('#content').code().trim();
                                html.find('#content').val(content);
                                if (content.length === 0){
                                    Metronic.showMessage("Nhắc việc", "Bạn chưa nhập nội dung nhắc việc.", "OK");
                                    return false;
                                }

                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/nhacviec/add.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            if ($('#panel_nhacviec_info').length === 0){
                                                Metronic.showMessage("Nhắc việc", "Đã thêm nhắc việc thành công!", "OK");
                                            }
                                            else Nhacviec.grid.getDataTable().ajax.reload();
                                        }
                                        else Metronic.showMessage("Nhắc việc", d.msg, "OK");
                                    },
                                    error : function(){
                                        html.parents('.modal-content').unmask();
                                        Metronic.showMessage("Nhắc việc", "Lỗi cập nhật lên hệ thống Server", "OK");
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
                html.find('#content').summernote({height: 200});
                //html.parents(".modal-dialog").addClass("modal-lg");
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
            url : "/admin/nhacviec/getEditForm.do?id=" + o.id,
            success : function(html){
                html = $(html);
                html.find('#thoi_gian').daterangepicker({
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
                        html.find('#thoi_gian input').val(start.format('DD/MM/YYYY H:m') + ' - ' + end.format('DD/MM/YYYY H:m'));
                    }
                );

                //html.find('#thoi_gian input').val(moment().format('DD/MM/YYYY H:m') + ' - ' + moment().subtract('days', -7).format('DD/MM/YYYY H:m'));

                html.find('.date-picker').datepicker({
                    rtl: Metronic.isRTL(),
                    autoclose: true
                });
                html.find(".date-picker" ).datepicker("update", $.getDateNow());
                html.find("#files").select2({
                    tags: []
                });

                html.find('#btn_files').click(function(){
                    Metronic.showUpload("Tệp đính kèm", 2, function(a, b){
                        var s = "";
                        $(a).each(function(){
                            if (s === "") s = '<input type="hidden" name="form[files][]" value="' + this.url + ';' + this.name + '"/>' + this.name;
                            else s += ',' + '<input type="hidden" name="form[files][]" value="' + this.url + ';' + this.name + '"/>' + this.name;
                        });
                        if ($('#files').val() === "") 
                            $('#files').val(s);
                        else $('#files').val($('#files').val() + ',' + s);
                        $('#files').change();
                    });
                });
                
                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Sửa nhắc việc",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var subject = html.find('#subject').val();
                                if (subject.length === 0){
                                    Metronic.showMessage("Nhắc việc", "Bạn chưa nhập tiêu đề nhắc việc.", "OK");
                                    return false;
                                }
                                
                                var content = html.find('#content').code().trim();
                                html.find('#content').val(content);
                                if (content.length === 0){
                                    Metronic.showMessage("Nhắc việc", "Bạn chưa nhập nội dung nhắc việc.", "OK");
                                    return false;
                                }

                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/nhacviec/save.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            Nhacviec.grid.getDataTable().ajax.reload();
                                        }
                                        else Metronic.showMessage("Nhắc việc", d.msg, "OK");
                                    },
                                    error : function(){
                                        html.parents('.modal-content').unmask();
                                        Metronic.showMessage("Nhắc việc", "Lỗi cập nhật lên hệ thống Server", "OK");
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
                html.find('#content').summernote({height: 200});
                //html.parents(".modal-dialog").addClass("modal-lg");
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