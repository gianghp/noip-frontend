var Language = function(){
    
    var curentLanguage = "vn";
    
    var data = {
        account : {vn : "Tài khoản", en: "Account"},
        name : {vn : "Tên", en: "Name"},
        address : {vn : "Địa chỉ", en: "Address"},
        active : {vn : "Kích hoạt", en: "Active"},
        locked : {vn : "Khóa", en: "Locked"},
        birthday : {vn : "Ngày sinh", en: "Birthday"},
        description : {vn : "Mô tả", en: "Description"},
        permission : {vn : "Quyền", en: "Permission"},
        user : {vn : "Người dùng", en: "User"},
        access_denied : {vn : "Không có quyền truy cập", en: "Access is denied"},
        save: {vn : "Lưu", en: "Save"},
        update: {vn : "Cập nhật", en: "Update"},
        close: {vn : "Đóng", en: "Close"},
        cancel: {vn : "Bỏ qua", en: "Cancel"},
        notice : {vn : "Thông báo", en: "Notice"},
        logout : {vn : "Đăng xuất", en: "Logout"},
        confirm_logout : {vn : "Đăng xuất khỏi hệ thống?", en: "Logout?"},
        unikey : {vn : "Bật tắt Tiếng Việt", en: "Unikey"},
        add : {vn : "Thêm", en: "Add"},
        edit : {vn : "Sửa", en: "Edit"},
        delete : {vn : "Xóa", en: "Delete"},
        refresh : {vn : "Refresh", en: "Refresh"},
        seach : {vn : "Tìm kiếm", en: "Seach"},
        update_success : {vn : "Bạn đã cập nhật thành công.", en: "Update success."},
        insert_success : {vn : "Bạn đã thêm mới thành công.", en: "Insert success."},
        same_prev_password : {vn : "Mật khẩu mới phải khách mật khẩu cũ.", en: "New password is same."},
        change_password_success : {vn : "Đã thay đổi mật khẩu thành công.", en: "Change password success."},
        invalid_password: {vn : "Mật khẩu cũ không hợp lệ.", en: "Invalid password."},
        change_avatar : {vn : "Đổi ảnh đại diện", en: "Change avatar"},
        user_info : {vn : "Hồ sơ cá nhân", en: "User infomation"},
        change_password : {vn : "Thay đổi mật khẩu", en: "Change password"},
        password : {vn : "Mật khẩu", en: "Password"},
        re_password : {vn : "Nhập lại MK", en: "RePassword"},
        login_history : {vn : "Lịch sử đăng nhập", en: "Login history"},
        system_config : {vn : "Cấu hình hệ thống", en: "System config"},
        user_name : {vn : "Tài khoản", en: "User name"},
        full_name : {vn : "Họ và tên", en: "Full name"},
        language : {vn : "Ngôn ngữ", en: "Language"},
        department : {vn : "Phòng ban", en: "Department"},
        shortcut_account : {vn : "Tài khoản", en: "Accounts"},
        shortcut_Permission : {vn : "Permission", en: "Permission"},
        shortcut_chat : {vn : "Chat", en: "Chat"}
    };
    
    return {
        init : function(){
            
        },
        getLanguage : function(){
            return curentLanguage;
        },
        setLanguage : function(language){
            curentLanguage = language;
            $('.lbl_language').each(function(){
                var me = $(this);
                var df = me.html();
                var v = Language.get(me.attr('code'), df);
                me.html(v);
            });
        },
        get2 : function(code, defaultLabel){
            if (defaultLabel === undefined) defaultLabel = code;
            var v = this.getA(code, curentLanguage, defaultLabel);
            return v;
        },
        get : function(code, defaultLabel){
            if (defaultLabel === undefined) defaultLabel = code;
            var v = this.getA(code, curentLanguage, defaultLabel);
            return "<span class='lbl_language' code='" + code + "'>" + v + "</span>";
        },
        getA : function(code, lang, defaultLabel){
            if (data[code] !== undefined && data[code] !== 'undefined'){
                var o = data[code];
                if (o[lang] !== undefined && o[lang] !== 'undefined'){
                    return o[lang];
                }
                else return defaultLabel;
            }
            else return defaultLabel;
        }
    };
}();

Language.init();