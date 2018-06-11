//== Class definition

var RoleModule = function () {
    //== Private functions
    //var ajaxUrl = "http://127.0.0.1:18081/auth/v1/api/";
    var checkboxRoleId = 0; //选中的roleId
    var modulezTreeObj;
    var ajaxUrl = commonUtil.ajaxUrl;
    var userToken = commonUtil.getUserToken();

    /**
     * 角色 grid
     */
    var roleTable = function () {
        layui.use('table', function(){
            var table = layui.table;
            //渲染table　数据
            table.render({
                elem: '#role_table_grid',
                url:ajaxUrl+"grid/role",
                headers: {'Authorization': userToken},//接口的请求头
                request: {
                    pageName: 'p.pageNum', //页码的参数名称，默认：page
                    limitName: 'p.pageSize' //每页数据量的参数名，默认：limit
                },
                response: {     //定义后端的json格式
                    statusName: 'status', //数据状态的字段名称，默认：code
                    statusCode: 0,//成功的状态码，默认：0
                    //msgName: 'message', //状态信息的字段名称，默认：msg
                    countName: 'totalElements', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                text: {
                    none: '暂无相关数据' //默认：无数据。注：该属性为 layui 2.2.5 开始新增
                },
                height: 'full-230',
                cellMinWidth: 80,//全局定义常规单元格的最小宽度
                cols: [[ //标题栏
                    {field: 'id', title: 'ID', sort: true},  ////width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度
                    {field: 'roleCode', title: '角色编号'},
                    {field: 'roleName', title: '角色名称'},
                    {field: 'authorizedSigns', title: '授权标识'},
                    {field: 'roleDescription', title: '角色描述'},
                    {field: 'statusText', title: '状态',  align: 'center', sort: true}
                ]],
                //even: true, //开启隔行背景
                initSort: {field:'createTime', type:'desc'}, //设置初始排序
                //skin: 'line', //表格风格
                page: true, //是否显示分页
                limits: [10, 20, 30,50],
                limit: 10, //每页默认显示的数量
                done: function(response, curr, count){   //数据渲染完的回调
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    console.log(" =============================== ")
                    console.log("role_module.js 获取角色grid data")
                    console.log(response);
                    console.log(" =============================== ")
                    var serverStatus = response.status;
                    toastr.clear();
                    if(serverStatus == -1){
                        //登陆超时，需要重新登陆系统
                        toastr.error(response.message);
                        toastr.info("即将跳转到登陆页面.");
                        window.location.href="../../../../login.html";
                    }else  if (response.status != 0){
                        toastr.error(response.message);
                    }
                    //得到当前页码
                    // console.log(curr);
                    //得到数据总量
                    //  console.log(count);
                }
            });

            //监听table tr 点击事件
            var $myRolelist = $("#role_table_grid").next('.layui-table-view').find('table.layui-table');

            $myRolelist.click(function(event){
                //移除已经选中行的样式
                $("table.layui-table .layui_table_tr_click").removeClass("layui_table_tr_click");
                //alert($(event.target).closest("tr")[0].outerHTML)
                var tr = $(event.target).closest("tr")[0];
                checkboxRoleId =　$(tr).children("td:first").find('div').text();
                //设置点击行样式
                $(tr).addClass("layui_table_tr_click");
                console.log(" =============================== ")
                console.log("role_module.js 选中角色ID ： " + checkboxRoleId);
                console.log(" =============================== ")
                moduleTreeData();
            });



            //刷新角色grid
            $('#role-grid-resh-btn').on('click', function() {
                //执行重载
                table.reload('role_table_grid', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });
            });

        });

    };


    /**
     *  资源 data
     */
    var moduleTreeData = function(){
        $.ajax({
            url:ajaxUrl+"module/tree/role/"+checkboxRoleId,
            headers : {'Authorization':userToken},
            type:'get',
            dataType:"json",
            success:function (response, status, xhr) {
                console.log(" =============================== ")
                console.log("role_module.js 获取 角色资源 data：" );
                console.log( response);
                console.log(" =============================== ")
                var serverStatus = response.status;
                toastr.clear();
                if(serverStatus == -1){
                    //登陆超时，需要重新登陆系统
                    toastr.error(response.message);
                    toastr.info("即将跳转到登陆页面.");
                    window.location.href="../../../../login.html";
                    return;
                }
                if (response.status != 0){
                    toastr.error(response.message);
                }else {
                    moduleTree(JSON.parse(response.data));
                }
            },
            error:function (response, status, xhr) {
                toastr.error("网络出现错误.");
            }
        })
    }


    /**
     * 资源菜单树组件
     */
    var moduleTree =  function (dataNodes) {
        // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        var setting = {
            data:{
                keep: {
                    parent: true,
                    leaf: true
                },
                simpleData:{
                    enable:true,
                    idKey:"id",
                    pIdKey:"pid",
                    rootPId:'0'
                }
            },
            showLine: true,
            view : {
                showIcon : false,
                selectedMulti : true,     //可以多选
                showLine : false,
                expandSpeed : 'fast',
                dblClickExpand : false
            },
            check : {
                enable: true,   //true / false 分别表示 显示 / 不显示 复选框或单选框
                //autoCheckTrigger: true,   //true / false 分别表示 触发 / 不触发 事件回调函数
                chkStyle: "checkbox",   //勾选框类型(checkbox 或 radio）
                chkboxType: { "Y": "ps", "N": "ps" }   //勾选 checkbox 对于父子节点的关联关系
            },
            callback : {
                onAsyncSuccess:onAsyncSuccess
            }
        };
        var zNodes = [
            {name:"test1", open:true, children:[
                    {name:"test1_1"}, {name:"test1_2"}]},
            {name:"test2", open:true, children:[
                    {name:"test2_1"}, {name:"test2_2"}]}
        ];
        modulezTreeObj = $.fn.zTree.init($("#module-tree"), setting, dataNodes);
       // modulezTreeObj = $.fn.zTree.init($("#module-tree"), setting);
    }

    /**
     *  ztree 数据加载完后事件
     * @param event
     * @param treeId
     */
    function  onAsyncSuccess(event, treeId) {
            //获得树形图对象
            var zTree = $.fn.zTree.getZTreeObj("module-tree");
            //获取根节点个数,getNodes获取的是根节点的集合
            var nodeList = zTree.getNodes();
            if (nodeList.length>0) {
                for(var i=0;i<nodeList.length;i++){
                    //展开第一级节点
                    zTree.expandNode(nodeList[i], true, false, false);
                }
            }
    }


    /**
     * 保存分配的资源菜单信息
     */
    var saveRoleModule = function () {
        $('#module-tree-save-btn').click(function(e) {

            e.preventDefault();
            var btn = $(this);

            if(checkboxRoleId == 0){
                swal("请选择角色数据!");
                return;
            }

            var selectModuleIds = new Array();
            var ztree = $.fn.zTree.getZTreeObj('module-tree');
            var nodes = ztree.getCheckedNodes(true);
            if (nodes.length != 0) {
                for (var i = 0; i < nodes.length; i++) {
                    selectModuleIds.push(nodes[i].id);
                }
            }else {
                swal("请选择要分配的菜单资源!");
                return;
            }
            console.log(" =============================== ")
            console.log("role_module.js 选中的资源id："+ selectModuleIds.toString());
            console.log(" =============================== ")



           //添加遮罩层
            mApp.block('#ztree-content', {
                overlayColor: '#000000',
                type: 'loader',
                state: 'primary',
                message: '数据处理中.....'

            });
            $(".blockUI.blockMsg.blockElement").css("padding-left","35%");

            $.ajax({
                url: ajaxUrl+'roleModule/batch/post',
                data : {
                    roleId:checkboxRoleId,
                    moduleIds:selectModuleIds.toString()
                },
                type:"post",
                dataType:"json",
                headers: {'Authorization': userToken},
                success: function(response, status, xhr) {
                    var serverStatus = response.status;
                    toastr.clear();
                    if(serverStatus == -1){
                        //登陆超时，需要重新登陆系统
                        toastr.error(response.message);
                        toastr.info("即将跳转到登陆页面.");
                        window.location.href="../../../../login.html";
                    }else  if (response.status != 0){
                        toastr.error(response.message);
                    }else {
                        toastr.success("分配资源成功.");
                    }
                    //移除遮罩层
                    mApp.unblock('#ztree-content');
                },
                error:function (response, status, xhr) {
                    toastr.error("网络出现错误.");
                    //移除遮罩层
                    mApp.unblock('#ztree-content');
                }
            });


        });
    };

    /**
     * 刷新树事件
     */
    var refreshZtreeBtn =  function () {
        $('#module-tree-resh-btn').click(function(e) {
            e.preventDefault();
            var btn = $(this);

            if (checkboxRoleId == 0) {
                swal("请选择角色数据!");
                return;
            }
            moduleTreeData();
        });
    }


    return {
        // public functions
        init: function () {
            roleTable();
            moduleTreeData();
            saveRoleModule();
            refreshZtreeBtn();
        }
    };
}();

jQuery(document).ready(function () {
    RoleModule.init();
});