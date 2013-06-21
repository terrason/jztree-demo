<%-- 
    Document   : error
    Created on : 2011-12-12, 13:46:16
    Author     : LEE
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <link href="${servletPath}${webConfig.namespace}${webConfig.cssPackage}/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="${servletPath}${webConfig.namespace}${webConfig.jqueryUrl}"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                $(":button.cancel").click(function(){
                        window.top.close();
                });
            });
        </script>
        <title>Jztree操作出错</title>
    </head>
    <body>
        <div class="alert alert-error">
            <h3>Jztree操作出错！</h3>${exception}
        </div>
        <div class="navbar navbar-fixed-bottom">
            <div class="navbar-inner">
                <div class="text-center">
                    <button id="cancelBtn" type="button" class="btn btn-primary cancel">确定</button>
                </div>
              </div>
        </div>
    </body>
</html>
