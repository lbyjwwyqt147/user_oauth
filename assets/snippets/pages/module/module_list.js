//== Class definition

var Module = function () {
    //== Private functions
    var ajaxUrl = commonUtil.ajaxUrl;
    var userToken = commonUtil.getUserToken();

    /**
     *  treeGridData
     */
    var treeGridData = function(){
        $.ajax({
            url:ajaxUrl+"module/tree/grid",
            headers : {'Authorization':userToken},
            type:'get',
            dataType:"json",
            success:function (response, status, xhr) {
                var serverStatus = response.status;
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
                    treeTable(JSON.parse(response.data));
                }
            },
            error:function (response, status, xhr) {
                toastr.error("网络出现错误.");
            }
        })
    }

    /**
     *  treegrid
     */
    var treeTable = function (treeData) {
        // treeGrid
        $('#module-tree-grid').treegrid({
            data: treeData,
            method: 'get',
            lines: true,
            rownumbers: true,
            idField:'id',
            treeField:'moduleName',
            columns:[[
                {field:'moduleName',title:'名称',width:150},
                {field:'moduleCode',title:'编码',width:120},
                {field:'moduleType',title:'类型',width:120,formatter: function(value,row,index){
                        if (value == 1){
                            return "目录";
                        } else if (value == 2) {
                            return "菜单";
                        }else {
                            return "按钮"
                        }
                    }},
                {field:'menuIcon',title:'图标',width:200},
                {field:'menuUrl',title:'URL',width:300},
                {field:'status',title:'状态',width:100,formatter: function(value,row,index){
                        if (value == 0){
                            return "禁用中";
                        } else {
                            return "使用中";
                        }
                    }},
                {field:'createTime',title:'创建时间',width:150},
                {field:'createUserName',title:'创建人',width:120},
                {
                    title: '操作',
                    field: 'cz',
                    width: 100,
                    align: 'center',
                    formatter: function (value,row,index) {
                        return '<a class="layui-btn layui-btn-danger layui-btn-xs" href="javaScript:Module.delete('+row.id+')"><i class="layui-icon">&#xe640;</i>删除</a>';
                    }
                }

            ]],
            onLoadError:function(res){
            },
            onLoadSuccess:function (row, data) {
            },
            onBeforeLoad:function(request) {
            },
        });

    }


    /**
     * 获取　combotree 数据
     */
    var combotreeData = function(){

        $.ajax({
            url:ajaxUrl+"module/tree/combotree/0",
            headers : {'Authorization':userToken},
            type:'get',
            dataType:"json",
            success:function (response, status, xhr) {
                var serverStatus = response.status;
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
                    initCombotree(JSON.parse(response.data));
                }
            },
            error:function (response, status, xhr) {
                toastr.error("网络出现错误.");
            }
        })


    }

    /**
     * 初始化　combotree　组件
     * @param treeData　　tree数据
     */
    var initCombotree = function(treeData){

        $('#module-pid').combotree({
            data: treeData,
            method:'GET'
        });

        $(".textbox").css("width","100%")
        $(".combo-arrow").css("height","35px");
        $(".validatebox-readonly").css({
            "height":"34px",
            "line-height": "34px",
            "width": "100%"
        });
        $('#module-pid').combotree('setValue', '0');
    }


    /**
     * 删除事件
     */
    var  deleteModule = function (id) {
        layer.confirm('真的删除吗?', function(index){
            //添加遮罩层
            mApp.block('#module-tree-grid', {
                overlayColor: '#000000',
                type: 'loader',
                state: 'primary',
                message: '数据处理中.....'

            });

            $.ajax({
                url: ajaxUrl+'module/del/single',
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
                        toastr.success("删除资源成功.");
                        //移除grid 行
                        var node = $('#module-tree-grid').treegrid('getSelected');
                        if (node){
                            $('#module-tree-grid').treegrid('remove', node.id);
                        }
                    }
                    //移除遮罩层
                    mApp.unblock('#module-tree-grid');
                },
                error:function (response, status, xhr) {
                    toastr.error("网络出现错误.");
                    //移除遮罩层
                    mApp.unblock('#module-tree-grid');
                }
            });
            layer.close(index);
        });
    }

    /**
     * 资源 表单
     */
    var moduleFrom = function () {

        // 新增窗口show 后触发
        $('#m_blockui_4_5_modal').on('show.bs.modal', function () {
            var moduleCode = commonUtil.randomNumber();
            $("#module-code").val(moduleCode);
        });

        // form 关闭后触发
        $('#m_blockui_4_5_modal').on('hidden.bs.modal', function () {
            // 执行一些动作...
            $(".form-control-feedback").remove();
            $('#module-pid').combotree('clear');
            //重置表单
            $("#module_form_1")[0].reset();
            //刷新 treeGrid
            treeGridData();
        });

        $('#m_blockui_4_5').click(function(e) {

            e.preventDefault();
            var btn = $(this);
            var form = $("#module_form_1");

            form.validate({
                rules: {
                    modulePid: {
                        required: true
                    },
                    moduleName: {
                        required: true
                    }
                },
                messages: {
                    modulePid: {
                        required: "请选择所属资源."
                    },
                    moduleName: {
                        required: "请输入资源名称."
                    }
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
                url: ajaxUrl+'module/post',
                type:"post",
                dataType:"json",
                //clearForm: true        // 成功提交后，清除所有的表单元素的值.
                resetForm: true ,       // 成功提交后，重置所有的表单元素的值.
                //由于某种原因,提交陷入无限等待之中,timeout参数就是用来限制请求的时间,
                //当请求大于3秒后，跳出请求.
                //timeout:   3000
                headers : {'Authorization':userToken},
                success: function(response, status, xhr, $form) {
                    var serverStatus = response.status;
                    toastr.clear();
                    if(serverStatus == -1){
                        //登陆超时，需要重新登陆系统
                        toastr.error(response.message);
                        toastr.info("即将跳转到登陆页面.");
                        window.location.href="../../../../login.html";
                    }else  if (response.status != 0){
                        setModuleCode();
                        toastr.error(response.message);
                    }else {
                        toastr.success("保存资源成功.");
                        //刷新 comboxTree
                        $('#module-pid').combotree('clear');
                        combotreeData();
                        setModuleCode();
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

        });
    }

    var setModuleCode = function(){
        var moduleCode = commonUtil.randomNumber();
        $("#module-code").val(moduleCode);
    }

    return {
        // public functions
        init: function () {
            treeGridData();
            combotreeData();
            moduleFrom();
        },
        delete: function (id) {
            deleteModule(id);
        }
    };
}();

jQuery(document).ready(function () {
    Module.init();
    layui.use('layer', function(){
        var lay = layui.layer;
    });
});