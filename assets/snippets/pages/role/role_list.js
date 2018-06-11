//== Class definition

var Role = function () {
    //== Private functions
   // var ajaxUrl = "http://127.0.0.1:18081/auth/v1/api/";
    //var userToken = JSON.parse(sessionStorage.getItem('user_token'));
    var ajaxUrl = commonUtil.ajaxUrl;
    var userToken = commonUtil.getUserToken();

    /**
     *  初始化Table组件
     */
    var  roleTableGrid = function( ){
        layui.use('table', function(){
            var table = layui.table;
            //展示已知数据
            table.render({
                elem: '#role_table',
                url:ajaxUrl+"grid/role",
                headers: {'Authorization': userToken},//接口的请求头
                request: {
                    pageName: 'p.pageNum', //页码的参数名称，默认：page
                    limitName: 'p.pageSize' //每页数据量的参数名，默认：limit
                },
                response: {     //定义后端的json格式
                    statusName: 'status', //数据状态的字段名称，默认：code
                    statusCode: 0,//成功的状态码，默认：0
                    msgName: 'message', //状态信息的字段名称，默认：msg
                    countName: 'totalElements', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                height: 'full-230',
                cellMinWidth: 80,//全局定义常规单元格的最小宽度
                cols: [[ //标题栏
                    {field: 'id', title: 'ID', sort: true},  ////width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度
                    {field: 'roleCode', title: '角色编号'},
                    {field: 'roleName', title: '角色名称'},
                    {field: 'authorizedSigns', title: '授权标识'},
                    {field: 'roleDescription', title: '角色描述'},
                    {field: 'createTime', title: '创建时间', sort: true},
                    {field: 'createUserName', title: '创建人'},
                    {field: 'updateTime', title: '更新时间', sort: true},
                    {field: 'updateUserName', title: '更新人'},
                    {field: 'statusText', title: '状态',  align: 'center', sort: true},
                    {fixed: 'right', width:150, align:'center', toolbar: '#barDemo'}
                ]],
                even: true, //开启隔行背景
                initSort: {field:'createTime', type:'desc'}, //设置初始排序
                //skin: 'line', //表格风格
                page: true, //是否显示分页
                limits: [10, 20, 30,50],
                limit: 10, //每页默认显示的数量
                done: function(response, curr, count){   //数据渲染完的回调
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    console.log(" =============================== ")
                    console.log("role_list.js 获取角色grid data")
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


            //监听工具条
            table.on('tool(role_tr_toolbar)', function(obj){
                var data = obj.data;
                if(obj.event === 'del'){
                    layer.confirm('真的删除吗?', function(index){
                        deleteRoleEvent(data.id,obj);
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    layer.alert('编辑行：<br>'+ JSON.stringify(data))
                }
            });


            // 新增窗口show 后触发
            $('#m_blockui_4_5_modal').on('show.bs.modal', function () {
                var roleCode = commonUtil.randomNumber();
                $("#role-code").val(roleCode);
            });

            // form 关闭后触发
            $('#m_blockui_4_5_modal').on('hidden.bs.modal', function () {
                var layuiTable = layui.table;
                //刷新 grid
                layuiTable.reload('role_table_grid', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });
            });

        });
    }

    /**
     * 删除事件
     */
    var  deleteRoleEvent = function (id,obj) {
        mApp.block('#role_table', {
            overlayColor: '#000000',
            type: 'loader',
            state: 'primary',
            message: '数据处理中.....'

        });

        $.ajax({
            url: ajaxUrl+'role/del/single',
            data : {
                id:id,
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
                    toastr.success("删除角色成功.");
                    //移除grid 行
                    obj.del();
                }
                //移除遮罩层
                mApp.unblock('#role_table');
            },
            error:function (response, status, xhr) {
                toastr.error("网络出现错误.");
                //移除遮罩层
                mApp.unblock('#role_table');
            }
        });
    }

    //角色 表单
    var roleFrom = function () {
        $('#m_blockui_4_5').click(function(e) {

            e.preventDefault();
            var btn = $(this);
            var form = $("#role_form_1");

            form.validate({
                rules: {
                    roleCode: {
                        required: true
                    },
                    roleName: {
                        required: true
                    },
                    authorizedSigns: {
                        required: true
                    },

                },
                messages: {
                    roleCode: {
                        required: "请输入角色编号."
                    },
                    roleName: {
                        required: "请输入角色名称."
                    },
                    authorizedSigns: {
                        required: "请输入授权标识"
                    },
                }
            });

            if (!form.valid()) {
                return;
            }

           //添加遮罩层
            mApp.block('#m_blockui_4_5_modal .modal-content', {
                overlayColor: '#000000',
                type: 'loader',
                state: 'primary',
                message: '数据处理中.....'

            });
            $(".blockUI.blockMsg.blockElement").css("padding-left","35%");

            form.ajaxSubmit({
                url: ajaxUrl+'role/post',
                type:"post",
                dataType:"json",
                //clearForm: true        // 成功提交后，清除所有的表单元素的值.
                resetForm: true,       // 成功提交后，重置所有的表单元素的值.
                //添加额外的请求头
                headers : {'Authorization':userToken},
                //由于某种原因,提交陷入无限等待之中,timeout参数就是用来限制请求的时间,
                //当请求大于3秒后，跳出请求.
                //timeout:   3000
                success: function(response, status, xhr, $form) {
                    var serverStatus = response.status;
                    toastr.clear();
                    if(serverStatus == -1){
                        //登陆超时，需要重新登陆系统
                        toastr.error(response.message);
                        toastr.info("即将跳转到登陆页面.");
                        window.location.href="../../../../login.html";
                    }else  if (response.status != 0){
                        setRoleCode();
                        toastr.error(response.message);
                    }else {
                        setRoleCode();
                        toastr.success("保存角色成功.");
                    }
                    //移除遮罩层
                    mApp.unblock('#m_blockui_4_5_modal .modal-content');
                },
                error:function (response, status, xhr) {
                    toastr.error("网络出现错误.");
                    //移除遮罩层
                    mApp.unblock('#m_blockui_4_5_modal .modal-content');
                }
            });
            return false;

        });
    }
    
    var setRoleCode = function () {
        var roleCode = commonUtil.randomNumber();
        $("#role-code").val(roleCode);
    }

    return {
        // public functions
        init: function () {
            roleFrom();
            roleTableGrid();
        }
    };
}();

jQuery(document).ready(function () {
    Role.init();
});