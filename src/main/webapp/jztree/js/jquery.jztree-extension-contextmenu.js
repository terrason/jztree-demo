/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function($) {
    if (!$) {
        return;
    }
    var INSTANCE_COUNT = 0;
    var ACCEPT_ALL_TYPE = ["root", "branch", "empty", "leaf"];
    var _menus = {
        "新增": {
            enable: ["root", "branch", "empty"],
            action: "add?parentId=attr{id}",
            clazz: "icon-add"
        },
        "编辑": {
            enable: true,
            action: "edit?id=attr{id}",
            clazz: "icon-edit"
        },
        "删除": {
            enable: ["empty", "leaf"],
            action: "remove?id=attr{id}",
            confirm: "确定要删除 attr{name} 吗？",
            clazz: "icon-remove"
        },
        "属性": {
            enable: false,
            action: function(ztreeObj, treeNode) {
                var msg = "";
                $.each(treeNode, function(name, value) {
                    msg += name + ":" + value + "\n";
                });
                window.alert(msg);
            },
            confirm: "正在进行 attr{name} 的属性查看操作！\n此处显示的属性信息仅为调试所用，确定查看吗？"
        }
    };
    var template = {
        popup: $("<div class=\"popup\"></div>"),
        menu: $("<a class=\"menu\"></a>")
    };

    var context = {
        ztreeObj: null,
        treeNode: null
    };

    $.fn.zTree._z.data.addZTreeTools(function(setting, zTreeTools) {
        zTreeTools.popup = function(menus) {
            var handles = []; //树节点右击事件前置拦截器，数组元素必须为function.
            extendMenus(menus);
            normalize(_menus);
            var $popupDom = setupDom();
            registEventHandle(function(ztreeObj, treeNode, nodeType) {
                $popupDom.children().hide();
                $popupDom.children("." + nodeType).show();
            });
            $("body").append($popupDom);

            setting.callback.onRightClick = function(event, treeId, treeNode) {
                var ztreeObj = $.fn.zTree.getZTreeObj(treeId);
                if (!treeNode && event.target.tagName.toLowerCase() !== "button" && $(event.target).parents("a").length === 0) {
                    ztreeObj.cancelSelectedNode();
                    setPopupContextVisible(false);
                } else if (treeNode && !treeNode.noR) {
                    ztreeObj.selectNode(treeNode);
                    setPopupContextVisible(true, event.clientX, event.clientY);
                    context.ztreeObj = ztreeObj;
                    context.treeNode = treeNode;
                    var nodeType = ztreeObj.getNodeType(treeNode);
                    for (var i = 0; i < handles.length; i++) {
                        if (handles[i](ztreeObj, treeNode, nodeType) === false) {
                            break;
                        }
                    }
                }
            };
            $(document).ready(function() {
                $("body").mousedown(function(event) {
                    if (!(event.target.id === $popupDom.attr("id") || $(event.target).parents("#" + $popupDom.attr("id")).length > 0)) {
                        $popupDom.hide();
                    }
                });
            });

            function extendMenus(menus) {
                if (typeof(menus) === "string") {
                    extendMenuFromString(menus);
                } else if ($.isArray(menus)) {
                    for (var i = 0; i < menus.length; i++) {
                        var menu = menus[i];
                        if (typeof(menu) === "string") {
                            extendMenuFromString(menu);
                        } else {
                            extendMenuFromObject(menu);
                        }
                    }
                } else {
                    extendMenuFromObject(menus);
                }

                function extendMenuFromString(actionString) {
                    var index = actionString.search(/[-_=+%$#@!:|.><]/);
                    var name = index <= 0 ? actionString : actionString.substring(0, index);
                    var action = index <= 0 ? undefined : actionString.substring(index + 1);
                    var menusTmp = new Object();
                    menusTmp[name] = {
                        enable: true,
                        action: action
                    };
                    $.extend(true, _menus, menusTmp);
                }
                function extendMenuFromObject(obj) {
                    for (var name in obj) {
                        var menuObj = obj[name] || {};
                        var menusTemp = new Object();
                        if (typeof(menuObj) === "string" || $.isFunction(menuObj)) {
                            menusTemp[name] = {
                                action: menuObj
                            };
                        } else {
                            menusTemp[name] = menuObj;
                        }
                        $.extend(true, _menus, menusTemp);
                    }
                }
            }
            /**
             * 将menus参数对象标准化.
             * <p>标准menus对象为如下格式:<pre>
             * {
             *      "菜单名":{
             *          enable  ::  array,
             *          action  ::  string|function    //string可使用表达式
             *      },
             *      "第二个菜单":{...},
             *      ...
             * }
             * </pre></p>
             * @param {Object} menus 菜单定义体
             */
            function normalize(menus) {
                $.each(menus, function(name, menuObj) {
                    if (menuObj.enable === undefined || menuObj.enable === true || menuObj.enable === "true") {
                        menuObj.enable = ACCEPT_ALL_TYPE;
                    } else if (typeof(menuObj.enable) === "string" && menuObj.enable !== "false") {
                        menuObj.enable = [menuObj.enable];
                    } else if ($.isArray(menuObj.enable)) {
                    } else {
                        menuObj.enable = [];
                    }
                    //完成enable参数标准化
                    if (menuObj.confirm) {
                        var templateConfirm = String(menuObj.confirm);
                        if (typeof(menuObj.action) === "string") {
                            var templateAction = menuObj.action;
                            menuObj.action = function(ztreeObj, treeNode) {
                                var confirm = replaceExpression(templateConfirm, treeNode);
                                if (window.confirm(confirm)) {
                                    window.location = replaceExpression(templateAction, treeNode);
                                }
                            };
                        } else if ($.isFunction(menuObj.action)) {
                            var templateActionFunction = menuObj.action;
                            menuObj.action = function(ztreeObj, treeNode) {
                                var confirm = replaceExpression(templateConfirm, treeNode);
                                if (window.confirm(confirm)) {
                                    templateActionFunction(ztreeObj, treeNode);
                                }
                            };
                        }
                    }
                    //完成action参数标准化
                });
            }

            /**
             * 建立右键菜单DOM. 注册handle.
             */
            function setupDom() {
                var $popup = template.popup.clone();
                $popup.css("position", "absolute").hide();
                $popup.data("menus", _menus);
                $popup.attr("id", "jztree-popup-" + INSTANCE_COUNT++);
                $.each(_menus, function(name, menuObj) {
                    var $menu = template.menu.clone();
                    $menu.data("name", name);
                    $menu.addClass(menuObj.clazz);
                    setupDomClass($menu, menuObj.enable);
                    if (menuObj.action) {
                        $menu.hover(function() {
                            $(this).addClass("highlight");
                        }, function() {
                            $(this).removeClass("highlight");
                        });
                    }
                    setupAnchorDom($menu, name, menuObj);
                    $popup.append($menu);
                });
                return $popup;

                /**
                 * 未菜单附加可接受节点类型信息.
                 * 为菜单DOM添加额外class.方便根据节点类型来查找合适的菜单项。
                 * @param {JQuery} $menu 菜单节点
                 * @param {array} acceptType 菜单有效的节点类型
                 */
                function setupDomClass($menu, acceptType) {
                    for (var i = 0; i < acceptType.length; i++) {
                        $menu.addClass(acceptType[i]);
                    }
                }
                /**
                 * 生成超链接DOM. 同时注册handle.
                 * @param {JQuery} $menuAnchor 菜单超链接
                 * @param {string} name 菜单名称. menuObj.displayName的优先级更高
                 * @param {object} menuObj 菜单结构体
                 */
                function setupAnchorDom($menuAnchor, name, menuObj) {
                    $menuAnchor.html(menuObj.displayName || name);
                    if (!menuObj.action) {
                        $menuAnchor.addClass("disabled");
                    } else if ($.isFunction(menuObj.action)) {
                        $menuAnchor.attr("href", "javascript:;");
                        $menuAnchor.click(function() {
                            menuObj.action(context.ztreeObj, context.treeNode);
                            setPopupContextVisible(false);
                        });
                    } else {
                        registEventHandle(function(ztreeObj, treeNode, nodeType) {
                            $menuAnchor.attr("href", replaceExpression(menuObj.action, treeNode));
                        });
                        if (menuObj.target) {
                            $menuAnchor.attr("target", menuObj.target);
                        }
                    }
                }
            }


            function setPopupContextVisible(visible, x, y) {
                if (visible === true) {
                    $popupDom.css({
                        "top": y + "px",
                        "left": x + "px"
                    });
                    $popupDom.show();
                } else {
                    $popupDom.hide();
                }
            }

            /**
             * 注册树节点右击事件的前置拦截器.
             * <p>拦截器的方法签名为：
             * <pre>boolean handleFunctionName(Object ztreeObj,Object treeNode,String nodeType);</pre>
             * </p>
             * @param {function} handle 如上所述的方法
             */
            function registEventHandle(handle) {
                if ($.isFunction(handle)) {
                    handles.push(handle);
                } else {
                    window.alert(handle + " 不是方法！");
                }
            }

            var repAttr = /(?!attr\{)\w+(?=\})/g;
            function replaceExpression(text, treeNode) {
                var rtnTxt = text;
                var attrNames = rtnTxt.match(repAttr);
                if (attrNames) {
                    $.each(attrNames, function(i, attrName) {
                        var regexp = new RegExp("attr\\{" + attrName + "\\}", "g");
                        var attrValue = treeNode[attrName];
                        rtnTxt = rtnTxt.replace(regexp, attrName === "id" ? _getRealId(attrValue) : attrValue, "g");
                    });
                }
                return rtnTxt;

                function _getRealId(src, splitChar) {
                    if (!splitChar) {
                        splitChar = "_";
                    }
                    if (src) {
                        var j = src.lastIndexOf(splitChar);
                        if (j < 0) {
                            return src;
                        } else {
                            return src.substring(j + 1);
                        }
                    } else {
                        return src;
                    }
                }
            }

            return this;
        };
    });

})(jQuery);
