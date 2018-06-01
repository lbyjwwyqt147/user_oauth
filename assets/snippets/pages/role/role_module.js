//== Class definition

var RoleModule = function () {
    //== Private functions
    var ajaxUrl = "http://127.0.0.1:18081/auth/v1/api/";
    var checkboxRoleId = 0; //选中的roleId
    var modulezTreeObj;


    //角色 grid
    var roleTable = function () {

        var roleTableGrid = $('#role_table_grid').mDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        method:'GET',
                        url: ajaxUrl+'role',
                        params:{
                            query:{
                                roleName: ""
                            }
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
                selector: {class: 'm-checkbox--solid m-checkbox--brand'},
                //selector: false,
                textAlign: 'center'
            }, {
                field: "roleCode",
                title: "角色编号",
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering,
                width: 100
            }, {
                field: "roleName",
                title: "角色名称",
                width: 150
            }, {
                field: "roleDescription",
                title: "角色描述",
                width: 150
            },  {
                field: "statusText",
                title: "状态",
                width: 100
            }]
        });

        $('#role-grid-resh-btn').on('click', function() {
            roleTableGrid.reload();
           // $('#role_table_grid').mDatatable('reload');
        });

  /*      $('#role_table_grid tbody tr').on('click',function () {
            var data = roleTableGrid.row( this ).data();
            alert( 'You clicked on '+data[0]);
        } );*/

        //选择框选中事件
        $('#role_table_grid').on('m-datatable--on-check', function (e, args) {
            checkboxRoleId = args.toString();
            console.log("选中roleId = " + checkboxRoleId);
            //刷新树
            refreshZtree();

        });


    };


    // 资源菜单树
    var moduleTree =  function () {
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
                autoCheckTrigger: true,   //true / false 分别表示 触发 / 不触发 事件回调函数
                chkStyle: "checkbox",   //勾选框类型(checkbox 或 radio）
                chkboxType: { "Y": "ps", "N": "ps" }   //勾选 checkbox 对于父子节点的关联关系
            },
            async: {
                enable: true,
                type: "get",
                url: ajaxUrl+"module/role/tree/"+checkboxRoleId,
                autoParam: ["id"],
                otherParam: { },
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
      //  modulezTreeObj = $.fn.zTree.init($("#module-tree"), setting, zNodes);
        modulezTreeObj = $.fn.zTree.init($("#module-tree"), setting);
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


    //保存分配的资源菜单信息
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
            var nodes = ztree.getChangeCheckedNodes(true);
            if (nodes.length != 0) {
                for (var i = 0; i < nodes.length; i++) {
                    selectModuleIds.push(nodes[i].id);
                }
            }else {
                swal("请选择要分配的菜单资源!");
                return;
            }

            console.log(selectModuleIds);







           //添加遮罩层
            mApp.block('#ztree-content', {
                overlayColor: '#000000',
                type: 'loader',
                state: 'primary',
                message: '数据处理中.....'

            });
            $(".blockUI.blockMsg.blockElement").css("padding-left","35%");

            $.ajax({
                url: ajaxUrl+'roleModule',
                data : {
                    roleId:checkboxRoleId,
                    moduleIds:selectModuleIds.toString()
                },
                type:"post",
                dataType:"json",
              /*  xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,*/
                success: function(response, status, xhr) {
                    if (response.status == "0") {
                        toastr.success("数据保存成功.");
                    }else {
                        toastr.error("数据保存失败.");
                    }
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
            refreshZtree();
        });
    }

    var refreshZtree = function(){
        var zTree = $.fn.zTree.getZTreeObj('module-tree');
        zTree.setting.async.url = ajaxUrl+"module/role/tree/"+checkboxRoleId;
        zTree.reAsyncChildNodes(null, "refresh");
    }


    return {
        // public functions
        init: function () {
            roleTable();
            moduleTree();
            saveRoleModule();
            refreshZtreeBtn();
        }
    };
}();

jQuery(document).ready(function () {
    RoleModule.init();
});