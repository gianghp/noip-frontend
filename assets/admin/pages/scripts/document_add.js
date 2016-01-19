var DocumentAdd = function () {
    return {
        init: function () {
            $('#form-add-document #content').summernote({height: 150});
            
            $('#form-add-document').submit(function () {
                $('#form-add-document #content').val($('#form-add-document #content').code().trim());
                $.ajax({
                    url: "/admin/document/save.do",
                    dataType: 'script',
                    data: $(this).serializeArray()
                });
                return false;
            });

            $('#div_add_document .date-picker').datepicker('update', '');

            $("#form-add-document #files").select2({
                tags: []
            });
            
            $('#form-add-document #btn_files').click(function(){
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
        edit: function (o)
        {
            $('#div_add_document').find('input, textarea, select').each(function () {
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
            $('#form-add-document #content').code(o["content"]);
        }
    };
}();