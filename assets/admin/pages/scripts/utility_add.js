var UtilityAdd = function () {
    return {
        init: function () {
            $('#form-add-utility #content').summernote({height: 200});
            
            $('#form-add-utility').submit(function () {
                $('#form-add-utility #content').val($('#form-add-utility #content').code().trim());
                $.ajax({
                    url: "/admin/utility/save.do",
                    dataType: 'script',
                    data: $(this).serializeArray()
                });
                return false;
            });

            $("#form-add-utility #files").select2({
                tags: []
            });
            
            $('#form-add-utility #btn_files').click(function(){
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
            $('#div_add_utility').find('input, textarea, select').each(function () {
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
            $('#div_add_utility #content').code(o["content"]);
        }
    };
}();