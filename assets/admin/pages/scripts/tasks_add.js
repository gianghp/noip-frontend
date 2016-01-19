var TasksAdd = function () {
    var quick_add_item = function(rowHtml){
        rowHtml = $(rowHtml);
        $.ajax({
            url : "/admin/tasks_add/getFormQuickAddItem.do",
            success : function(html){
                html = $(html);
                html.find('.date-picker').datepicker({
                    rtl: Metronic.isRTL(),
                    autoclose: true
                });
                
                html.find('.select2me').select2({
                    placeholder: "Select a State",
                    allowClear: true
                });

                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Thêm đầu mục công việc",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var name = html.find("#name").val().trim();
                                if (name === "")
                                {
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tên công việc", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/tasks_add/saveQuickAddItem.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            $("select.tasklist_id").each(function(){
                                                tmp = $(this);
                                                var op = '<option id="' + d.data.id + '" value="' + d.data.id + '">' + d.data.name + '</option>';
                                                tmp.append(op);
                                                tmp.change();
                                            });
                                            
                                            var tmp = rowHtml.find("#tasklist_id");
                                            tmp.val( d.data.id);
                                            tmp.change();
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
    
    var initQuickAddCustomer = function(html){
        html = $(html);
        html.find('#btn_quick_add_customer').click(function(){
            Customer.quick_add(function(data){
                var t = html.find('#customer_id');
                var op = "<option selected='selected' id='" + data.id + "' value='" + data.id + "'>" + data.code + ' - ' + data.name + "</option>";
                t.append(op);
                t.change();
            });
        });
    };
    
    var initQuickAddProject = function(html){
        html = $(html);
        html.find('#btn_quick_add_project').click(function(){
            Project.quick_add(function(data){
                var t = html.find('#project_id');
                var op = "<option selected='selected' id='" + data.id + "' value='" + data.id + "'>" + data.code + ' - ' + data.name + "</option>";
                t.append(op);
                t.change();
            });
        });
    };
    
    var init_add_taskslist = function(){
        var html = $('#tpl_taskslist0');
        html.find('#tasklist_id').change(function(){
            html.find('#name').val($(this).find('option[value=' + this.value + ']').html());
            if (this.value == 0) html.find('#name').val('');
        });
        
        html.find('#btn_add_tasks_item').click(function(){
            quick_add_item(html);
        });
            
        $('#btn_add_taskslist').click(function(){
            var html = $('#tpl_taskslist').html();
            html = '<div id="tpl_taskslist0" class="row taskslist form-group">' + html + '</div>';
            html = $(html);
            html.find('#tasklist_id').val(0);
            html.find('#tasklist_id').select2({
                placeholder: "Select a State",
                allowClear: true
            });
            html.find('#tasklist_id').change(function(){
                html.find('#name').val($(this).find('option[value=' + this.value + ']').html());
                if (this.value == 0) html.find('#name').val('');
            });
            html.find('#btn_add_tasks_item').click(function(){
                quick_add_item(html);
            });
            html.find('#btn_remove_taskslist').click(function(){
                var me = $(this);
                bootbox.dialog({
                    title: "Thông báo",
                    message: "Bạn có chắc chắn muốn xóa đầu mục công việc này?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                me.parents(".taskslist").remove();
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
                
            });
            $('.taskslist:last').after(html);
        });
    };
    
    return {
        init: function () {
            initQuickAddCustomer($('#div_add_tasks'));
            initQuickAddProject($('#div_add_tasks'));
            init_add_taskslist();
            
            $('#div_add_tasks #btn_find_customer').click(function(){
                Customer.find(function(ids){
                    ids = ids + "";
                    ids = ids.split(",");
                    var tmp = $('#div_add_tasks #customer_id');
                    $(ids).each(function(){
                        tmp.find("#" + this).attr("selected", "selected");
                    });
                    tmp.change();
                });
            });
            
            $('#div_add_tasks #btn_find_project').click(function(){
                Project.find(function(ids){
                    ids = ids + "";
                    ids = ids.split(",");
                    var tmp = $('#div_add_tasks #project_id');
                    $(ids).each(function(){
                        tmp.find("#" + this).attr("selected", "selected");
                    });
                    tmp.change();
                });
            });
            
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
                }
            );
                
            $('#thoi_gian input').val(moment().format('DD/MM/YYYY H:m') + ' - ' + moment().subtract('days', -7).format('DD/MM/YYYY H:m'));
            
            $('#form-add-tasks').submit(function(){
                $.ajax({
                    url : "/admin/tasks_add/save.do",
                    data : $(this).serializeArray(),
                    dataType : 'script',
                    type : 'post'
                });
                return false;
            });
            
            $("#form-add-tasks #files").select2({
                tags: []
            });
            
            $('#form-add-tasks #btn_files').click(function(){
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
        },
        edit : function(o)
        {
            $('#div_add_tasks').find('input, textarea, select').each(function(){
                if (this.hasAttribute('data_field'))
                {
                    var me = $(this);
                    if (me.hasClass('date_picker'))
                    {
                        me.parents('.date-picker').datepicker('update', o[me.attr('data_field')]);
                    }
                    else
                    {
                        me.val(o[me.attr('data_field')]);
                        me.change();
                    }
                }
            });
            $('#thoi_gian input').val(o["tu_ngay2"] + ' - ' + o["den_ngay2"]);
            
            //customer
            o.customer_id = o.customer_id ? o.customer_id : "";
            $('#form-add-tasks #customer_id option').removeAttr('selected');
            $('#form-add-tasks #customer_id').change();
            if (o.customer_id.length > 0){
                var t = o.customer_id.split(",");
                $(t).each(function(){
                    $('#form-add-tasks #customer_id #' + this).attr('selected', 'selected');
                });
                $('#form-add-tasks #customer_id').change();
            }
            //---
            
            //project_id
            o.project_id = o.project_id ? o.project_id : "";
            $('#form-add-tasks #project_id option').removeAttr('selected');
            $('#form-add-tasks #project_id').change();
            if (o.project_id.length > 0){
                var t = o.project_id.split(",");
                $(t).each(function(){
                    $('#form-add-tasks #project_id #' + this).attr('selected', 'selected');
                });
                $('#form-add-tasks #project_id').change();
            }
            //---
            
            //share1
            o.share1 = o.share1 ? o.share1 : "";
            $('#form-add-tasks #share1 option').removeAttr('selected');
            $('#form-add-tasks #share1').change();
            if (o.share1.length > 0){
                var t = o.share1.split(",");
                $(t).each(function(){
                    $('#form-add-tasks #share1 #' + this).attr('selected', 'selected');
                });
                $('#form-add-tasks #share1').change();
            }
            //---
            
            //share2
            o.share2 = o.share2 ? o.share2 : "";
            $('#form-add-tasks #share2 option').removeAttr('selected');
            $('#form-add-tasks #share2').change();
            if (o.share2.length > 0){
                var t = o.share2.split(",");
                $(t).each(function(){
                    $('#form-add-tasks #share2 #' + this).attr('selected', 'selected');
                });
                $('#form-add-tasks #share2').change();
            }
            //---
            
            //tasklist_id
            o.tasklist_id = o.tasklist_id ? o.tasklist_id : "";
            $('#form-add-tasks #tasklist_id option').removeAttr('selected');
            $('#form-add-tasks #tasklist_id').change();
            if (o.tasklist_id.length > 0){
                var t = o.tasklist_id.split(",");
                $(t).each(function(){
                    $('#form-add-tasks #tasklist_id #' + this).attr('selected', 'selected');
                });
                $('#form-add-tasks #tasklist_id').change();
            }
            //---
            
            $(o.taskslistitem).each(function(){
                if ($('.taskslist').length < o.taskslistitem.length + 1)
                    $('#btn_add_taskslist').click();
            });
            
            var i = 0;
            $('.taskslist').each(function(){
                if (i > 0){
                    var me = $(this);
                    me.find("#id").val(o.taskslistitem[i-1]["id"]);
                    me.find("#tasklist_id").val(o.taskslistitem[i-1]["tasklist_id"]);
                    me.find("#tasklist_id").change();
                    me.find("#name").val(o.taskslistitem[i-1]["name"]);
                }
                ++i;
            });
            
            console.info(o.taskslistitem);
        }
    };
}();