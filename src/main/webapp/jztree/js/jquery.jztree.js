(function($){
    if(!$){
        return ;
    }
    var OPERATION_AJAXBINDIND="/ajaxBinding.tree";
    var OPERATION_ASYNCHRONY="/ajaxNode.tree";
    var DEFAULT_TREENAME="jztree-tree-demo";
    var DEFAULT_TARGET="subframe";
    var DEFAULT_ANCHOR_APPLY="both";
    
    jQuery.fn.extend({
        "jztree":
        /**
         *绑定jztree到一个DOM上. 简化了ztree的配置，同时与后台jztree-core.jar代码集成。
         *@param option Object类型 详细配置信息如下：
         *<ul style="margin-top:0px;">
         *  <li>option.treeName——<strong>业务树名称</strong>.</li>
         *  <li>option.async——<strong>启用异步加载</strong>.Boolean值，默认为<code>false</code>。</li>
         *  <li>option.checkStyle——<strong>选择方式</strong>.<ul style="font-size:9px;margin-top:0px;margin-bottom:4px"><li><code>checkbox</code>：多选</li><li><code>radio</code>：单选</li><li><code>none</code>：没有选择框（默认）</li></ul></li>
         *  <li>option.anchorUrl——<strong>超链接地址</strong>.默认不带有超链接</li>
         *  <li>option.anchorTarget——<strong>超链接Target属性</strong>.默认为<code>"subframe"</code></li>
         *  <li>option.anchorApply——<strong>赋予超链接的模式</strong>.<ul style="font-size:9px;margin-top:0px;margin-bottom:4px"><li><code>leaf</code>：只有叶节点带超链接</li><li><code>parent</code>：只有枝节点带超链接</li><li><code>both</code>：全部带超链接（默认）</li></ul></li>
         *  <li>option.*diy*——<strong>任意自定义参数</strong></li>
         *  </ul>
         * @param extensions Object类型，高级扩展. 本参数的详细说明参照<cite>zTree setting配置详解</cite>。
         *@return <strong>zTreeObj对象</strong>（服务器处理出错时返回<code>null</code>）.
         **/
        function jztree(option,extensions){
            var $this=$(this);
            if(!$this.hasClass("ztree")){
                $this.addClass("ztree");
            }
            var postData={
                treeName:DEFAULT_TREENAME,
                anchorTarget:DEFAULT_TARGET,
                anchorApply:DEFAULT_ANCHOR_APPLY
            };
            $.extend(postData, option);
            var nodes;
            var setting;
            var ajaxBindingError=true;
            $.ajax({
                url     :   _getContextPath()+OPERATION_AJAXBINDIND,
                type    :   "post",
                async   :   false,
                cache   :   false,
                data    :   postData,
                success :   function(data,textStatus){
                    try{
                        var rtnVal=eval("(" + data + ")");
                        nodes=rtnVal.nodes;
                        setting=rtnVal.setting;
                        if(!nodes || !setting){
                            window.alert("服务器处理出错！n");
                        }else{
                            ajaxBindingError=false;
                        }
                    }catch(e){
                        window.alert("服务器处理出错！\n"+data);
                    }
                }
            });
            if(ajaxBindingError){
                return null;
            }
            _merge(setting,postData);
            $.extend(true,setting,extensions);
            var ztree=$.fn.zTree.init($this, setting, nodes);
            ztree.getNodeType=function(treeNode){
                if(treeNode.getParentNode()===null){
                    return "root";
                }else if(treeNode.children && treeNode.children.length>0){
                    return "branch";
                }else if(treeNode.isParent && (!treeNode.children || treeNode.children.length===0)){
                    return "empty";
                }else{
                    return "leaf";
                }
            };
            
            if(postData.anchorUrl){
                $.each(ztree.transformToArray(ztree.getNodes()),function(i,node){
                    if(node.url===undefined && _linkable(node, postData.anchorApply,ztree.getNodeType)){
                        var url=postData.anchorUrl;
                        var attrNames=_getAttributeNamesFromExpression(url);
                        $.each(attrNames,function(i,attrName){
                            var regexp=new RegExp("attr\\{"+attrName+"\\}", "g");
                            var attrValue=node[attrName];
                            url=url.replace(regexp, attrName==="id"?_getRealId(attrValue):attrValue, "g");
                        });
                        node.url=url;
                        if(node.target===undefined){
                            node.target=postData.anchorTarget;
                        }
                        ztree.updateNode(node);
                    }
                });
            }
            
            var rootNodes=ztree.getNodes();
            $.each(rootNodes,function(i,root){
                ztree.expandNode(root,true);
            });
            return ztree;
        }
    });
    
    function _merge(setting,option){
        if(option.async){
            var async ={
                enable: true,
                autoParam: ["id=parentId"],
                url: _getContextPath()+OPERATION_ASYNCHRONY
            };
            setting.async=async;
        }
        if(option.checkStyle && option.checkStyle!=="none"){
            var check={
                enable: true,
                radioType: "all",
                chkStyle:option.checkStyle
            };
            setting.check=check;
        }
        if(option.selectPattern){
            setting.selectPattern=option.selectPattern;
        }
    }
    function _linkable(node,pattern,nodeType){
        if(pattern==="both"){
            return true;
        }else if(pattern==="parent"){
            return nodeType(node) !=="leaf";
        }else{
            return nodeType(node)==="leaf";
        }
    }
    function _getAttributeNamesFromExpression(url){
        var regexp=/(?!attr\{)\w+(?=\})/g;
        return url.match(regexp);
    }
    /**
         * 获取ContextPath
         * @return 格式为xxxx://xxx.xxxxx.xx/xxxx
         */ 
    function _getContextPath() {
        var location = document.location.toString();
        var contextPath = "";
        if(location.indexOf("://") !== -1) {
            contextPath += location.substring(0, location.indexOf("//") + 2);
            location = location.substring(location.indexOf("//") + 2, location.length);
        }
        var index = location.indexOf("/");
        contextPath += location.substring(0, index+1);
        location = location.substring(index+1);
        index = location.indexOf("/");
        contextPath += location.substring(0, index);
	
        return contextPath;
    }
    function _getRealId(src,splitChar){
        if(!splitChar){
            splitChar="_";
        }
        if(src){
            var j=src.lastIndexOf(splitChar);
            if(j<0){
                return src;
            }else{
                return src.substring(j+1);
            }
        }else{
            return src;
        }
    }
})(jQuery);