var Report1 = function () {

    var handleRecords = function () {

        var grid = new Datatable();
        grid.init({
            src: $("#table_list"),
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 10,
                ajax: {
                    url: "/admin/report1/get.do"
                },
                iDeferLoading: 0,
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4]
                }]
            }
        });
        
        $('#frmGridSearch').submit(function(){
            find();
            return false;
        });
        
        var head = $($('.table-container .row')[0]);
        head.hide();
        $("#table_list_wrapper .row:last").hide();
        
        $('.txt_thoi_gian').datepicker({
            rtl: Metronic.isRTL(),
            format: 'dd/mm/yyyy',
            orientation: "right",
            autoclose: true
        });
        
        $('#txt_thoi_gian').change(function(){
            $('#frmGridSearch').submit();
        });
        
        $('#txt_thoi_gian').val(moment().format('DD/MM/YYYY'));
        $('#txt_thoi_gian').change();
        Report1.grid = grid;
    };

    var find = function(){
        Report1.grid.setAjaxParam("ngay", $('#div_list_report1 #txt_thoi_gian').val());
        Report1.grid.getDataTable().ajax.reload();
    };
    
    var initExportExcel = function(){
        $('#exportToExcel').click(function(){
            window.location.href = '/admin/report1/export.do?user_id=' + $('#div_list_report1 #user_id').val() + "&ngay=" + $('#div_list_report1 #txt_thoi_gian').val();
        });
    };
    
    return {
        init: function () {
            $('#div_list_report1 #btn_find').click(function(){
                find();
            });
            initExportExcel();
            handleRecords();
            find();
        }
    };
}();