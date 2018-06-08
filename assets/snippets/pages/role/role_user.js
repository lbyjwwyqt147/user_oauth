//== Class definition

var RoleUser = function () {
    //== Private functions
    //var ajaxUrl = "http://127.0.0.1:18081/auth/v1/api/";
    var ajaxUrl = commonUtil.ajaxUrl;
    var userToken = commonUtil.getUserToken();
    var checkboxRoleId = 0; //选中的roleId


    /**
     *    角色 grid
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
                height: 'full-120',
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
                    console.log("role_user.js 获取角色grid data")
                    console.log(response);
                    console.log(" =============================== ")
                    toastr.clear();
                    var serverStatus = response.status;
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
            var $roleTablelist = $("#role_table_grid").next('.layui-table-view').find('table.layui-table');

            $roleTablelist.click(function(event){
                //移除已经选中行的样式
                $("table.layui-table .layui_table_tr_click").removeClass("layui_table_tr_click");
                //alert($(event.target).closest("tr")[0].outerHTML)
                var tr = $(event.target).closest("tr")[0];
                checkboxRoleId =　$(tr).children("td:first").find('div').text();
                //设置点击行样式
                $(tr).addClass("layui_table_tr_click");
                console.log(" =============================== ")
                console.log("role_user.js 选中角色ID ： " + checkboxRoleId);
                console.log(" =============================== ")
                //加载已分配table数据
                table.reload('be-authorized-userGrid', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where:{   //设定异步数据接口的额外参数
                        roleId:checkboxRoleId
                    }
                });
                //加载未分配table数据
                table.reload('unauthorized-userGrid', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where:{   //设定异步数据接口的额外参数
                        roleId:checkboxRoleId
                    }
                });
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

            $('#open_user_table').on('click', function() {
                if(checkboxRoleId == 0){
                    $(this).removeAttr("data-target");
                    swal("请选择角色!");
                    return ;
                }else {
                    $(this).attr("data-target","#m_blockui_4_5_roleuser_modal");
                }
            });




        });
    };


    /**
     *  已经授权的 user Grid
     */
    var beAuthorizedUserGrid = function () {

        layui.use('table', function(){
            var table = layui.table;
            //渲染table　数据
            table.render({
                elem: '#be-authorized-userGrid',
                url:ajaxUrl+"grid/role/user/have",
                where:{   //设定异步数据接口的额外参数
                    roleId:checkboxRoleId
                },
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
                height: 'full-120',
                cellMinWidth: 80,//全局定义常规单元格的最小宽度
                cols: [[ //标题栏
                    {type:'checkbox'},
                    {field: 'id', title: 'ID', sort: true},  ////width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度
                    {field: 'userName', title: '姓名'},
                    {field: 'userEmail', title: '邮箱'}
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
                    console.log("role_user.js 获取角色已经授权的 user Grid grid data")
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

            /**
             * 监听复选框事件
             */
            table.on('checkbox(userHaveGrid)', function(obj){

            });

        });

    }

    /**
     *  未授权的 user Grid
     */
    var unauthorizedUserGrid =  function () {

        layui.use('table', function(){
            var table = layui.table;
            //渲染table　数据
            table.render({
                elem: '#unauthorized-userGrid',
                url:ajaxUrl+"grid/role/user/not",
                where:{   //设定异步数据接口的额外参数
                    roleId:checkboxRoleId
                },
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
                height: 'full-200',
                cellMinWidth: 80,//全局定义常规单元格的最小宽度
                cols: [[ //标题栏
                    {type:'checkbox'},
                    {field: 'id', title: 'ID', sort: true,width:80},  ////width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度
                    {field: 'userName', title: '姓名', width: 150},
                    {field: 'userEmail', title: '邮箱',width:220}
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
                    console.log("role_user.js 获取角色未授权的 user Grid grid data")
                    console.log(response);
                    console.log(" =============================== ")
                    toastr.clear();
                    var serverStatus = response.status;
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

            /**
             * 监听复选框事件
             */
            table.on('checkbox(userNotHaveGrid)', function(obj){

            });


        });

        $(".modal-dialog").css("width","600px");
        $(".modal-content").css("width","600px");

    }


    /**
     *  删除角色分配的人员
     */
    var  deleteRoleUser = function () {
        $('#delete-user-btn').click(function(e) {

            e.preventDefault();
            var btn = $(this);
            var selectDeleteUserIds = [];
            //获取已授权用户grid 选中数据
            var layuiTable = layui.table;
            var checkStatus = layuiTable.checkStatus('be-authorized-userGrid')
            var dataTable = checkStatus.data;
            if ( dataTable.length > 0) {
                $.each(dataTable,function(i,v){
                    selectDeleteUserIds.push(v.id);
                })
            }else {
                swal("请选择要删除的数据!");
                return;
            }


            //添加遮罩层
            mApp.block('#be-authorized-userGrid', {
                overlayColor: '#000000',
                type: 'loader',
                state: 'primary',
                message: '数据处理中.....'

            });
            $(".blockUI.blockMsg.blockElement").css("padding-left","35%");

            $.ajax({
                url: ajaxUrl+'userRole/del',
                data : {
                    roleId:checkboxRoleId,
                    userIds:selectDeleteUserIds.toString(),
                    _method: 'DELETE'
                },
                type:"POST",
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
                        toastr.success("移除分配人员成功.");
                        reloadUserGrid();
                    }
                    //移除遮罩层
                    mApp.unblock('#be-authorized-userGrid');
                },
                error:function (response, status, xhr) {
                    toastr.error("网络出现错误.");
                    //移除遮罩层
                    mApp.unblock('#be-authorized-userGrid');
                }
            });

        });
    }

    /**
     *   保存分配的人员信息
     */
    var saveRoleUser = function () {
        $('#m_blockui_4_5_roleuser').click(function(e) {

            e.preventDefault();
            var btn = $(this);


            var selectAllocationUserIds = [];
            //获取未授权用户grid 选中数据
            var layuiTable = layui.table;
            var checkStatus = layuiTable.checkStatus('unauthorized-userGrid')
            var dataTable = checkStatus.data;
            if ( dataTable.length > 0) {
                $.each(dataTable,function(i,v){
                    selectAllocationUserIds.push(v.id);
                })
            }else {
                return;
            }

           //添加遮罩层
            mApp.block('#m_blockui_4_5_roleuser_modal .modal-content', {
                overlayColor: '#000000',
                type: 'loader',
                state: 'primary',
                message: '数据处理中.....'

            });
            $(".blockUI.blockMsg.blockElement").css("padding-left","35%");

            $.ajax({
                url: ajaxUrl+'roleUser/batch/post',
                data : {
                    roleId:checkboxRoleId,
                    userIds:selectAllocationUserIds.toString()
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
                        toastr.success("分配人员成功.");
                        //关闭弹出窗口
                        $('#m_blockui_4_5_roleuser_modal').modal('hide');
                        reloadUserGrid();
                    }
                    //移除遮罩层
                    mApp.unblock('#m_blockui_4_5_roleuser_modal .modal-content');
                },
                error:function (response, status, xhr) {
                    toastr.error("网络出现错误.");
                    //移除遮罩层
                    mApp.unblock('#m_blockui_4_5_roleuser_modal .modal-content');
                }
            });

        });
    }

    /**
     * 重载用户grid 数据
     */
    var reloadUserGrid = function(){
        var layuiReloadTable = layui.table;
        //加载已分配table数据
        layuiReloadTable.reload('be-authorized-userGrid', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where:{   //设定异步数据接口的额外参数
                roleId:checkboxRoleId
            }
        });
        //加载未分配table数据
        layuiReloadTable.reload('unauthorized-userGrid', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where:{   //设定异步数据接口的额外参数
                roleId:checkboxRoleId
            }
        });
    }

    return {
        // public functions
        init: function () {
            roleTable();
            beAuthorizedUserGrid();
            unauthorizedUserGrid();
            saveRoleUser();
            deleteRoleUser();
        }
    };
}();

jQuery(document).ready(function () {
    RoleUser.init();
});