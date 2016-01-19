Ext.define("Ext.util.Observable",{requires:["Ext.util.Event"],statics:{releaseCapture:function(a){a.fireEvent=this.prototype.fireEvent},capture:function(c,b,a){c.fireEvent=Ext.Function.createInterceptor(c.fireEvent,b,a)},observe:function(a,b){if(a){if(!a.isObservable){Ext.applyIf(a,new this());this.capture(a.prototype,a.fireEvent,a)}if(Ext.isObject(b)){a.on(b)}return a}}},isObservable:true,constructor:function(a){var b=this;Ext.apply(b,a);if(b.listeners){b.on(b.listeners);delete b.listeners}b.events=b.events||{};if(b.bubbleEvents){b.enableBubble(b.bubbleEvents)}},eventOptionsRe:/^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|element|vertical|horizontal)$/,addManagedListener:function(h,d,f,e,c){var g=this,a=g.managedListeners=g.managedListeners||[],b;if(typeof d!=="string"){c=d;for(d in c){if(c.hasOwnProperty(d)){b=c[d];if(!g.eventOptionsRe.test(d)){g.addManagedListener(h,d,b.fn||b,b.scope||c.scope,b.fn?b:c)}}}}else{a.push({item:h,ename:d,fn:f,scope:e,options:c});h.on(d,f,e,c)}},removeManagedListener:function(h,c,f,j){var e=this,k,b,g,a,d;if(typeof c!=="string"){k=c;for(c in k){if(k.hasOwnProperty(c)){b=k[c];if(!e.eventOptionsRe.test(c)){e.removeManagedListener(h,c,b.fn||b,b.scope||k.scope)}}}}g=e.managedListeners?e.managedListeners.slice():[];for(d=0,a=g.length;d<a;d++){e.removeManagedListenerItem(false,g[d],h,c,f,j)}},fireEvent:function(){var g=this,c=Ext.Array.toArray(arguments),d=c[0].toLowerCase(),b=true,f=g.events[d],a=g.eventQueue,e;if(g.eventsSuspended===true){if(a){a.push(c)}}else{if(f&&f!==true){if(f.bubble){if(f.fire.apply(f,c.slice(1))===false){return false}e=g.getBubbleTarget&&g.getBubbleTarget();if(e&&e.isObservable){if(!e.events[d]||e.events[d]===true||!e.events[d].bubble){e.enableBubble(d)}return e.fireEvent.apply(e,c)}}else{c.shift();b=f.fire.apply(f,c)}}}return b},addListener:function(c,e,d,b){var g=this,a,f;if(typeof c!=="string"){b=c;for(c in b){if(b.hasOwnProperty(c)){a=b[c];if(!g.eventOptionsRe.test(c)){g.addListener(c,a.fn||a,a.scope||b.scope,a.fn?a:b)}}}}else{c=c.toLowerCase();g.events[c]=g.events[c]||true;f=g.events[c]||true;if(Ext.isBoolean(f)){g.events[c]=f=new Ext.util.Event(g,c)}f.addListener(e,d,Ext.isObject(b)?b:{})}},removeListener:function(c,e,d){var g=this,b,f,a;if(typeof c!=="string"){a=c;for(c in a){if(a.hasOwnProperty(c)){b=a[c];if(!g.eventOptionsRe.test(c)){g.removeListener(c,b.fn||b,b.scope||a.scope)}}}}else{c=c.toLowerCase();f=g.events[c];if(f&&f.isEvent){f.removeListener(e,d)}}},clearListeners:function(){var b=this.events,c,a;for(a in b){if(b.hasOwnProperty(a)){c=b[a];if(c.isEvent){c.clearListeners()}}}this.clearManagedListeners()},clearManagedListeners:function(){var b=this.managedListeners||[],c=0,a=b.length;for(;c<a;c++){this.removeManagedListenerItem(true,b[c])}this.managedListeners=[]},removeManagedListenerItem:function(b,a,f,c,e,d){if(b||(a.item===f&&a.ename===c&&(!e||a.fn===e)&&(!d||a.scope===d))){a.item.un(a.ename,a.fn,a.scope);if(!b){Ext.Array.remove(this.managedListeners,a)}}},addEvents:function(e){var d=this,b,a,c;d.events=d.events||{};if(Ext.isString(e)){b=arguments;c=b.length;while(c--){d.events[b[c]]=d.events[b[c]]||true}}else{Ext.applyIf(d.events,e)}},hasListener:function(a){var b=this.events[a.toLowerCase()];return b&&b.isEvent===true&&b.listeners.length>0},suspendEvents:function(a){this.eventsSuspended=true;if(a&&!this.eventQueue){this.eventQueue=[]}},resumeEvents:function(){var a=this,b=a.eventQueue||[];a.eventsSuspended=false;delete a.eventQueue;Ext.each(b,function(c){a.fireEvent.apply(a,c)})},relayEvents:function(c,e,h){h=h||"";var g=this,a=e.length,d=0,f,b;for(;d<a;d++){f=e[d].substr(h.length);b=h+f;g.events[b]=g.events[b]||true;c.on(f,g.createRelayer(b))}},createRelayer:function(a){var b=this;return function(){return b.fireEvent.apply(b,[a].concat(Array.prototype.slice.call(arguments,0,-1)))}},enableBubble:function(a){var b=this;if(!Ext.isEmpty(a)){a=Ext.isArray(a)?a:Ext.Array.toArray(arguments);Ext.each(a,function(c){c=c.toLowerCase();var d=b.events[c]||true;if(Ext.isBoolean(d)){d=new Ext.util.Event(b,c);b.events[c]=d}d.bubble=true})}}},function(){this.createAlias({on:"addListener",un:"removeListener",mon:"addManagedListener",mun:"removeManagedListener"});this.observeClass=this.observe;Ext.apply(Ext.util.Observable.prototype,function(){function a(i){var h=(this.methodEvents=this.methodEvents||{})[i],d,c,f,g=this;if(!h){this.methodEvents[i]=h={};h.originalFn=this[i];h.methodName=i;h.before=[];h.after=[];var b=function(k,j,e){if((c=k.apply(j||g,e))!==undefined){if(typeof c=="object"){if(c.returnValue!==undefined){d=c.returnValue}else{d=c}f=!!c.cancel}else{if(c===false){f=true}else{d=c}}}};this[i]=function(){var k=Array.prototype.slice.call(arguments,0),j,l,e;d=c=undefined;f=false;for(l=0,e=h.before.length;l<e;l++){j=h.before[l];b(j.fn,j.scope,k);if(f){return d}}if((c=h.originalFn.apply(g,k))!==undefined){d=c}for(l=0,e=h.after.length;l<e;l++){j=h.after[l];b(j.fn,j.scope,k);if(f){return d}}return d}}return h}return{beforeMethod:function(d,c,b){a.call(this,d).before.push({fn:c,scope:b})},afterMethod:function(d,c,b){a.call(this,d).after.push({fn:c,scope:b})},removeMethodListener:function(h,f,d){var g=this.getMethodEvent(h),c,b;for(c=0,b=g.before.length;c<b;c++){if(g.before[c].fn==f&&g.before[c].scope==d){Ext.Array.erase(g.before,c,1);return}}for(c=0,b=g.after.length;c<b;c++){if(g.after[c].fn==f&&g.after[c].scope==d){Ext.Array.erase(g.after,c,1);return}}},toggleEventLogging:function(b){Ext.util.Observable[b?"capture":"releaseCapture"](this,function(c){if(Ext.isDefined(Ext.global.console)){Ext.global.console.log(c,arguments)}})}}}())});

Ext.define('Ext.ux.desktop.Module', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);
        this.init();
    },
    
    parent : 1,

    init: Ext.emptyFn
});

Ext.define('Ext.ux.desktop.ShortcutModel', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'name' },
       { name: 'iconCls' },
       { name: 'module' }
    ]
});

Ext.define('Ext.ux.desktop.Wallpaper', {
    extend: 'Ext.Component',

    alias: 'widget.wallpaper',

    cls: 'ux-wallpaper',
    html: '<img src="'+Ext.BLANK_IMAGE_URL+'">',

    stretch: false,
    wallpaper: null,

    afterRender: function () {
        var me = this;
        me.callParent();
        me.setWallpaper(me.wallpaper, me.stretch);
    },

    applyState: function () {
        var me = this, old = me.wallpaper;
        me.callParent(arguments);
        if (old != me.wallpaper) {
            me.setWallpaper(me.wallpaper);
        }
    },

    getState: function () {
        return this.wallpaper && { wallpaper: this.wallpaper };
    },

    setWallpaper: function (wallpaper, stretch) {
        var me = this, imgEl, bkgnd;
        
        me.stretch = (stretch !== false);
        me.wallpaper = wallpaper;

        if (me.rendered) {
            imgEl = me.el.dom.firstChild;
            if (!wallpaper || wallpaper == Ext.BLANK_IMAGE_URL) {
                Ext.fly(imgEl).hide();
            } else if (me.stretch) {
                imgEl.src = wallpaper;

                me.el.removeCls('ux-wallpaper-tiled');
                Ext.fly(imgEl).setStyle({
                    width: '100%',
                    height: '100%'
                }).show();
            } else {
                Ext.fly(imgEl).hide();

                bkgnd = 'url('+wallpaper+')';
                me.el.addCls('ux-wallpaper-tiled');
            }

            me.el.setStyle({
                backgroundImage: bkgnd || ''
            });
        }
        return me;
    }
});


Ext.define('Ext.ux.desktop.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktop',

    uses: [
        'Ext.util.MixedCollection',
        'Ext.menu.Menu',
        'Ext.view.View', 
        'Ext.window.Window',

        'Ext.ux.desktop.TaskBar',
        'Ext.ux.desktop.Wallpaper',
        'Ext.ux.desktop.FitAllLayout'
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    border: false,
    html: '&#160;',
    layout: 'fitall',

    xTickSize: 1,
    yTickSize: 1,

    app: null,
    
    cls : 'ux-desktop',
    id : 'iddesktop',

    /**
     * @cfg {Array|Store} shortcuts
     * The items to add to the DataView. This can be a {@link Ext.data.Store Store} or a
     * simple array. Items should minimally provide the fields in the
     * {@link Ext.ux.desktop.ShorcutModel ShortcutModel}.
     */
    shortcuts: null,

    /**
     * @cfg {String} shortcutItemSelector
     * This property is passed to the DataView for the desktop to select shortcut items.
     * If the {@link #shortcutTpl} is modified, this will probably need to be modified as
     * well.
     */
    shortcutItemSelector: 'div.ux-desktop-shortcut',

    /**
     * @cfg {String} shortcutTpl
     * This XTemplate is used to render items in the DataView. If this is changed, the
     * {@link shortcutItemSelect} will probably also need to changed.
     */
    shortcutTpl: [
        '<tpl for=".">',
            '<div class="ux-desktop-shortcut" hide="{hidden}" hide1="{hidden}" shortcutid="{id}" id="{name}-shortcut">',
                '<div class="ux-desktop-shortcut-icon {iconCls}">',
                    '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
                '</div>',
                '<span class="ux-desktop-shortcut-text">{name}</span>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],

    /**
     * @cfg {Object} taskbarConfig
     * The config object for the TaskBar.
     */
    taskbarConfig: null,

    windowMenu: null,

    initComponent: function () {
        var me = this;

        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());
        me.bbar = me.taskbar = new Ext.ux.desktop.TaskBar(me.taskbarConfig);
//        me.tbar = new Ext.toolbar.Toolbar({
//            cls: 'ux-taskbar',
//            height : 35
//        });
        me.taskbar.windowMenu = me.windowMenu;

        me.windows = new Ext.util.MixedCollection();

        me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [
            {xtype: 'wallpaper', id: me.id+'_wallpaper'},
            me.createDataView()
        ];

        me.callParent();

        me.shortcutsView = me.items.getAt(1);
        me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        var wallpaper = me.wallpaper;
        me.wallpaper = me.items.getAt(0);
        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }     
        
        $('#dvStartSystem').remove();                
    },
    
    arrangeDesktopIcon : function()
    {
        $('.ux-desktop-shortcut[hide=1]').hide();
        
        var icons = $('.ux-desktop-shortcut[hide=0]');
        var zindex = 0;
        $('.ux-desktop-shortcut').draggable({
            start: function(event, ui) {
                var me = $(this);
                zindex = zindex + 1;
                me.css("z-index", zindex);
                
                var top = me.offset().top;
                top = top - (top % 100);
                
                var left = me.offset().left;
                left = left - (left % 100);
                
                me.attr('old_top', top);
                me.attr('old_left', left);
            },
            stop: function(event, ui) {
                var me = $(this);
                var top = me.offset().top + 50;
                top = top - (top % 100);
                
                var left = me.offset().left + 50;
                left = left - (left % 100);
                
                me.css('left', left);
                me.css('top', top);
                
                var list =$('.ux-desktop-shortcut');
                list.each(function(){
                    var t = $(this);
                    if ( t.offset().top == me.offset().top && t.offset().left == me.offset().left && t.css("z-index")!= me.css("z-index") )
                    {
                        t.css('left', me.attr('old_left'));
                        t.css('top', me.attr('old_top'));
                    }
                });
            }
        });
        
        var rows = Math.round(($(window).height() - 100) / 100);
        if (rows < 2) rows = 2;
        var cols = parseInt(icons.length / rows);
        if (icons.length % rows != 0) ++cols;
        var i = 0;
        var j = 0;

        for (j = 0; j < cols; ++j)
        for (i = 1; i <= rows; ++i)
        {
            var index = j * rows + i - 1;
            if (index < icons.length)
            {
                var icon = $(icons[index]);
                icon.css('left', j * 100);
                icon.css('top', (i - 1) * 100);
            }
        }        
    },

    afterRender: function () {
        var me = this;
        me.callParent();
        me.el.on('contextmenu', me.onDesktopMenu, me);
        
        me.arrangeDesktopIcon();
        
        $(window).resize(function() {
            me.arrangeDesktopIcon();
            setTimeout("autoTaskbar();", 200);            
        });
    },

    //------------------------------------------------------
    // Overrideable configuration creation methods

    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },

    createDesktopMenu: function () {
        var me = this, ret = {
            items: me.contextMenuItems || []
        };

        //if (ret.items.length) {
        //    ret.items.push('-');
        //}

        //ret.items.push(
        //        {text: 'Tile', handler: me.tileWindows, scope: me, minWindows: 1},
        //        {text: 'Cascade', handler: me.cascadeWindows, scope: me, minWindows: 1});

        return ret;
    },

    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                {text: 'Restore', handler: me.onWindowMenuRestore, scope: me},
                {text: 'Minimize', handler: me.onWindowMenuMinimize, scope: me},
                {text: 'Maximize', handler: me.onWindowMenuMaximize, scope: me},
                '-',
                {text: 'Close', handler: me.onWindowMenuClose, scope: me}
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },

    //------------------------------------------------------
    // Event handler methods

    onDesktopMenu: function (e) {
        var me = this, menu = me.contextMenu;
        e.stopEvent();
        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }
        menu.showAt(e.getXY());
        menu.doConstrain();
    },

    onDesktopMenuBeforeShow: function (menu) {
        var me = this, count = me.windows.getCount();

        menu.items.each(function (item) {
            var min = item.minWindows || 0;
            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function (dataView, record) {
        record.data.handler(record.data, record);
    },

    onWindowClose: function(win) {
        var me = this;
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function (menu) {
        var items = menu.items.items, win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
    },

    onWindowMenuClose: function () {
        var me = this, win = me.windowMenu.theWin;

        win.close();
    },

    onWindowMenuHide: function (menu) {
        menu.theWin = null;
    },

    onWindowMenuMaximize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.maximize();
    },

    onWindowMenuMinimize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function () {
        var me = this, win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    //------------------------------------------------------
    // Dynamic (re)configuration methods

    getWallpaper: function () {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
            xt = me.xTickSize = xTickSize,
            yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd, resizer = win.resizer;
            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function (wallpaper, stretch) {                        
        this.wallpaper.setWallpaper(wallpaper, stretch);
        return this;
    },

    //------------------------------------------------------
    // Window management methods

    cascadeWindows: function() {
        var x = 0, y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },

    createWindow: function(config, cls) {
        config.title = Language.get(config.title);
        var me = this, win, cfg = Ext.applyIf(config || {}, {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                minimizable: true,
                maximizable: true,
                taskbar : true,
                activateChildren : false,
                maximized : false
            });
            
        cls = cls || Ext.window.Window;
        
        win = me.add(new cls(cfg));

        me.windows.add(win);

        if (!cfg.parent) win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton ? win.taskButton.el : null;

        win.on({
            activate: me.updateActive,
            beforeshow: me.updateActiveWindow,
            deactivate: me.updateActiveWindow,
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });

        win.on({
            afterrender: function () {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
                
                //check roles
                Role.apply();
            },
            single: true
        });

        // replace normal window close w/fadeOut animation:
        win.doClose = function ()  {
            if (cfg.onClose) 
            {
                if (!cfg.onClose()) return false;
            }
            App.getDesktop().getWindows().each(function(w) {
                if (w.parent && w.parent === win.id)
                    w.close();
            });
                        
            win.doClose = Ext.emptyFn; // dblclick can call again...
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function () {
                        win.destroy();
                    }
                }
            });
            win.parent = null;
        };

        return win;
    },

    getActiveWindow: function () {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function () {
        var windows = this.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },
    
    getWindows: function() {
        return this.windows;
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
        
        App.getDesktop().getWindows().each(function(w) {
            if (w.parent && w.parent == win.id)
                w.minimize();
        });
    },

    restoreWindow: function (win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this, availWidth = me.body.getWidth(true);
        var x = me.xTickSize, y = me.yTickSize, nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function () {                    
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        
        if (activeWindow === last) {
            return;
        }
        
        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    },
    
    up1 : function(win, me)
    {
        var zindex = parseInt($('#' + win.el.id).css("z-index"));
        var ws =  App.getDesktop().getWindows();
        var a = new Array();
        var n = 0;
        for (var i = 0; i< ws.length; ++i) {
            var w = ws.get(i);
            if (w.parent && w.parent == win.id)
            {
                a[n] = w;++n;
            }
        }
        
        var j, tmp;
        for (i=0; i<a.length - 1; ++i)
            for (j=i+1; j<a.length; ++j)                
                {
                    var tmp1 = parseInt($('#' + a[i].el.id).css("z-index"));
                    var tmp2 = parseInt($('#' + a[j].el.id).css("z-index"));
                    if (tmp1 >tmp2)
                        {
                            tmp = a[i];
                            a[i] = a[j];
                            a[j] = tmp;
                        }
                }
        
        for (i=0; i<a.length; ++i)
        {
            tmp = $('#' + a[i].el.id);
            tmp.css("z-index", zindex + i + 1);
            if (a[i].activateChildren) me.up1(a[i], me);
        }
    },
    
    down1 : function(win, me)
    {
        var p = win;
        if (win.parent)
        {
            win = App.getDesktop().getWindow(win.parent);
            
            var tmp1 = parseInt($('#' + win.el.id).css("z-index"));
            var tmp2 = parseInt($('#' + p.el.id).css("z-index"));
            if (tmp2 <= tmp1)
                $('#' + p.el.id).css("z-index", tmp1 + 1);
            
            var zindex = parseInt($('#' + win.el.id).css("z-index"));
            var ws =  App.getDesktop().getWindows();
            var a = new Array();
            var n = 0;
            for (var i = 0; i< ws.length; ++i) {
                var w = ws.get(i);
                if (w.parent && w.parent == win.id)
                {
                    a[n] = w;
                    ++n;
                }
            }

            var j, tmp;
            for (i=0; i<a.length - 1; ++i)
                for (j=i+1; j<a.length; ++j)                
                    {
                        tmp1 = parseInt($('#' + a[i].el.id).css("z-index"));
                        tmp2 = parseInt($('#' + a[j].el.id).css("z-index"));
                        if (tmp1 >tmp2)
                            {
                                tmp = a[i];
                                a[i] = a[j];
                                a[j] = tmp;
                            }
                    }
                    
            for (i=0; i<a.length; ++i)
            {
                tmp = $('#' + a[i].id);
                if (p != a[i])
                {
                    tmp.css("z-index", zindex + i + 1);   
                    if (a[i].activateChildren) me.up1(a[i], me);
                }
            }
            
            me.down1(win, me);
        }
    },
    
    updateActive: function () {                 
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        
//        if (activeWindow && activeWindow.activateChildren)
//        {
//            me.up1(activeWindow, me);
//            me.down1(activeWindow, me);            
//        }
//        else if (activeWindow) me.down1(activeWindow, me);
        
//        zmgr = me.getDesktopZIndexManager();
//        if (zmgr)
//        {
//            var w= zmgr.get(0);
//            me.up1(w, me);
//            me.down1(w, me);
//        }
        
       
        if (activeWindow && activeWindow.activateChildren)
        {
             var ws =  App.getDesktop().getWindows();
             var ok = false;
             for (var i = 0; i< ws.length; ++i) {
                var w = ws.get(i);
                if (w.parent && w.parent == activeWindow.id)
                {
                    w.show();
                    ok = true;
                }
            }
            if (ok) return;
        }
        
        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    }
});

Ext.define('Application.Core.StartMenu', {
    extend: 'Ext.ux.desktop.Module',
    
    init : function(){
        
        this.launcher = ExtMenu.desktop_startmenu;
    }
});

Ext.define('Ext.ux.desktop.StartMenu', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],

    ariaRole: 'menu',

    cls: 'x-menu ux-start-menu',

    defaultAlign: 'bl-tl',

    iconCls: 'user',

    floating: true,

    shadow: false,
    
    bodyStyle: 'background:#ffc; padding:0px; border:0px;',
    
    // We have to hardcode a width because the internal Menu cannot drive our width.
    // This is combined with changing the align property of the menu's layout from the
    // typical 'stretchmax' to 'stretch' which allows the the items to fill the menu
    // area.
    width: 300,

    initComponent: function() {
        var me = this, menu = me.menu;

        me.menu = new Ext.menu.Menu({
            cls: 'ux-start-menu-body',
            border: false,
            floating: false,
            items: menu
        });
        me.menu.layout.align = 'stretch';

        me.items = [me.menu];
        me.layout = 'fit';

        Ext.menu.Manager.register(me);
        me.callParent();
        // TODO - relay menu events

        me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            id : 'dvStartMenuToolbar',
            dock: 'right',
            cls: 'ux-start-menu-toolbar',
            vertical: true,
            width: 130
        }, me.toolConfig));
        
        var headImage = initData.context_path + '/resources/images/head.jpg?r=1';
        me.head1 = Ext.create('Ext.panel.Panel', {
            border : false,
            title : "",
            bodyStyle: 'padding:10px; opacity:1; filter:alpha(opacity=100); background-color:#ffffff; background : url(' + headImage + ');',
            dock: 'top',
            items: 
            {
                xtype: 'container', 
                layout: {
                    type: 'hbox'                        
                },
                items : [{
                    xtype : "button",
                    html:'<div style="height:50px; width:50px; background-image: none; overflow: hidden;"><div class="imgAvatar50" style="height:50px; width:50px; background-image: url(' + initData.context_path + '/core/file/getAvatar50x50); overflow: hidden;"></div></div>',
                    handler: function(){
                        loadJS('user/change-avatar.js', function(){
                            var frm = new Ext.User.ChangeAvatar();
                            frm.createWindow({name : 'Avatar'});
                        });
                    },
                    scope: me
                },
                {
                    xtype : "label",
                    style : 'padding:15px; font-weight: bold; font-size: 15pt; color: #40566F; font-family: arial;',
                    html : "<span id='lblCurrentUser' title='" + initData.full_name + "'>" + (initData.user_name ? initData.user_name : "Guest") + "</span>"
                }]
            }
        });
        me.addDocked(me.head1);
        
        me.toolbar.layout.align = 'stretch';
        me.addDocked(me.toolbar);
        

        delete me.toolItems;

        me.on('deactivate', function () {
            me.hide();
        });
    },

    addMenuItem: function() {
        var cmp = this.menu;
        cmp.add.apply(cmp, arguments);
    },

    addToolItem: function() {
        var cmp = this.toolbar;
        cmp.add.apply(cmp, arguments);
    },

    showBy: function(cmp, pos, off) {
        var me = this;

        if (me.floating && cmp) {
            me.layout.autoSize = true;
            me.show();

            // Component or Element
            cmp = cmp.el || cmp;

            // Convert absolute to floatParent-relative coordinates if necessary.
            var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
            if (me.floatParent) {
                var r = me.floatParent.getTargetEl().getViewRegion();
                xy[0] -= r.x;
                xy[1] -= r.y + 3;
            }
            me.showAt(xy);
            me.doConstrain();
        }
        return me;
    }
}); 


Ext.define('Ext.ux.desktop.TaskBar', {
    extend: 'Ext.toolbar.Toolbar', 

    requires: [
        'Ext.button.Button',
        'Ext.resizer.Splitter',
        'Ext.menu.Menu',

        'Ext.ux.desktop.StartMenu'
    ],

    alias: 'widget.taskbar',

    cls: 'ux-taskbar',
    height : 35,

    /**
     * @cfg {String} startBtnText
     * The text for the Start Button.
     */
    startBtnText: 'Start',

    initComponent: function () {
        var me = this;

        me.startMenu = new Ext.ux.desktop.StartMenu(me.startConfig);

        me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());

        var i = 0;
        var count = 0;
        for (i=0; i<me.quickStart.items.length; ++i)
        {
            if (me.quickStart.items.getAt(i).hidden)
                me.quickStart.items.getAt(i).hide();
            else ++count;
        }
        
        if (count == 0) me.quickStart.hide();
        else me.quickStart.show();
        if (count < 4)
            me.quickStart.setWidth(35 * count);
        else me.quickStart.setWidth(100);
        
        me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());

        me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());

        me.items = [
            {
                xtype: 'button',
                cls: 'ux-start-button',
                iconCls: 'ux-start-button-icon',
                menu: me.startMenu,
                menuAlign: 'bl-tl',
                text: me.startBtnText,
				handler: function() {
                    if (_remove_link_in_item_menu >= 2) return false;
                    ++_remove_link_in_item_menu;
                    $('.x-menu-item-link').each(function(){
                        var t = $(this);
                        if (t.attr('href') === '#'){
                            t.removeAttr('href');
                            t.mouseout(function(){
                                if (_remove_link_in_item_menu >= 2) return false;
                                $('.x-menu-item-link').each(function(){
                                    var t = $(this);
                                    if (t.attr('href') === '#'){
                                        t.removeAttr('href');
                                        t.mouseout(function(){
                                            if (_remove_link_in_item_menu >= 2) return false;
                                            $('.x-menu-item-link').each(function(){
                                                var t = $(this);
                                                if (t.attr('href') === '#') t.removeAttr('href')
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                    $('.x-menu-item-link').removeAttr('href');
                }
            },
            me.quickStart,
            {
                xtype: 'splitter', html: '&#160;',
                height: 14, width: 2, // TODO - there should be a CSS way here
                cls: 'x-toolbar-separator x-toolbar-separator-horizontal'
            },
            //'-',
            me.windowBar,
            '-',
            me.tray
        ];

        me.callParent();
    },

    afterLayout: function () {
        var me = this;
        me.callParent();
        me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);                
    },

    /**
     * This method returns the configuration object for the Quick Start toolbar. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getQuickStart: function () {
        var me = this, ret = {
            minWidth: 20,
            width: 100,
            items: [],
            enableOverflow: true
        };

        Ext.each(this.quickStart, function (item) {
            ret.items.push({
                tooltip: { text: item.name, align: 'bl-tl' },
                //tooltip: item.name,
                overflowText: item.name,
                iconCls: item.iconCls,
                module: item.module,
                data : item,
                hidden1 : item.hidden,
                handler: me.onQuickStartClick,
                scope: me
            });
        });

        return ret;
    },

    /**
     * This method returns the configuration object for the Tray toolbar. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getTrayConfig: function () {
        var iWidth = 80;
        var ret = {
            width: iWidth,
            items: this.trayItems
        };
        delete this.trayItems;
        return ret;
    },

    getWindowBarConfig: function () {
        return {
            flex: 1,
            cls: 'ux-desktop-windowbar',
            items: [ '&#160;' ],
            layout: { overflowHandler: 'Scroller' }
        };
    },

    getWindowBtnFromEl: function (el) {
        var c = this.windowBar.getChildByElement(el);
        return c || null;
    },

    onQuickStartClick: function (record) {
        record.data.handler(record.data, record);
    },
    
    onButtonContextMenu: function (e) {
        var me = this, t = e.getTarget(), btn = me.getWindowBtnFromEl(t);
        if (btn) {
            e.stopEvent();
            me.windowMenu.theWin = btn.win;
            me.windowMenu.showBy(t);
        }
    },

    onWindowBtnClick: function (btn) {
        var win = btn.win;

        if (win.minimized || win.hidden) {
            win.show();
        } else if (win.active) {
            win.minimize();
        } else {
            win.toFront();
        }
    },

    addTaskButton: function(win) {
        var titleObj = $(win.title);
        var titleText = Ext.util.Format.ellipsis(titleObj.text(), 20);
        var config = {
            iconCls: win.iconCls,
            enableToggle: true,
            toggleGroup: 'all',
            width: 140,
            text: "<span class='lbl_language' code='" + titleObj.attr('code') + "'>" + titleText + "</span>",
            listeners: {
                click: this.onWindowBtnClick,
                scope: this
            },
            win: win
        };

        var cmp = this.windowBar.add(config);
        cmp.toggle(true);
        return cmp;
    },

    removeTaskButton: function (btn) {
        var found, me = this;
        me.windowBar.items.each(function (item) {
            if (item === btn) {
                found = item;
            }
            return !found;
        });
        if (found) {
            me.windowBar.remove(found);
        }
        return found;
    },

    setActiveButton: function(btn) {
        if (btn) {
            btn.toggle(true);
        } else {
            this.windowBar.items.each(function (item) {
                if (item.isButton) {
                    item.toggle(false);
                }
            });
        }
    }
});

/**
 * @class Ext.ux.desktop.TrayClock
 * @extends Ext.toolbar.TextItem
 * This class displays a clock on the toolbar.
 */
Ext.define('Ext.ux.desktop.TrayClock', {
    extend: 'Ext.toolbar.TextItem',

    alias: 'widget.trayclock',

    cls: 'ux-desktop-trayclock',

    html: '&#160;',

    timeFormat: 'g:i A',

    tpl: '{time}',

    initComponent: function () {
        var me = this;

        me.callParent();

        if (typeof(me.tpl) == 'string') {
            me.tpl = new Ext.XTemplate(me.tpl);
        }
    },

    afterRender: function () {
        var me = this;
        Ext.Function.defer(me.updateTime, 100, me);
        me.callParent();
    },

    onDestroy: function () {
        var me = this;

        if (me.timer) {
            window.clearTimeout(me.timer);
            me.timer = null;
        }

        me.callParent();
    },

    updateTime: function () {
        var me = this, time = Ext.Date.format(new Date(), me.timeFormat),
            text = me.tpl.apply({ time: time });
        if (me.lastText != text) {
            me.setText(text);
            me.lastText = text;
        }
        me.timer = Ext.Function.defer(me.updateTime, 10000, me);
    }
});
var _remove_link_in_item_menu = 0;