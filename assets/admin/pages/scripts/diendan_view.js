var Diendanview = function () {
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
            
            var html = $("#form-diendan_reply");
            html.find('#content').summernote({height: 200});
                
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
            
            html.find("#btSend").click(function(){
                var subject = html.find('#subject').val();
                if (subject.length === 0){
                    Metronic.showMessage("Thông báo", "Bạn chưa nhập tiêu đề chủ đề.", "OK");
                    return false;
                }

                var content = html.find('#content').code().trim();
                html.find('#content').val(content);
                if (content.length === 0){
                    Metronic.showMessage("Thông báo", "Bạn chưa nhập nội dung chủ đề.", "OK");
                    return false;
                }

                html.parents('.modal-content').mask("Đang thực hiện...");
                $.ajax({
                    url : "/admin/diendan/add.do",
                    dataType : "json",
                    data : html.serializeArray(),
                    success : function(d){
                        html.parents('.modal-content').unmask();
                        if (d.success){
                            window.location.reload(true);
                        }
                        else Metronic.showMessage("Thông báo", d.msg, "OK");
                    },
                    error : function(){
                        html.parents('.modal-content').unmask();
                        Metronic.showMessage("Thông báo", "Lỗi cập nhật lên hệ thống Server", "OK");
                    }
                });
            });
        }
    };
}();