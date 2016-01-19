var Diemkinhdoanh = function () {
    var initGrid = function () {
        var grid = new Datatable();
        grid.init({
            src: $("#tblGrid"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 10,
                ajax: {
                    url: "/admin/diemkinhdoanh/get.do?pattern=" + $('#frmGridSearch').find("input").val()
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4]
                }]
            }
        });
        
        $('#frmGridSearch').submit(function(){
            var pattern = $(this).find("input");
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("phuong_xa", $("#cbxPhuongXa").val());
            grid.setAjaxParam("loai_hinh", $("#cbxLoaiHinh").val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
            return false;
        });
        
        $("#cbxPhuongXa, #cbxLoaiHinh").change(function(){
            $('#frmGridSearch').submit();
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        
        head = $($('.table-container .row')[1]);
        head.find('.col-md-4').remove();
        head.find('.col-md-8').removeClass('col-md-8');
            
        Diemkinhdoanh.grid = grid;
    };
    
    var fnDelete = function(o){
        if (o === false){
            if (Diemkinhdoanh.grid.getSelectedRowsCount() === 0)
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
                                    url : "/admin/diemkinhdoanh/delete.do",
                                    data : {id: Diemkinhdoanh.grid.getSelectedRows(), diemkinhdoanh_id : Metronic.getURLParameter("diemkinhdoanh_id")},
                                    dataType : 'json',
                                    type : 'post',
                                    success: function(d)
                                    {
                                        if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                        Diemkinhdoanh.grid.getDataTable().ajax.reload();
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
                                url : "/admin/diemkinhdoanh/delete.do",
                                data : {id : [o.id], diemkinhdoanh_id  : o.id},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    Diemkinhdoanh.grid.getDataTable().ajax.reload();
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
    
    var initMaps = function(html){
        html.find('#maps_input').find('#btn_maps').click(function(){
            var input = $(this).parents(".input-group").find("#maps");
            $.getCurrentPosition(input);
        });

         html.find('#maps_input').find('#btn_maps_view').click(function(){
            var input = $(this).parents(".input-group").find("#maps");
            if (input.val() == "") $.getCurrentPosition(input);
            else window.open("https://www.google.com/maps/place//@" + input.val() + ",16z/data=!4m2!3m1!1s0x0:0x0");
        });
    };
    
    var fnAdd = function(){
        $.ajax({
            url : "/admin/diemkinhdoanh/getEditForm.do",
            success : function(html){
                html = $(html);
                initMaps(html);
                
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
                    title: "Thêm",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var ten = html.find('#ten').val();
                                if (ten.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tên.", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/diemkinhdoanh/add.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            Diemkinhdoanh.grid.getDataTable().ajax.reload();
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
            url : "/admin/diemkinhdoanh/getEditForm.do?id=" + o.id,
            success : function(html){
                html = $(html);
                initMaps(html);
                
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
                    title: "Sửa",
                    message: html,
                    buttons: {
                        success: {
                            label: "Lưu",
                            className: "btn-success",
                            callback: function () {
                                $('.dvShowTitle').remove();
                                var ten = html.find('#ten').val();
                                if (ten.length === 0){
                                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tên.", "OK");
                                    return false;
                                }
                                
                                html.parents('.modal-content').mask("Đang thực hiện...");
                                $.ajax({
                                    url : "/admin/diemkinhdoanh/save.do",
                                    dataType : "json",
                                    data : html.serializeArray(),
                                    success : function(d){
                                        html.parents('.modal-content').unmask();
                                        if (d.success){
                                            box.modal('hide');
                                            Diemkinhdoanh.grid.getDataTable().ajax.reload();
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
            
            $('#btn_show_maps').click(function(){
                var a = Diemkinhdoanh.grid.getSelectedRows();
                if (a.length === 0)
                    Metronic.showMessage("Thông báo", "Bạn hãy chọn các đại điểm");
                else{
                    var p = [];
                    $(a).each(function(){
                        var tmp = $('.tdcheckin' + this);
                        if (tmp.find('a').length)
                            p.push(tmp.find('a'));
                    });
                    if (p.length === 0){
                        Metronic.showMessage("Thông báo", "Các địa điểm bạn đã chọn chưa có địa điểm nào Checkin vị trí");
                    }
                    else Metronic.showMapA(p);
                }
            });
        },
        delete : fnDelete,
        edit : fnEdit,
        add : fnAdd
    };
}();