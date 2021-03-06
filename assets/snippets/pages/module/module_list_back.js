//== Class definition

var Module = function () {
    //== Private functions
    var ajaxUrl = "http://127.0.0.1:18081/oauth/v1/api/";

    var zTreeObj;
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        async: {
            enable: false,
            type: "get",
            url: ajaxUrl+"module/tree1",
            autoParam: ["id"]
        }
    };


    var moduleTree =  function(){
        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes = [
            {name:"test1", open:true, children:[
                    {name:"test1_1"}, {name:"test1_2"}]},
            {name:"test2", open:true, children:[
                    {name:"test2_1"}, {name:"test2_2"}]}
        ];
        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);

    };


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
                {field:'moduleName',title:'名称'},
                {field:'moduleCode',title:'编码'},
                {field:'moduleType',title:'类型'},
                {field:'menuIcon',title:'图标'},
                {field:'menuUrl',title:'URL',width:80},
                {field:'authorizedSigns',title:'授权标识',width:80},
                {field:'status',title:'状态',width:80},
                {field:'createTime',title:'创建时间',width:80},
                {field:'createUserName',title:'创建人',width:80}

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

    //资源菜单 grid
    var moduleTable = function () {
        var datatable = $('.m_datatable').mDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        method:'GET',
                        url: ajaxUrl+'role',
                        params:{
                            roleName: $('#generalSearch').val()
                        }
                    }
                },
                pageSize: 10,
                serverPaging: true,  //是否后端分页
                serverFiltering: false,
                serverSorting: false   //是否后端排序
            },

            // layout definition
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                height: null, // datatable's body's fixed height
                footer: false // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch')
            },

            // columns definition
            columns: [{
                field: "id",
                title: "#",
                sortable: false, // disable sort for this column
                width: 40,
                selector: {class: 'm-checkbox--solid m-checkbox--brand'}
            }, {
                field: "moduleCode",
                title: "编号",
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering,
                width: 150
            }, {
                field: "moduleName",
                title: "名称"
            }, {
                field: "menuIcon",
                title: "图标",
                width: 150
            },{
                field: "URL",
                title: "menuUrl",
                width: 150
            }, {
                field: "authorizedSigns",
                title: "授权标志",
                width: 150
            },{
                field: "createTime",
                title: "创建时间",
                width: 150
            }, {
                field: "createUserName",
                title: "创建人"
            }, {
                field: "updateTime",
                title: "更新时间"
            }, {
                field: "updateUserName",
                title: "跟新人"
            }, {
                field: "statusText",
                title: "状态"
            }]
        });
    };

    //资源 表单
    var moduleFrom = function () {

        // form 关闭后触发
        $('#m_blockui_4_5_modal').on('hidden.bs.modal', function () {
            // 执行一些动作...
            $(".form-control-feedback").remove();
            $('#module-pid').combotree('clear');
            $("#module_form_1")[0].reset();
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
            moduleTable();
            moduleFrom();
            moduleTree();
            treeTable();
        }
    };
}();

jQuery(document).ready(function () {
    Module.init();
});