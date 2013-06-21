<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>JztreeDemo</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="css/bootstrap.css" rel="stylesheet" media="screen"/>
    </head>
    <body>
        <table class="table table-bordered">
            <caption>示例列表</caption>
            <thead>
                <tr><th>序号</th><th>名称</th><th>价格</th></tr>
            </thead>
            <tbody>
                <c:forEach begin="0" end="7" varStatus="status">
                    <tr>
                        <td>${status.count}</td><td>${param.node}</td><td>￥${fn:length(param.node)*13.5*status.count}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </body>
</html>
