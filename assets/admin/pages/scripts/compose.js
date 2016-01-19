var Compose = function () {
    var initWysihtml5 = function () {
//        if (!jQuery().wysihtml5) {
//            return;
//        }
//        if ($('.inbox-wysihtml5').size() > 0) {
//            $('.inbox-wysihtml5').wysihtml5({
//                "stylesheets": ["/assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
//            });
//        }
        
        $('.inbox-wysihtml5').summernote({height: 300});
    };
    
    var initSaveDraft = function () {
        $('.btn-save-draft').click(function(){
            var sHTML = $('.inbox-wysihtml5').code();
            $('.inbox-wysihtml5').val(sHTML);
            
            if ($('#frmSendMail #mail_subject').val() == ""){
                Metronic.showMessage("Thông báo", "Xin vui lòng nhập chủ đề của thư trước khi có thể lưu nháp.", "OK");
                return false;
            }
            $('#mail_send').val(0);
            var files = "";
            $('#frmSendMail .files .name a').each(function(){
                files += $(this).attr('href') + "," + $(this).attr('download') + ";";
            });
            $('#upload_files').val(files);
            
            $('#frmSendMail').mask("Đang lưu ...");
            $.ajax({
                url: "/mail/compose/save.do",
                type: "post",
                dataType : "json",
                data: $('#frmSendMail').serializeArray(),
                success : function(r){
                    if (r.success)
                        window.location.href = "/mail/inbox.html";
                }
            });
            return false;
        });
    };
    
    var initSendMail = function () {
        $('.btn-send').click(function(){
            var sHTML = $('.inbox-wysihtml5').code();
            $('.inbox-wysihtml5').val(sHTML);
            
            if ($('#frmSendMail #mail_to').val() == ""){
                Metronic.showMessage("Thông báo", "Xin vui lòng nhập các địa chỉ thư của người nhận.", "OK");
                return false;
            }
            
            if ($('#frmSendMail #mail_subject').val() == ""){
                Metronic.showMessage("Thông báo", "Xin vui lòng nhập chủ đề cho thư của bạn.", "OK");
                return false;
            }
            
            $('#mail_send').val(1);
            var files = "";
            $('#frmSendMail .files .name a').each(function(){
                files += $(this).attr('href') + "," + $(this).attr('download') + ";";
            });
            $('#upload_files').val(files);
            
            $('#frmSendMail').mask("Đang gửi ...");
            $.ajax({
                url: "/mail/compose/save.do",
                type: "post",
                dataType : "json",
                data: $('#frmSendMail').serializeArray(),
                success : function(r){
                    if (r.success)
                        window.location.href = "/mail/inbox.html";
                }
            });
            return false;
        });
    };
    
    var handleCCInput = function () {
        var the = $('.inbox-compose .mail-to .inbox-cc');
        var input = $('.inbox-compose .input-cc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
        });
    };

    var handleBCCInput = function () {

        var the = $('.inbox-compose .mail-to .inbox-bcc');
        var input = $('.inbox-compose .input-bcc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
        });
    };
    
    return {
        init: function () {
            initWysihtml5();
            initSaveDraft();
            initSendMail();
            
            $('.inbox-cc').click(function () {
                handleCCInput();
            });

            $('.inbox-bcc').click(function () {
                handleBCCInput();
            });
            
            var input = $('.inbox-compose .input-cc');
            if(input.find("input").val().length > 0) 
            {
                input.show();
                $('.inbox-cc').hide();
            }
            
            input = $('.inbox-compose .input-bcc');
            if(input.find("input").val().length > 0) 
            {
                input.show();
                $('.inbox-bcc').hide();
            }
            
            $("#tep_dinh_kem").select2({
                tags: []
            });
            
            $('.select2-choices, .select2-drop-active').css('border', "0px");
            
            $('#btn_tep_dinh_kem').click(function(){
                Metronic.showUpload("Tệp đính kèm", 2, function(a, b){
                    var s = "";
                    $(a).each(function(){
                        if (s === "") s = '<input type="hidden" name="files[]" value="' + this.url + ';' + this.name + '"/>' + this.name;
                        else s += ',' + '<input type="hidden" name="files[]" value="' + this.url + ';' + this.name + '"/>' + this.name;
                    });
                    if ($('#tep_dinh_kem').val() === "") 
                        $('#tep_dinh_kem').val(s);
                    else $('#tep_dinh_kem').val($('#tep_dinh_kem').val() + ',' + s);
                    $('#tep_dinh_kem').change();
                });
            });
            
            $('form').submit(function(){
                return false;
            });
        }
    };
}();