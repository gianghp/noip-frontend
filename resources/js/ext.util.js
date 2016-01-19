Ext.onReady(function(){
    if(Ext.Updater){
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Đang tải...</div>';
    }

    if(Ext.view.View){
       Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
       Ext.grid.Panel.prototype.ddText = "{0} dòng được chọn";
    }

    if(Ext.TabPanelItem){
       Ext.TabPanelItem.prototype.closeText = "Đóng thẻ này";
    }

    if(Ext.form.field.Base){
       Ext.form.field.Base.prototype.invalidText = "Giá trị của ô này không hợp lệ.";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "Đang tải...";
    }
    
    if(Ext.Date){
        Ext.Date.monthNames = [
           "Tháng 1",
           "Tháng 2",
           "Tháng 3",
           "Tháng 4",
           "Tháng 5",
           "Tháng 6",
           "Tháng 7",
           "Tháng 8",
           "Tháng 9",
           "Tháng 10",
           "Tháng 11",
           "Tháng 12"
        ];

        Ext.Date.dayNames = [
           "Chủ nhật",
           "Thứ hai",
           "Thứ ba",
           "Thứ tư",
           "Thứ năm",
           "Thứ sáu",
           "Thứ bảy"
        ];
    }
    
    if(Ext.MessageBox){
       Ext.MessageBox.buttonText = {
          ok     : "Đồng ý",
          cancel : "Hủy bỏ",
          yes    : "Có",
          no     : "Không"
       };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ab',  // Vietnamese Dong
            dateFormat: 'd/m/Y'
        });
    }

    if(Ext.picker.Date){
       Ext.apply(Ext.picker.Date.prototype, {
          todayText         : "Hôm nay",
          minText           : "Ngày này nhỏ hơn ngày nhỏ nhất",
          maxText           : "Ngày này lớn hơn ngày lớn nhất",
          disabledDaysText  : "",
          disabledDatesText : "",
          monthNames	: Ext.Date.monthNames,
          dayNames		: Ext.Date.dayNames,
          nextText          : 'Tháng sau (Control+Right)',
          prevText          : 'Tháng trước (Control+Left)',
          monthYearText     : 'Chọn một tháng (Control+Up/Down để thay đổi năm)',
          todayTip          : "{0} (Spacebar - Phím trắng)",
          format            : "d/m/y"
       });
    }

    if(Ext.toolbar.Paging){
       Ext.apply(Ext.PagingToolbar.prototype, {
          beforePageText : "Trang",
          afterPageText  : "của {0}",
          firstText      : "Trang đầu",
          prevText       : "Trang trước",
          nextText       : "Trang sau",
          lastText       : "Trang cuối",
          refreshText    : "Tải lại",
          displayMsg     : "Hiển thị {0} - {1} của {2}",
          emptyMsg       : 'Không có dữ liệu để hiển thị'
       });
    }

    if(Ext.form.field.Text){
       Ext.apply(Ext.form.field.Text.prototype, {
          minLengthText : "Chiều dài tối thiểu của ô này là {0}",
          maxLengthText : "Chiều dài tối đa của ô này là {0}",
          blankText     : "Ô này cần phải nhập giá trị",
          regexText     : "",
          emptyText     : null
       });
    }

    if(Ext.form.field.Number){
       Ext.apply(Ext.form.field.Number.prototype, {
          minText : "Giá trị nhỏ nhất của ô này là {0}",
          maxText : "Giá trị lớn nhất của ô này là  {0}",
          nanText : "{0} hông phải là một số hợp lệ"
       });
    }

    if(Ext.form.field.Date){
       Ext.apply(Ext.form.field.Date.prototype, {
          disabledDaysText  : "Vô hiệu",
          disabledDatesText : "Vô hiệu",
          minText           : "Ngày nhập trong ô này phải sau ngày {0}",
          maxText           : "Ngày nhập trong ô này phải trước ngày {0}",
          invalidText       : "{0} không phải là một ngày hợp lệ - phải có dạng {1}",
          format            : "d/m/y"
       });
    }

    if(Ext.form.field.ComboBox){
       Ext.apply(Ext.form.field.ComboBox.prototype, {
          valueNotFoundText : undefined
       });
        Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
            loadingText       : "Đang tải..."
        });
    }

    if(Ext.form.field.VTypes){
       Ext.apply(Ext.form.field.VTypes, {
          emailText    : 'Giá trị của ô này phải là một địa chỉ email có dạng như "ten@abc.com"',
          urlText      : 'Giá trị của ô này phải là một địa chỉ web(URL) hợp lệ, có dạng như "http:/'+'/www.example.com"',
          alphaText    : 'Ô này chỉ được nhập các kí tự và gạch dưới(_)',
          alphanumText : 'Ô này chỉ được nhập các kí tự, số và gạch dưới(_)'
       });
    }

    if(Ext.grid.header.Container){
       Ext.apply(Ext.grid.header.Container.prototype, {
          sortAscText  : "Tăng dần",
          sortDescText : "Giảm dần",
          lockText     : "Khóa cột",
          unlockText   : "Bỏ khóa cột",
          columnsText  : "Các cột"
       });
    }

    if(Ext.grid.PropertyColumnModel){
       Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
          nameText   : "Tên",
          valueText  : "Giá trị",
          dateFormat : "j/m/Y"
       });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
       Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
          splitTip            : "Kéo giữ chuột để thay đổi kích thước.",
          collapsibleSplitTip : "Kéo giữ chuột để thay đổi kích thước. Nhấp đúp để ẩn đi."
       });
    }
});


/**
 * @class Ext.ux.TabCloseMenu
 * Plugin (ptype = 'tabclosemenu') for adding a close context menu to tabs. Note that the menu respects
 * the closable configuration on the tab. As such, commands like remove others and remove all will not
 * remove items that are not closable.
 *
 * @constructor
 * @param {Object} config The configuration options
 * @ptype tabclosemenu
 */
Ext.define('Ext.tab.TabCloseMenu', {
    alias: 'plugin.tabclosemenu',
    alternateClassName: 'Ext.ux.TabCloseMenu',

    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
     */
    closeTabText: 'Close Tab',

    /**
     * @cfg {Boolean} showCloseOthers
     * Indicates whether to show the 'Close Others' option. Defaults to <tt>true</tt>.
     */
    showCloseOthers: true,

    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
     */
    closeOthersTabsText: 'Close Other Tabs',

    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>.
     */
    showCloseAll: true,

    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
     */
    closeAllTabsText: 'Close All Tabs',

    /**
     * @cfg {Array} extraItemsHead
     * An array of additional context menu items to add to the front of the context menu.
     */
    extraItemsHead: null,

    /**
     * @cfg {Array} extraItemsTail
     * An array of additional context menu items to add to the end of the context menu.
     */
    extraItemsTail: null,

    //public
    constructor: function (config) {
        this.addEvents(
            'aftermenu',
            'beforemenu');

        this.mixins.observable.constructor.call(this, config);
    },

    init : function(tabpanel){
        this.tabPanel = tabpanel;
        this.tabBar = tabpanel.down("tabbar");

        this.mon(this.tabPanel, {
            scope: this,
            afterlayout: this.onAfterLayout,
            single: true
        });
    },

    onAfterLayout: function() {
        this.mon(this.tabBar.el, {
            scope: this,
            contextmenu: this.onContextMenu,
            delegate: 'div.x-tab'
        });
    },

    onBeforeDestroy : function(){
        Ext.destroy(this.menu);
        this.callParent(arguments);
    },

    // private
    onContextMenu : function(event, target){
        var me = this,
            menu = me.createMenu(),
            disableAll = true,
            disableOthers = true,
            tab = me.tabBar.getChildByElement(target),
            index = me.tabBar.items.indexOf(tab);

        me.item = me.tabPanel.getComponent(index);
        //menu.child('*[text="' + me.closeTabText + '"]').setDisabled(!me.item.closable);

        if (me.showCloseAll || me.showCloseOthers) {
            me.tabPanel.items.each(function(item) {
                if (item.closable) {
                    disableAll = false;
                    if (item != me.item) {
                        disableOthers = false;
                        return false;
                    }
                }
                return true;
            });

            if (me.showCloseAll) {
                menu.child('*[text="' + me.closeAllTabsText + '"]').setDisabled(disableAll);
            }

            if (me.showCloseOthers) {
                menu.child('*[text="' + me.closeOthersTabsText + '"]').setDisabled(disableOthers);
            }
        }

        event.preventDefault();
        me.fireEvent('beforemenu', menu, me.item, me);

        menu.showAt(event.getXY());
    },

    createMenu : function() {
        var me = this;

        if (!me.menu) {
            var items = [{
                text: me.closeTabText,
                scope: me,
                handler: me.onClose
            }];

            if (me.showCloseAll || me.showCloseOthers) {
                items.push('-');
            }

            if (me.showCloseOthers) {
                items.push({
                    text: me.closeOthersTabsText,
                    scope: me,
                    handler: me.onCloseOthers
                });
            }

            if (me.showCloseAll) {
                items.push({
                    text: me.closeAllTabsText,
                    scope: me,
                    handler: me.onCloseAll
                });
            }

            if (me.extraItemsHead) {
                items = me.extraItemsHead.concat(items);
            }

            if (me.extraItemsTail) {
                items = items.concat(me.extraItemsTail);
            }

            me.menu = Ext.create('Ext.menu.Menu', {
                items: items,
                listeners: {
                    hide: me.onHideMenu,
                    scope: me
                }
            });
        }

        return me.menu;
    },

    onHideMenu: function () {
        var me = this;

        me.item = null;
        me.fireEvent('aftermenu', me.menu, me);
    },

    onClose : function(){
        this.tabPanel.remove(this.item);
    },

    onCloseOthers : function(){
        this.doClose(true);
    },

    onCloseAll : function(){
        this.doClose(false);
    },

    doClose : function(excludeActive){
        var items = [];

        this.tabPanel.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.item){
                    items.push(item);
                }
            }
        }, this);

        Ext.each(items, function(item){
            this.tabPanel.remove(item);
        }, this);
    }
});

Ext.define('Ext.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    
    constructor: function() {
        this.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = this.dataIndex,
                checked = !record.get(dataIndex);
                
            record.set(dataIndex, checked);
            this.fireEvent('checkchange', this, recordIndex, checked);
            // cancel selection.
            return false;
        } else {
            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});

Ext.define('Ext.ux.desktop.FitAllLayout', {
    extend: 'Ext.layout.container.AbstractFit',
    alias: 'layout.fitall',

    // @private
    onLayout : function() {
        var me = this;
        me.callParent();

        var size = me.getLayoutTargetSize();

        me.owner.items.each(function (item) {
            me.setItemBox(item, size);
        });
    },

    getTargetBox : function() {
        return this.getLayoutTargetSize();
    },

    setItemBox : function(item, box) {
        var me = this;
        if (item && box.height > 0) {
            if (item.layoutManagedWidth == 2) {
               box.width = undefined;
            }
            if (item.layoutManagedHeight == 2) {
               box.height = undefined;
            }

            item.getEl().position('absolute', null, 0, 0);
            me.setItemSize(item, box.width, box.height);
        }
    }
});

Ext.util.md5 = function(s,raw,hexcase,chrsz) {
	raw = raw || false;	
	hexcase = hexcase || false;
	chrsz = chrsz || 8;

	function safe_add(x, y){
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function bit_rol(num, cnt){
		return (num << cnt) | (num >>> (32 - cnt));
	}
	function md5_cmn(q, a, b, x, s, t){
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t){
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t){
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t){
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t){
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function core_md5(x, len){
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;
		var a =  1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d =  271733878;
		for(var i = 0; i < x.length; i += 16){
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
			d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
			b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
			d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
			c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
			d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
			d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
			a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
			d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
			c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
			b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
			a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
			d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
			c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
			d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
			c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
			a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
			d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
			c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
			b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
			a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
			d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
			b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
			d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
			c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
			d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
			c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
			a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
			d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
			b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
			a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
			d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
			c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
			d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
			d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
			a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
			d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
			b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}
	function str2binl(str){
		var bin = [];
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
		}
		return bin;
	}
	function binl2str(bin){
		var str = "";
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < bin.length * 32; i += chrsz) {
			str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
		}
		return str;
	}
	
	function binl2hex(binarray){
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
		}
		return str;
	}
	return (raw ? binl2str(core_md5(str2binl(s), s.length * chrsz)) : binl2hex(core_md5(str2binl(s), s.length * chrsz))	);
};

Ext.util.base64 = {

    base64s : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    
    encode: function(decStr){
        if (typeof btoa === 'function') {
             return btoa(decStr);            
        }
        var base64s = this.base64s;
        var bits;
        var dual;
        var i = 0;
        var encOut = "";
        while(decStr.length >= i + 3){
            bits = (decStr.charCodeAt(i++) & 0xff) <<16 | (decStr.charCodeAt(i++) & 0xff) <<8 | decStr.charCodeAt(i++) & 0xff;
            encOut += base64s.charAt((bits & 0x00fc0000) >>18) + base64s.charAt((bits & 0x0003f000) >>12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt((bits & 0x0000003f));
        }
        if(decStr.length -i > 0 && decStr.length -i < 3){
            dual = Boolean(decStr.length -i -1);
            bits = ((decStr.charCodeAt(i++) & 0xff) <<16) |    (dual ? (decStr.charCodeAt(i) & 0xff) <<8 : 0);
            encOut += base64s.charAt((bits & 0x00fc0000) >>18) + base64s.charAt((bits & 0x0003f000) >>12) + (dual ? base64s.charAt((bits & 0x00000fc0) >>6) : '=') + '=';
        }
        return(encOut);
    },
    
    decode: function(encStr){
        if (typeof atob === 'function') {
            return atob(encStr); 
        }
        var base64s = this.base64s;        
        var bits;
        var decOut = "";
        var i = 0;
        for(; i<encStr.length; i += 4){
            bits = (base64s.indexOf(encStr.charAt(i)) & 0xff) <<18 | (base64s.indexOf(encStr.charAt(i +1)) & 0xff) <<12 | (base64s.indexOf(encStr.charAt(i +2)) & 0xff) << 6 | base64s.indexOf(encStr.charAt(i +3)) & 0xff;
            decOut += String.fromCharCode((bits & 0xff0000) >>16, (bits & 0xff00) >>8, bits & 0xff);
        }
        if(encStr.charCodeAt(i -2) == 61){
            return(decOut.substring(0, decOut.length -2));
        }
        else if(encStr.charCodeAt(i -1) == 61){
            return(decOut.substring(0, decOut.length -1));
        }
        else {
            return(decOut);
        }
    }

};  


Ext.util.utf8 = {

    // public method for url encoding
    encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // public method for url decoding
    decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    },
    unsign: function(str){
        var VietNamChar = [
            "aAeEoOuUiIdDyY", 
            "áàạảãâấầậẩẫăắằặẳẵ", 
            "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ", 
            "éèẹẻẽêếềệểễ", 
            "ÉÈẸẺẼÊẾỀỆỂỄ", 
            "óòọỏõôốồộổỗơớờợởỡ", 
            "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ", 
            "úùụủũưứừựửữ", 
            "ÚÙỤỦŨƯỨỪỰỬỮ", 
            "íìịỉĩ", 
            "ÍÌỊỈĨ", 
            "đ", 
            "Đ", 
            "ýỳỵỷỹ", 
            "ÝỲỴỶỸ" 
        ];
        for (i = 1; i < VietNamChar.length; i++){
            for (j = 0; j < VietNamChar[i].length; j++)
                str = str.replace(VietNamChar[i][j], VietNamChar[0][i - 1]); 
        };
        return str;
    }
    
}

Ext.util.Mask = {
    extmask : new Array(),

    show : function(el, msg_)
    {
        el = el ? Ext.get(el) : Ext.getBody();
        el = el ? el : Ext.getBody();

        if (this.extmask[el.id] == null)
            this.extmask[el.id] = new Ext.LoadMask(el, {msg: msg_ ? msg_ : "Đang xử lý..."});
        
        this.extmask[el.id].show();
    },

    hide : function(el)
    {
        el = el ? Ext.get(el) : Ext.getBody();
        el = el ? el : Ext.getBody();
        
        if (this.extmask[el.id] != null)
        {
            this.extmask[el.id].hide();
            this.extmask[el.id] = null;
        }
    }
}


Ext.define('xxx.grid.SelectFeature', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.selectable',

    mutateMetaRowTpl: function(metaRowTpl) {
        var i,
        ln = metaRowTpl.length;

        for (i = 0; i < ln; i++) {
            tpl = metaRowTpl[i];
            tpl = tpl.replace(/x-grid-row/, 'x-grid-row x-selectable');
            tpl = tpl.replace(/x-grid-cell-inner x-unselectable/g, 'x-grid-cell-inner');
            tpl = tpl.replace(/unselectable="on"/g, '');
            metaRowTpl[i] = tpl;
        }
    }
});

 Ext.override(Ext.view.Table, {
    afterRender: function() {
        var me = this;

        me.callParent();
        me.mon(me.el, {
            scroll: me.fireBodyScroll,
            scope: me
        });
        if (!me.featuresMC &&
            (me.featuresMC.findIndex('ftype', 'unselectable') >= 0)) {
            me.el.unselectable();
        }

        me.attachEventsForFeatures();
    }
});


Ext.override(Ext.grid.Panel, {
    cls: 'custom-grid',
    columnLines: true
});

Ext.override(Ext.selection.CheckboxModel, {
    checkOnly: false
});


Ext.override(Ext.PagingToolbar, {
    items : [
    '-',
    {    
        xtype: 'combobox',
        labelWidth: 50,
        fieldLabel: 'Số dòng',
        width: 110,
        queryMode: 'local',
        value: 25,
        displayField: 'value',
        valueField: 'id',
        editable: false,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'value'],
            data: [
                {id: 1, value: '1'},
                {id: 5, value: '5'},
                {id: 10, value: '10'},
                {id: 20, value: '20'},
                {id: 25, value: '25'},
                {id: 50, value: '50'},
                {id: 75, value: '75'},
                {id: 100, value: '100'},
                {id: 250, value: '250'},
                {id: 500, value: '500'},
                {id: 1000, value: '1000'}
            ]
        }),        
        listeners:{
            select:{
                fn: function(combo,records,b,eOpts){                        
                    var me = this.up();
                    me.store.pageSize = this.getValue();
                    me.store.loadPage(1);
                }                    
            },
            afterrender : function(me)
            {
                me.setValue(this.up().store.pageSize);
            }
        }
    }
    ]
});


Ext.override(Ext.grid.Scroller, {
    afterRender: function() {
        var me = this;
        me.callParent();
        me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
        Ext.cache[me.el.id].skipGarbageCollection = true;
        // add another scroll event listener to check, if main listeners is active
        Ext.EventManager.addListener(me.scrollEl, 'scroll', me.onElScrollCheck, me);
        // ensure this listener doesn't get removed
        Ext.cache[me.scrollEl.id].skipGarbageCollection = true;
    },
    // flag to check, if main listeners is active
    wasScrolled: false,
    // synchronize the scroller with the bound gridviews
    onElScroll: function(event, target) {
        this.wasScrolled = true; // change flag -> show that listener is alive
        this.fireEvent('bodyscroll', event, target);
    },
    // executes just after main scroll event listener and check flag state
    onElScrollCheck: function(event, target, options) {
        var me = this;

        if (!me.wasScrolled) {
            // Achtung! Event listener was disappeared, so we'll add it again
            me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
        }
        me.wasScrolled = false; // change flag to initial value
    }
});

Ext.override(Ext.menu.Menu, {
    onMouseLeave: function ( e ) {
    var me = this;


    // BEGIN FIX
    var visibleSubmenu = false;
    me.items.each(function(item) { 
        if(item.menu && item.menu.isVisible()) { 
            visibleSubmenu = true;
        }
    });
    if(visibleSubmenu) {
        //console.log('apply fix hide submenu');
        return;
    }
    // END FIX


    me.deactivateActiveItem();


    if (me.disabled) {
        return;
    }


    me.fireEvent('mouseleave', me, e);
    }
});


Ext.apply(Ext.form.field.VTypes, {
    confirm : function(val, field) {
        if (field.initialField) {
            var pwd = Ext.getCmp(field.initialField);
            return (val == pwd.getValue());
        }
        return true;
    },
    confirmText : ""
});

Ext.apply(Ext.form.field.VTypes, {
    username : function(val, field) {
        var p = /^[a-zA-Z0-9_]+$/;
        return p.test(val);
    },
    usernameText : "Tài khoản không hợp lệ."
});

Ext.define("Ext.ux.TreeCombo", {
    extend : "Ext.form.field.Picker",
    alias: 'widget.treecombo',
    initComponent : function() {
        var self = this;
        Ext.apply(self, {
            fieldLabel : self.fieldLabel,
            labelWidth : self.labelWidth
            // pickerAlign : "tl"
            });
        self.addEvents('groupSelected');
        self.callParent();
    },
    createPicker : function() {
        var self = this;
        self.picker = new Ext.tree.Panel({
            height : 200,
            width : 300,
            autoScroll : true,
            floating : true,
            resizable: false,
            focusOnToFront : false,
            shadow : true,
            ownerCt : this.ownerCt,
            useArrows : true,
            store : self.store,
            listeners:{
                scope:this,
                select:this.valueSelected,
                afterrender: function(pnl) {
                    if (self.selectedId){
                        var record = self.picker.getRootNode().findChild('id',self.selectedId,true);
                        self.picker.getSelectionModel().select(record);
                    }
                }
            },
            columns: [
                {
                    xtype: 'treecolumn',
                    text: self.headerText ? self.headerText : '',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'name'
                }
            ]
        });
        self.picker.getRootNode().expand(true);
        return self.picker;
    },
    alignPicker : function() {
        var me = this, picker, isAbove, aboveSfx = '-above';
        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                if (me.bodyEl.getWidth() > this.treeWidth){
                    picker.setWidth(me.bodyEl.getWidth());
                } else picker.setWidth(this.treeWidth);
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, "", me.pickerOffset);// ""->tl
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls
                        + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls
                        + aboveSfx);
            }
        }
    },
    valueSelected: function(picker,value,options) {
        this.setValue(value.data.name);
        this.fireEvent('valueSelected',this,value.data);
        this.collapse();
    }
});  