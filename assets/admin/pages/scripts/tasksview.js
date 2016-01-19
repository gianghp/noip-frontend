var Tasksview = function () {
    var fnBaoCao = function(iTasksItemId){
        var name = $('#tasks' + iTasksItemId).html();
        $.ajax({
            url : "/admin/tasksview/getEditItem.do",
            data : {iTasksItemId : iTasksItemId},
            success : function(html){
                html = $(html);
                
                html.find("#files").select2({
                    tags: []
                });
            
                html.find('.select2me').select2({
                    placeholder: "Select a State",
                    allowClear: true
                });
                
                html.find('.date-picker').datepicker({
                    rtl: Metronic.isRTL(),
                    autoclose: true
                });
                
                if (html.find("#ngay").val().length === 0)
                    html.find(".date-picker").datepicker("update", $.getDateNow());
            
                initQuickAddCustomer(html);
                initQuickAddProject(html);
                initQuickAddContact(html);
                
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
                
                html.find('#btn_maps').click(function(){
                    var input = $(this).parents(".input-group").find("#maps");
                    $.getCurrentPosition(input);
                });
                
                html.find('#btn_maps_view').click(function(){
                    var input = $(this).parents(".input-group").find("#maps");
                    if (input.val() == "") $.getCurrentPosition(input);
                    else window.open("https://www.google.com/maps/place//@" + input.val() + ",16z/data=!4m2!3m1!1s0x0:0x0");
                });
            
                var box = bootbox.dialog({
                    className : 'dialog-lg',
                    title: "Công việc: " + name,
                    message: html,
                    buttons: {
                        success: {
                            label: "Cập nhật",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var content = html.find("#content").val().trim();
                                if (content.length == 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập nội dung thực hiện.", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/tasksview/saveItem.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            window.location.reload(true);
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
                
                var t = html.find("#customer_id");
                var tmp = t.attr('data').split(",");
                $(tmp).each(function(){
                    if (this.length > 0)
                        html.find('#customer_id #' + this).attr('selected', 'selected');
                });
                html.find("#customer_id").change();
                
                var t = html.find("#project_id");
                var tmp = t.attr('data').split(",");
                $(tmp).each(function(){
                    if (this.length > 0)
                        html.find('#project_id #' + this).attr('selected', 'selected');
                });
                html.find("#project_id").change();
                
                var t = html.find("#contact_id");
                var tmp = t.attr('data').split(",");
                $(tmp).each(function(){
                    if (this.length > 0)
                        html.find('#contact_id #' + this).attr('selected', 'selected');
                });
                html.find("#contact_id").change();
                
                html.parents(".modal-dialog").addClass("modal-lg");
                html.parents('.modal-content').find("form").submit(function(){
                    html.parents('.modal-content').find(".btn-success").click();
                    return false;
                });
            }
        });
        return false;
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
    
    var initQuickAddContact = function(html){
        html = $(html);
        html.find('#btn_quick_add_contact').click(function(){
            Contact.quick_add2(function(data){
                var t = html.find('#contact_id');
                var op = "<option selected='selected' id='" + data.id + "' value='" + data.id + "'>" + data.code + ' - ' + data.name + "</option>";
                t.append(op);
                t.change();
            });
        });
    };
    
    var initCheckin = function(){
        $('#lblCheckin').click(function(){
            var xy = $(this).find('#point').html().trim();
            xy = xy.split(",");
            Metronic.showMap([
                {
                    x : xy[0],
                    y : xy[1],
                    title : $(this).find('#address').html(),
                    html : $(this).find('#address').html() + "<br>[Tọa độ: " + $(this).find('#point').html().trim() + "]"
                }
            ]);
            //window.open("https://www.google.com/maps/place//@" + $(this).find('#point').html().trim() + ",16z/data=!4m2!3m1!1s0x0:0x0");
        });
        
        var d = $('#lblCheckin').find('#point').html().trim();
            
        if (d.length > 0 && $('#lblCheckin').find('#point').attr('address').length == 0){
            var tasks_id = $('#lblCheckin').find('#point').attr('tasks_id');
            var point = d.split(',');
            var geocoder = new google.maps.Geocoder();
            var sLat = point[0];
            var sLong = point[1];
            var latlng = new google.maps.LatLng(sLat, sLong);
            geocoder.geocode({'latLng': latlng}, function(data,status){
                if(status === google.maps.GeocoderStatus.OK){
                    var address = data[0].formatted_address;
                    $.ajax({
                        url : "/admin/tasksview/checkin3.do",
                        data : {tasks_id: tasks_id, address : address},
                        dataType : 'json',
                        type : 'post',
                        success: function(data)
                        {
                            if (data.success){
                                $('#lblCheckin').html("<span id='point'>" + d + "</span><br><span id='address'>" + address + "</span><br>");
                            }
                        }
                    });
                }
            });
        }
                                
        $('#btnCheckin').click(function(){
            var tasks_id = $(this).attr('tasks_id');
            var box = bootbox.dialog({
                title: "Checkin",
                message: "Bạn có chắc chắn muốn checkin công việc này?",
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            box.modal('hide');
                            $('body').mask('Đang thực hiện check-in ...');
                            $.getCurrentPosition2(function(d){
                                $.ajax({
                                    url : "/admin/tasksview/checkin2.do",
                                    data : {tasks_id: tasks_id, checkin : d},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(data)
                                    {
                                        $('body').unmask();
                                        if (data.success){
                                            $('#lblCheckin').html("<span id='point'>" + d + "</span>");
                                        }
                                        else Metronic.showMessage("Thông báo", data.msg, "OK");
                                    },
                                    error : function(){
                                        $('body').unmask();
                                    }
                                });
                                        
                                var point = d.split(',');
                                var geocoder = new google.maps.Geocoder();
                                var sLat = point[0];
                                var sLong = point[1];
                                var latlng = new google.maps.LatLng(sLat, sLong);
                                geocoder.geocode({'latLng': latlng}, function(data,status){
                                    if(status === google.maps.GeocoderStatus.OK){
                                        var address = data[0].formatted_address; 
                                        $.ajax({
                                            url : "/admin/tasksview/checkin.do",
                                            data : {tasks_id: tasks_id, checkin : d, address : address},
                                            dataType : 'json',
                                            type : 'post',
                                            success: function(data)
                                            {
                                                $('body').unmask();
                                                if (data.success){
                                                    $('#lblCheckin').html("<span id='point'>" + d + "</span><br><span id='address'>" + address + "</span><br>");
                                                }
                                                else Metronic.showMessage("Thông báo", data.msg, "OK");
                                            },
                                            error : function(){
                                                $('body').unmask();
                                            }
                                        });
                                    }
                                    else {
                                        Metronic.showMessage("THông báo", "Lỗi không thể Checkin", "OK");
                                        $('body').unmask();
                                    }
                                });
                            });
                            return false;
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
    };
    
    return {
        init: function () {
            $(window).resize(function(){
                var win = $(this);
                var w = win.width();
                if (w < 1200){
                    $('#panel_tasks_comments').css('width','100%');
                    $('#panel_tasks_info').css('width','100%');
                }
                else{
                    $('#panel_tasks_comments').css('width','');
                    $('#panel_tasks_info').css('width','');
                }
            });
            $(window).resize();
            initCheckin();
        },
        fnBaoCao : fnBaoCao,
        setDelete: function(iTasksId, iTaskListId)
        {
            bootbox.dialog({
                title: "Thông báo",
                message: "Bạn có chắc chắn muốn xóa?",
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            $.ajax({
                                url : "/admin/tasksview/deleteItem.do",
                                data : {iTasksId : iTasksId, iTaskListId:iTaskListId},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    else window.location.reload(true);
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
            return false;
        }
    };
}();