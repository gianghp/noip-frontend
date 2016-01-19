var Thongbao = function () {
    var initGrid = function () {
        $('#thoi_gian').daterangepicker({
                opens: (Metronic.isRTL() ? 'left' : 'right'),
                format: 'DD/MM/YYYY',
                separator: ' to ',
                startDate: moment().subtract('years', 1),
                endDate: moment(),
                maxDate: moment(),
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    '1 ngày trước': [moment().subtract('days', 1), moment()],
                    '1 tuần trước': [moment().subtract('days', 7), moment()],
                    '1 tháng trước': [moment().subtract('months', 1), moment()]
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
                $('#thoi_gian input').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
            }
        );
        $('#thoi_gian input').val(moment().subtract('years', 1).format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY'));
        $('#txt_thoi_gian').change(function(){
            $('#frmGridSearch').submit();
        });    
        $(".ranges").click(function(){
            $('#frmGridSearch').submit();
        });
        
        var grid = new Datatable();
        grid.init({
            src: $("#tblGrid"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 10,
                stateSave: true,
                ajax: {
                    url: "/admin/thongbao/get.do?ngay=" + $('#thoi_gian input').val() + "&pattern=" + $('#frmGridSearch').find("input").val()
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
            grid.setAjaxParam("ngay", $('#thoi_gian input').val());
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
        Thongbao.grid = grid;
    };
    
    var fnDelete = function(o){
        if (o === false){
            if (Thongbao.grid.getSelectedRowsCount() === 0)
                bootbox.alert("Xin vui lòng chọn các mục bạn muốn xóa."); 
            else{
                bootbox.dialog({
                    title: "Thông báo",
                    message: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/admin/thongbao/delete.do",
                                    data : {id: Thongbao.grid.getSelectedRows(), thongbao_id : Metronic.getURLParameter("thongbao_id")},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Thongbao.grid.getDataTable().ajax.reload();
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
                title: "Thông báo",
                message: "Bạn có chắc chắn muốn xóa thông báo này?",
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            $.ajax({
                                url : "/admin/thongbao/delete.do",
                                data : {id : [o.id], thongbao_id  : o.id},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    Thongbao.grid.getDataTable().ajax.reload();
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
            url : "/admin/thongbao/getEditForm.do",
            data : {document_id : document_id},
            success : function(html){
                html = $(html);

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
                    title: "Thêm thông báo",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var subject = html.find('#subject').val();
                                if (subject.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tiêu đề thông báo.", "OK");
                                    return false;
                                }
                                
                                var content = html.find('#content').code().trim();
                                html.find('#content').val(content);
                                if (content.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập nội dung thông báo.", "OK");
                                    return false;
                                }

                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/thongbao/add.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            if ($('#panel_thongbao_info').length === 0){
                                                Metronic.showMessage("Thông báo", "Đã thêm thông báo thành công!", "OK");
                                            }
                                            else Thongbao.grid.getDataTable().ajax.reload();
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
                html.find('#content').summernote({height: 200});
                html.parents(".modal-dialog").addClass("modal-lg");
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
            url : "/admin/thongbao/getEditForm.do?id=" + o.id,
            success : function(html){
                html = $(html);

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
                    title: "Sửa thông báo",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var subject = html.find('#subject').val();
                                if (subject.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tiêu đề thông báo.", "OK");
                                    return false;
                                }
                                
                                var content = html.find('#content').code().trim();
                                html.find('#content').val(content);
                                if (content.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập nội dung thông báo.", "OK");
                                    return false;
                                }

                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/thongbao/save.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            Thongbao.grid.getDataTable().ajax.reload();
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
                html.find('#content').summernote({height: 200});
                html.parents(".modal-dialog").addClass("modal-lg");
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