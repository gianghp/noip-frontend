var Log2 = function () {

    var handleRecords = function () {

        var grid = new Datatable();
        grid.init({
            src: $("#table_list"),
            onSuccess: function (grid) {
            },
            onError: function (grid) {
            },
            loadingMessage: 'Loading...',
            dataTable: {
                pageLength: 9999999999,
                ajax: {
                    url: "/admin/log2/get.do?status=" + Metronic.getURLParameter('status')
                },
                columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2]
                }]
            }
        });
        
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var pattern = $(".table-group-action-input", grid.getTableWrapper());
            grid.setAjaxParam("pattern", pattern.val());
            grid.setAjaxParam("ids", grid.getSelectedRows());
            grid.getDataTable().ajax.reload();
        });
        
        $(".table-group-action-input").keypress(function (e) {
            if (e.which === 13) {
                var pattern = $(".table-group-action-input", grid.getTableWrapper());
                grid.setAjaxParam("pattern", pattern.val());
                grid.setAjaxParam("ids", grid.getSelectedRows());
                grid.getDataTable().ajax.reload();
            }
        });
        
        Log2.grid = grid;
    };

    return {
        init: function () {
            handleRecords();
            
            var head = $($('.table-container .row')[0]);
            $(head.find("div")[0]).html('<h4>Logs</h4>');
        }
    };
}();