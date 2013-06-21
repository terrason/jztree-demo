<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="${servletPath}${webConfig.namespace}${webConfig.cssPackage}/zTreeStyle.css" rel="stylesheet" type="text/css" />
        <link href="${servletPath}${webConfig.namespace}${webConfig.cssPackage}/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="${servletPath}${webConfig.namespace}${webConfig.jqueryUrl}"></script>
        <script type="text/javascript" src="${servletPath}${webConfig.namespace}${webConfig.jsPackage}/jquery.ztree.core-3.x.min.js"></script>
        <script type="text/javascript" src="${servletPath}${webConfig.namespace}${webConfig.jsPackage}/jquery.ztree.excheck-3.x.min.js"></script>
        <script type="text/javascript" src="${servletPath}${webConfig.namespace}${webConfig.jsPackage}/jquery.jztree.js"></script>
        <title>zTree 选择器</title>
        <script type="text/javascript">
            var ztreeObj;
            
            $(document).ready(function(){
                var arg=window.dialogArguments || {};
                var _option={checkStyle:"checkbox",selectPattern:"leaf",returnType:"string"};
                $.extend(true,_option,arg.option || {});
                ztreeObj=$("#ztree").jztree(_option,arg.extensions);
                
                $("button").hover(function(){
                    $(this).addClass("highlight");
                }, function(){
                    $(this).removeClass("highlight");
                });
                $("#cancelBtn").click(function(){
                        window.top.close();
                });
                $("#okBtn").click(function(){
                    var selectedNodes=ztreeObj.getCheckedNodes();
                    var ids="";
                    var names="";
                    var nodes=[];
                    $.each(selectedNodes,function(i,node){
                        var selectable=false;
                        if(_option.selectPattern==="both"){
                            selectable= true;
                        }else if(_option.selectPattern==="parent"){
                            selectable=!(ztreeObj.getNodeType(node) === "leaf");
                        }else{
                            selectable=(ztreeObj.getNodeType(node) === "leaf");
                        }
                        if(selectable){
                            ids+=(_getRealId(node.id)+",");
                            names+=(node.name+",");
                            node.parentNode=node.getParentNode();
                            nodes.push(node);
                        }
                    });
                    if(nodes.length===0){
                        if(!window.confirm("您没有选中任何有效节点！")){
                            return ;
                        }
                    }
                    ids=ids.substring(0,ids.length-1);
                    names=names.substring(0,names.length-1);
                    
                    if(_option.returnType==="array"){
                        window.returnValue=nodes;
                    }else{
                        var rtn={
                            ids:ids,
                            names:names
                        };
                        window.returnValue=rtn;
                    }
                    window.close();
                });
                
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
            });
        </script>
    </head>
    <body>
        <ul style="margin-bottom:40px;" id="ztree" class="ztree"></ul>
        <div class="navbar navbar-fixed-bottom">
            <div class="navbar-inner">
                <div class="text-center">
                    <button id="okBtn" type="button" class="btn btn-primary">确定</button>
                    <button id="cancelBtn" type="button" class="btn">取消</button>
                </div>
              </div>
        </div>
    </body>
</html>
