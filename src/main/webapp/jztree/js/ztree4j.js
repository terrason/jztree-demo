var HEIGHT=480;
var WIDTH=360;
/**
 * jztree 工具.  负责与服务器端通讯，其实可以自行组装js访问selection.tree.
 */

var Jztree={
    DEFAULT_SERVLET_NAMESPACE   :   "/",    //※ jztree的Servlet上下文路径.必须以"/"开始以"/"结束，表示相对于ServletContextPath的URL
    DEFAULT_TREE                :   "jztree-tree-demo",
    DEFAULT_SCHEME              :   "jztree-scheme-default",
    OPERATION_SELECTION         :   "selection.tree",
    OPERATION_ASYNCHRONY        :   "ajaxNode.tree",

    /**
     * 以模态方式打开zTree树形选择窗口.
     * @param option Object类型，选择器窗口的配置参数.（属性不能包含中文字符和特殊符号）
     * <ul>
     * <li>option.treeName——<strong>业务树名称</strong>.默认为<code>"jztree-tree-default"</code></li>
     * <li>option.async——<strong>使用异步加载模式</strong>.Boolean值 默认为<code>false</code></li>
     * <li>option.checkStyle——<strong>选择方式</strong>.<ul style="font-size:9px;"><li><code>checkbox</code>：多选（默认）</li><li><code>radio</code>：单选</li><li><code>none</code>：没有选择框</li></ul>
     * <li>option.selectPattern——<strong>模式</strong>.<ul style="font-size:9px;"><li><code>leaf</code>：只选择叶节点（默认）</li><li><code>parent</code>：只选择枝节点</li><li><code>both</code>：全部允许选择</li></ul></li>
     * <li>option.returnType——<strong>返回值类型</strong>.<ul style="font-size:9px;"><li><code>string</code>：返回值是一个对象，这个对象包含<code>ids</code>和<code>names</code>两个属性，这两个属性都是以<em>英文逗号（","）</em>连接的字符串，分别表示选中的节点id和name。（默认）</li><li><code>array</code>：所选中的节点对象数组</li></ul></li>
     * <li>option.*diy*——<strong>任意自定义参数</strong></li>
     * </ul>
     * @param extensions Object类型，高级扩展. 本参数的详细说明参照<cite>zTree setting配置详解</cite>
     * @return 选中的节点数组或字符串信息
     */
    select:function(option,extensions){
        var contextPath=this._getContextPath()+this.DEFAULT_SERVLET_NAMESPACE+this.OPERATION_SELECTION;
        var time=new Date().getTime();
        var url=contextPath+"?ts="+time+"&modal=true";
        var height=HEIGHT;
        var width=WIDTH;
        var winArg={
            option:option,
            extensions:extensions
        };
        return window.showModalDialog(url,winArg,"dialogwidth:"+width+"px;dialogheight:"+height+"px;center:yes;resizable:no;scroll:no");
    },
    
    /**
    * 获取ContextPath
    * @return 格式为xxxx://xxx.xxxxx.xx/xxxx
    */ 
    _getContextPath:function () {
        var location = document.location.toString();
        var contextPath = "";
        if(location.indexOf("://") !== -1) {
            contextPath += location.substring(0, location.indexOf("//") + 2);
            location = location.substring(location.indexOf("//") + 2, location.length);
        }
        var index = location.indexOf("/");
        contextPath += location.substring(0, index+1);
        //部署在根目录下时，删除下面3句！
        location = location.substring(index+1);
        index = location.indexOf("/");
        contextPath += location.substring(0, index);
	
        return contextPath;
    }
};