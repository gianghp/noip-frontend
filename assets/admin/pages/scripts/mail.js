var Mail = function () {
    return {
        init: function () {
            
            $(".inbox .fa-star").click(function(){
                var me = $(this);
                var star = me.hasClass('inbox-started') ? 1 : 0;
                $.ajax({
                    url : "/service/mail/star.do",
                    type : 'post',
                    dataType : 'json',
                    data : {id : [me.attr("mail_id")], star :star},
                    success : function(r){
                        if (r.success){
                            if (star === 1) me.removeClass('inbox-started');
                            else me.addClass('inbox-started');
                        }
                    }
                });
            });
            
            $('.mail-checkbox-item').change(function(){
                var i = 0;
                $('.mail-checkbox-item').each(function(){
                    var checked = $(this).is(":checked");
                    if (!checked) ++i;
                });
                $('.mail-group-checkbox').attr("checked", i === 0);
                $.uniform.update($('.mail-group-checkbox'));
            });
            
            $('.mail-group-checkbox').click(function () {
                var set = $('.mail-checkbox');
                var checked = $(this).is(":checked");
                set.each(function () {
                    $(this).attr("checked", checked);
                });
                $.uniform.update(set);
            });
        },
        setDelete : function(o, box){
            if (o === false){
                var i = 0;
                var data = new Array();
                $('.mail-checkbox-item').each(function(){
                    var checked = $(this).is(":checked");
                    if (checked){
                        ++i;
                        data.push($(this).attr('mail_id'));
                    }
                });
                if (i === 0) Metronic.showMessage("Thông báo", "Xin vui lòng chọn các thư mà bạn muốn xóa!", "OK");
                else{
                    bootbox.dialog({
                        title: "Thông báo",
                        message: "Bạn có chắc chắn muốn xóa các thư đã chọn?",
                        buttons: {
                            success: {
                                label: "Có",
                                className: "btn-success",
                                callback: function () {
                                    $.ajax({
                                        url : "/service/mail/delete.do",
                                        type : 'post',
                                        dataType : 'json',
                                        data : {id : data},
                                        success : function(r){
                                            if (r.success){
                                                if (box)
                                                    window.location.href = "/mail/" + box + ".html";
                                                else window.location.reload(true);
                                            }
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
                    message: "Bạn có chắc chắn muốn xóa thư này?",
                    buttons: {
                        success: {
                            label: "Có",
                            className: "btn-success",
                            callback: function () {
                                $.ajax({
                                    url : "/service/mail/delete.do",
                                    type : 'post',
                                    dataType : 'json',
                                    data : {id : [o.id]},
                                    success : function(r){
                                        if (r.success){
                                            if (box)
                                                window.location.href = "/mail/" + box +".html";
                                            else window.location.reload(true);
                                        }
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
        },
        setStar : function(o, star){
            if (o === false){
                var i = 0;
                var data = new Array();
                $('.mail-checkbox-item').each(function(){
                    var checked = $(this).is(":checked");
                    if (checked){
                        ++i;
                        data.push($(this).attr('mail_id'));
                    }
                });
                if (i === 0) Metronic.showMessage("Thông báo", "Xin vui lòng chọn các thư mà bạn muốn gắn sao!", "OK");
                else{
                    $.ajax({
                        url : "/service/mail/star.do",
                        type : 'post',
                        dataType : 'json',
                        data : {id : data, star : star},
                        success : function(r){
                            if (r.success){
                                $('.mail-checkbox-item').each(function(){
                                    var checked = $(this).is(":checked");
                                    if (checked){
                                        var me = $(this).parents("tr").find('.fa-star');
                                        if (star === 1) me.removeClass('inbox-started');
                                        else me.addClass('inbox-started');
                                    }
                                });
                                $('.mail-checkbox').attr('checked', false);
                                $.uniform.update($('.mail-checkbox'));
                            }
                        }
                    });
                }
            }
            else{
                $.ajax({
                    url : "/service/mail/star.do",
                    type : 'post',
                    dataType : 'json',
                    data : {id : [o.id], star : star},
                    success : function(r){
                        if (r.success){
                            window.location.reload(true);
                        }
                    }
                });
            }
        },
        setRead : function(o){
            if (o === false){
                var i = 0;
                var data = new Array();
                $('.mail-checkbox-item').each(function(){
                    var checked = $(this).is(":checked");
                    if (checked){
                        ++i;
                        data.push($(this).attr('mail_id'));
                    }
                });
                if (i === 0) Metronic.showMessage("Thông báo", "Xin vui lòng chọn các thư mà bạn muốn đánh dấu đã đọc!", "OK");
                else{
                    $.ajax({
                        url : "/service/mail/read.do",
                        type : 'post',
                        dataType : 'json',
                        data : {id : data},
                        success : function(r){
                            if (r.success){
                                $('.mail-checkbox-item').each(function(){
                                    var checked = $(this).is(":checked");
                                    if (checked){
                                        var me = $(this).parents("tr").removeClass("unread");
                                    }
                                });
                                $('.mail-checkbox').attr('checked', false);
                                $.uniform.update($('.mail-checkbox'));
                            }
                        }
                    });
                }
            }
            else{
                $.ajax({
                    url : "/service/mail/read.do",
                    type : 'post',
                    dataType : 'json',
                    data : {id : [o.id], star : star},
                    success : function(r){
                        if (r.success){
                            window.location.reload(true);
                        }
                    }
                });
            }
        },
        reply : function(o, box){
            window.location.href = "/mail/compose.html?action=reply&box=" + box + "&id=" + o.id;
        },
        replyall : function(o, box){
            window.location.href = "/mail/compose.html?action=replyall&box=" + box + "&id=" + o.id;
        },
        forward : function(o, box){
            window.location.href = "/mail/compose.html?action=forward&box=" + box + "&id=" + o.id;
        }
    };
}();