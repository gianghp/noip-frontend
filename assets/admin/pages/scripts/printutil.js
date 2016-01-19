var PrintUtil = function () {
    var openPrintDialog = function (opt) {
        var height = String($(window).height() - 210) + 'px';
        bootbox.dialog({
            title: opt.title ? opt.title : "Xem In",
            size: opt.size ? opt.size : 'large',
            buttons: {
                'In': {
                    callback: function () {
                        frames["printIframe"].focus();
                        frames["printIframe"].print();
                        return false;
                    }
                },
                'Excel': {
                    callback: function () {
                        window.location = opt.url + '&type=excel';
                        return false;
                    }
                },
                'Đóng': {
                    callback: function () {
                    }
                }
            },
            message: '<div style="height: ' + height + '"><iframe id="printIframe" name="printIframe" src="' + opt.url + '" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe></div>'
        });
    };
    return {
        init: function () {
            $('.btn-print').click(function () {
                openPrintDialog({
                    url: $(this).attr('href')
                });
                return false;
            });
        },
        openPrintDialog: openPrintDialog
    };
}();