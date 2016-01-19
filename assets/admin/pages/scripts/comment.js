var Comment = function () {
    return {
        init: function () {
            $('#divFormComments').slimScroll({
                scrollTo: 9999999
            });
            
            $('#form_comments').submit(function(){
                if ($('#form_comments #content').val().length === 0){
                    $('#form_comments #content').focus();
                    return false;
                }
                
                var dataArray = $(this).serializeArray();
                var mess = $('#form_comments #content').val('');
                
                $.ajax({
                    url : "/service/comment/post.do",
                    type : 'post',
                    data : dataArray,
                    dataType: "json",
                    success : function(d){
                        if (d.success){
                            var me = $(d.data);
                            $('#divFormComments .chats').append(me);
                            
                            var inout = "in";
                            if ($('#divFormComments .message').length > 1){
                                inout = $('#divFormComments .message:last').parents('li').prev().attr('class');
                                inout = inout.indexOf('in ') === 0 || inout.indexOf(' in') > 0 ? "out" : "in";
                            }
                            me.addClass(inout);
                            
                            var height = 0;
                            $('#divFormComments .chats li').each(function() {
                                height = height + $(this).outerHeight() + 20;
                            });
                            if (height < 380) 
                            {
                                $('#divFormComments, .slimScrollDiv').css('height', height);
                            }
                            
                            $('#form_comments #content').val('');
                            $('#divFormComments').slimScroll({
                                scrollTo: 999999
                            });
                        }
                    }
                });
                return false;
            });
            
            setInterval(function(){
                var chat = $('#form_comments');
                if (chat.length > 0){
                    var iMaxId = parseInt(chat.find('#max_id').val());
                    var stable = chat.find('#stable').val();
                    var id = chat.find('#id').val();
                    $.ajax({
                        url : "/service/comment/check.do",
                        data : {max_id : iMaxId, stable : stable, id:id},
                        dataType: 'json',
                        success : function(data){
                            if (data.length){
                                $(data).each(function(){
                                    if (parseInt(this.id) > iMaxId)
                                        chat.find('#max_id').val(this.id);
                                    if ($('.comment' + this.id).length == 0){
                                        var me = $(this.data);
                                        $('#divFormComments .chats').append(me);

                                        var inout = "in";
                                        if ($('#divFormComments .message').length > 1){
                                            inout = $('#divFormComments .message:last').parents('li').prev().attr('class');
                                            inout = inout.indexOf('in ') === 0 || inout.indexOf(' in') > 0 ? "out" : "in";
                                        }
                                        me.addClass(inout);

                                        var height = 0;
                                        $('#divFormComments .chats li').each(function() {
                                            height = height + $(this).outerHeight() + 20;
                                        });
                                        if (height < 380) 
                                        {
                                            $('#divFormComments, .slimScrollDiv').css('height', height);
                                        }

                                        $('#form_comments #content').val('');
                                        $('#divFormComments').slimScroll({
                                            scrollTo: 999999
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }, 7000);
            
        },
        delete : function(comment_id)
        {
            bootbox.dialog({
                title: "Xóa bình luận",
                message: "Bạn có chắc chắn muốn xóa bình luận này",
                buttons: {
                    success: {
                        label: "Có",
                        className: "btn-success",
                        callback: function () {
                            $.ajax({
                                url : "/service/comment/delete.do",
                                data : {comment_id : comment_id},
                                dataType : 'json',
                                type : 'post',
                                success: function(d)
                                {
                                    if (!d.success) Metronic.showMessage('Thông báo', 'Bạn không có quyền thực hiện chức năng này.', 'OK');
                                    else $('.comment' + comment_id).remove();
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