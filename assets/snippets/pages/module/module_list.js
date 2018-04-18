//== Class definition

var Module = function () {
    //== Private functions
    var ajaxUrl = "http://127.0.0.1:18081/oauth/v1/api/";

    // treeGrid
    var treeTable = function () {
        // treeGrid
        $('#module-tree-grid').treegrid({
            url:ajaxUrl+"module/tree/grid",
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
                {field:'authorizedSigns',title:'授权标识',width:150},
                {field:'status',title:'状态',width:100,formatter: function(value,row,index){
                        if (value == 0){
                            return "禁用中";
                        } else {
                            return "使用中";
                        }
                    }},
                {field:'createTime',title:'创建时间',width:150},
                {field:'createUserName',title:'创建人',width:120}

            ]]
        });

        // combotree
        $('#module-pid').combotree({
            url: ajaxUrl+"module/tree/0",
            method:'GET'
        });

        $(".textbox").css("width","100%")
        $(".combo-arrow").css("height","35px");
        $(".validatebox-readonly").css({
            "height":"34px",
            "line-height": "34px",
            "width": "100%"
        });

    }


    //资源 表单
    var moduleFrom = function () {

        // form 关闭后触发
        $('#m_blockui_4_5_modal').on('hidden.bs.modal', function () {
            // 执行一些动作...
            $(".form-control-feedback").remove();
            $('#module-pid').combotree('clear');
            //重置表单
            $("#module_form_1")[0].reset();
            //刷新 treeGrid
            $('#module-tree-grid').treegrid('reload');
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
                url: ajaxUrl+'module',
                type:"post",
                dataType:"json",
                //clearForm: true        // 成功提交后，清除所有的表单元素的值.
                resetForm: true ,       // 成功提交后，重置所有的表单元素的值.
                //由于某种原因,提交陷入无限等待之中,timeout参数就是用来限制请求的时间,
                //当请求大于3秒后，跳出请求.
                //timeout:   3000
                success: function(response, status, xhr, $form) {
                    console.log(response);
                    if (response.status == "0") {
                        toastr.success("数据保存成功.");
                        //刷新 comboxTree
                        $('#module-pid').treegrid('reload');
                    }else {
                        toastr.error("数据保存失败.");
                    }
                    //移除遮罩层
                    mApp.unblock('#m_blockui_4_5_modal .modal-content');
                }
            });


        /*    setTimeout(function() {
                mApp.unblock('#m_blockui_4_5_modal .modal-content');
            }, 70000);*/

        });
    }

    return {
        // public functions
        init: function () {
            treeTable();
            moduleFrom();
        }
    };
}();

jQuery(document).ready(function () {
    Module.init();
});