var initData = {};
initData.web_path = "http://localhost:63342";
initData.context_path = "/noip-frontend";
initData.services_url = "http://localhost:9001";

var Services = {
    chat : initData.services_url + "/api/chats",
    config : initData.services_url + "/api/configs",
    user : initData.services_url + "/api/users",
    list : initData.services_url + "/api/lists",
    listItem : initData.services_url + "/api/listitems",
    department : initData.services_url + "/api/departments",
    permission : initData.services_url + "/api/permissions",
    role : initData.services_url + "/api/roles",
    category : initData.services_url + "/api"
};

var app_state = $.cookie("app_state");
var app_token = $.cookie("app_token");
if(app_state === undefined || app_token === undefined){
    app_state = "A" + (Math.random() + "").substring(2) + "B";
    $.cookie("app_state", app_state);
    window.location = initData.services_url + "/oauth/authorize?client_id=ict.viettel.com.vn&response_type=token&redirect_uri=" + initData.web_path + initData.context_path + "/auth.html&state=" + app_state;
}

initData.url_login = initData.services_url + "/oauth/authorize?client_id=ict.viettel.com.vn&response_type=token&redirect_uri=" + initData.web_path + initData.context_path + "/auth.html&state=" + app_state;
initData.url_logout = initData.services_url + "/logout";

var App;

var DesktopInit = function () {
    $('body').append('<div id="dvStartSystem" style="text-align: center; padding: 100px; font-size: 9pt; font-weight: bold; color:white;"><img alt="" src="' + initData.context_path + '/resources/images/ajax-loader.gif" align="absmiddle"> Đang khởi động hệ điều hành ...</div>');
    
    var initExtJquery = function(){
        Ext.Ajax.cors = true;
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.withCredentials = false;
        Ext.Ajax.addListener('beforerequest',function(conn, options, eOpts ){
            var app_token = $.cookie("app_token");
            Ext.Ajax.defaultHeaders = {
                'Authorization': "Bearer " + app_token
            };
        });

        Ext.Ajax.on('requestexception', function(conn, response, options) {
            if(response.statusText === "Unauthorized"){
                window.location = initData.url_login;
            }
            else {
                //eval("var response = " + response.responseText);
                //var message = Error.get(response.error, response.error_description);
                //Ext.Msg.alert(Language.get('notice', 'Thông báo'), message);
            }
        }, this);
        
        Ext.Ajax.on('requestcomplete', function(conn, response, options) {
            //eval("var response = " + response.responseText);
            //var message = Error.get(response.success_code, response.success_description);
            //Ext.Msg.alert(Language.get('notice', 'Thông báo'), message);
        }, this);

        $( document ).ajaxError(function( event, response, settings ) {
            if(response.statusText === "Unauthorized"){
                window.location = initData.url_login;
            }
            else {
                Ext.Msg.alert(Language.get('notice', 'Thông báo'), Language.get(response.responseJSON.error, response.responseJSON.error_description));
            }
        });

        $.support.cors = true;
        $.ajaxSetup({
            contentType: "application/json",
            crossDomain: true,
            xhrFields: {
              withCredentials: false
            },
            beforeSend: function( xhr) {
                var app_token = $.cookie("app_token");
                xhr.setRequestHeader('Authorization', "Bearer " + app_token);
            }
        });
    };
    
    var Start = function(){
        Ext.onReady(function () {
            
            initExtJquery();
            
            $.ajax({
                url: Services.user + "/current",
                dataType : 'json',
                success: function(result){
                    if (result.success){
                        initData.user_name = result.information.username;
                        initData.full_name = result.information.name;
                        initData.email = result.information.email;
                        initData.theme_id = '';
                        initData.wallpaper_id = '';
                        initData.language = result.information.language === undefined || result.information.language === null ? "vn" : result.information.language;
                        initData.wallpaper_stretch = true;
                        Role.setRoles(result.information.permissions);
                        Language.setLanguage(initData.language);
                        
                        $.ajax({
                            url: Services.config + "/desktop",
                            dataType : 'json',
                            success: function(d){
                                if (d.success){
                                    
                                    $(d.shortcut).each(function(){
                                        this.title0 = this.name;
                                        this.name = Language.get(this.name);
                                        this.iconCls = this.icon_cls32;
                                        this.args = {title : this.title0, name:this.name};
                                        this.handler = function (data, record){
                                            menuHandler(data, record);
                                        };
                                    });

                                    $(d.quickstart).each(function(){
                                        this.title0 = this.name;
                                        this.name = Language.get(this.name);
                                        this.iconCls = this.iconCls16 ? this.iconCls16 : 'notepad';
                                        this.args = {title : this.title0, name:this.name};
                                        this.handler = function (data, record){
                                            menuHandler(data, record);
                                        };
                                    });

                                    $(d.autorun).each(function(){
                                        this.title0 = this.name;
                                        this.name = Language.get(this.name);
                                        this.iconCls = this.iconCls16 ? this.iconCls16 : 'notepad';
                                        this.args = {title : this.title0, name:this.name};
                                        this.handler = function (data, record){
                                            menuHandler(data, record);
                                        };
                                    });

                                    languageData = d.languageConfig;
                                    ExtMenu = ExtMenu(d.shortcut, d.quickstart, d.autorun);
                                    App = new Application.App();
                                    $.ajax({
                                        url: Services.user,
                                        data: {start: 0, limit: 999999},
                                        success: function (data) {
                                            App.collectionUser = data.collection;
                                        }
                                    });
                                }
                                else window.location.href = initData.url_logout;
                            }
                        });
                    }
                }
            });
        });
    };
    
    if ($.isIE)
    {
        $('#dvStartSystem').hide();
        var msg = $('<div id="useIE" style="text-align: center; padding: 100px; line-height: 30px; font-size: 10pt; font-weight: bold; color:white;">Hệ thống khuyên bạn không nên dùng trình duyệt Internet Explorer (IE) để sử dụng phận mềm này.<br>Xin vui sử dụng trình duyệt Google Chrome hoặc Firefox để sử dụng phần mềm này có chất lượng tốt hơn.<br>Nếu máy tính bạn chưa có bạn có thể tải về các loại trình duyệt này bằng các liên kết dưới đây:<br><a href="/web/setup/ChromeSetup.exe" type="_blank" style="text-decoration: underline;">Tải về trình duyệt Chrome tại đây (Sử dụng tốt nhất)</a><br><a href="/web/setup/FirefoxSetup14.0.1.exe" type="_blank" style="text-decoration: underline;">Hoặc bạn có thể tải về trình duyệt Firefox tại đây</a> <br><div id="dvContinue" style="text-decoration: underline; cursor: pointer;">Click vào đây nếu bạn vẫn muốn sử dụng phần mềm bằng trình duyệt IE hiện tại</div></div>');
        msg.find('#dvContinue').click(function () {
            msg.remove();
            $('#dvStartSystem').show();
            Start();
        });
        $('body').append(msg);
    }
    else Start();
}();