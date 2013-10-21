SCWeb.ui.Menu = {
    _items: null,

    /*!
     * Initialize menu in user interface
     * @param {Object} params Parameters for menu initialization.
     * There are required parameters:
     * - menu_container_id - id of dom element that will contains menu items
     * - menu_commands - object, that represent menu command hierachy (in format returned from server)
     */
    init: function(params, callback) {
        var self = this;
        
        this.menu_container_id = '#' + params.menu_container_id;
        
        // register for translation updates
        SCWeb.core.Translation.registerListener(this);
        
        this._build(params.menu_commands);
        callback();
    },

    _build: function(menuData) {

        this._items = [];

        var menuHtml = '<ul class="nav navbar-nav">';

        //TODO: change to children, remove intermediate 'childs'
        if(menuData.hasOwnProperty('childs')) {
            var id, subMenu;
            for(i in menuData.childs) {
                subMenu = menuData.childs[i];
                menuHtml += this._parseMenuItem(subMenu);
            }
        }

        menuHtml += '</ul>';

        $(this.menu_container_id).append(menuHtml);

        this._registerMenuHandler();
    },

    _parseMenuItem: function(item) {

        this._items.push(item.id);

        var itemHtml = '';
        if(item.cmd_type == 'cmd_noatom') {
            itemHtml = '<li class="dropdown"><a sc_addr="' + item.id + '" id="' + item.id + '" class="menu_item ' + item.cmd_type + ' dropdown-toggle" data-toggle="dropdown" href="#" ><span clas="text">' + item.id + '</span><b class="caret"></b></a>';
            
        } else {
            itemHtml = '<li><a id="' + item.id + '"sc_addr="' + item.id + '" class="menu_item ' + item.cmd_type + '" >' + item.id + '</a>';
        }

        if(item.hasOwnProperty('childs')) {
            itemHtml += '<ul class="dropdown-menu">';
            var id;
            var subMenu;
            var i;
            for(i = 0; i < item.childs.length; i++) {
                subMenu = item.childs[i];
                itemHtml += this._parseMenuItem(subMenu);
            }
            itemHtml += '</ul>';
        }
        return itemHtml + '</li>';
    },

    _registerMenuHandler: function() {
        
        SCWeb.ui.Utils.bindArgumentsSelector("menu_container", "[sc_addr]");
        
        $('.menu_item').click(function() {
            
            var sc_addr = $(this).attr('sc_addr');
            // append as argument
            /*if (SCWeb.core.utils.Keyboard.ctrl) {
                SCWeb.core.Arguments.appendArgument(sc_addr);
            }else{
            
                if ($(this).hasClass('cmd_atom')) {
                    
                    var output_lang = SCWeb.core.ui.Windows.getActiveWindowOtputLanguage();//SCWeb.core.ui.OutputLanguages.getLanguage();
                    
                    if (!output_lang) {
                        alert("There are no any output language selected");
                    }else{
                    
                        var arguments_list = SCWeb.core.Arguments._arguments;
                        var current_window = SCWeb.core.ui.Windows.active_window;
                        if (!current_window) {
                            alert("There are no any active window to output answer");
                        }else{
                            SCWeb.core.Server.doCommand(sc_addr, output_lang, arguments_list, function(data) {
                                SCWeb.core.ui.Windows.sendDataToWindow(current_window, data);
                            });
                        }
                    }
                }
            }*/
        });
    },
    
    // ---------- Translation listener interface ------------
    updateTranslation: function(namesMap) {
        // apply translation
        $(this.menu_container_id + ' [sc_addr]').each(function(index, element) {
            var addr = $(element).attr('sc_addr');
            if(namesMap[addr]) {
                $(element).text(namesMap[addr]);
            }
        });
        
    },
    
    /**
     * @return Returns list obj sc-elements that need to be translated
     */
    getObjectsToTranslate: function() {
        return this._items;
    }
};