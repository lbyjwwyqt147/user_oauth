//== Class definition

var RoleUser = function () {
    //== Private functions
    var ajaxUrl = "http://127.0.0.1:18081/auth/v1/api/";
    var beAuthorizedUserGridTable;   //已分配的人员grid
    var  unauthorizedUserGridTable; //未分配人员grid
    var checkboxRoleId = 0; //选中的roleId


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

            //加载已分配table数据
            beAuthorizedUserGridTable.setDataSourceQuery({roleId:checkboxRoleId});
            beAuthorizedUserGridTable.reload();
            //加载未分配table数据
            unauthorizedUserGridTable.setDataSourceQuery({roleId:checkboxRoleId});
            unauthorizedUserGridTable.reload();
        });


    };



    // 已经授权的 user Grid
    var beAuthorizedUserGrid = function () {
        beAuthorizedUserGridTable =  $('#be-authorized-userGrid').mDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        method:'GET',
                        url: ajaxUrl+'role/user/have',
                        params:{
                            query: {
                                roleId:checkboxRoleId
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

         /*   search: {
                input: $("role-id")
            },
*/

            // columns definition
            columns: [
                {
                field: "check",
                title: "#",
                sortable: false, // disable sort for this column
                width: 40,
                selector: {class: 'm-checkbox--solid m-checkbox--brand'}

            },{
                    field: "id",
                    title: "id",
                    sortable: true,
                    width: 40,
                    hidden:true
                }, {
                field: "userAccount",
                title: "账户",
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering,
                width: 100
            }, {
                field: "userEmail",
                title: "邮箱",
                width: 150
            }]
        });

    }

    // 未授权的 user Grid
    var unauthorizedUserGrid =  function () {
        unauthorizedUserGridTable = $('#unauthorized-userGrid').mDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        method:'GET',
                        url: ajaxUrl+'role/user/not',
                        params:{
                            query: {
                                roleId:checkboxRoleId
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

            /*search: {
                input: $('#generalSearch')
            },*/

            // columns definition
            columns: [{
                field: "check",
                title: "#",
                sortable: false, // disable sort for this column
                width: 40,
                selector: {class: 'm-checkbox--solid m-checkbox--brand'}

            }, {
                field: "id",
                title: "id",
                sortable: true,
                width: 40,
                hidden:true
            },{
                field: "userAccount",
                title: "账户",
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering,
                width: 100
            }, {
                field: "userEmail",
                title: "邮箱",
                width: 150
            }]
        });

        $(".modal-dialog").css("width","600px");

    }


    // 删除角色分配的人员
    var  deleteRoleUser = function () {
        $('#delete-user-btn').click(function(e) {

            e.preventDefault();
            var btn = $(this);

            // 获取选择行的id
            beAuthorizedUserGridTable.rows('.m-datatable__row--active');
            var selectDeleteUserIds = [];
            if (beAuthorizedUserGridTable.nodes().length > 0) {
                beAuthorizedUserGridTable.columns('id').nodes().each(function(i){
                    selectDeleteUserIds.push($(this).text());
                });
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
                url: ajaxUrl+'userRole',
                data : {
                    roleId:checkboxRoleId,
                    userIds:selectDeleteUserIds.toString(),
                    _method: 'DELETE'
                },
                type:"post",
                dataType:"json",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(response, status, xhr) {
                    if (response.status == "0") {
                        toastr.success("删除数据成功.");
                        //加载已分配table数据
                        beAuthorizedUserGridTable.setDataSourceQuery({roleId:checkboxRoleId});
                        beAuthorizedUserGridTable.reload();
                        //加载未分配table数据
                        unauthorizedUserGridTable.setDataSourceQuery({roleId:checkboxRoleId});
                        unauthorizedUserGridTable.reload();
                    }else {
                        toastr.error("删除数据失败.");
                    }
                    //移除遮罩层
                    mApp.unblock('#be-authorized-userGrid');
                }
            });

        });
    }

    //保存分配的人员信息
    var saveRoleUser = function () {
        $('#m_blockui_4_5_roleuser').click(function(e) {

            e.preventDefault();
            var btn = $(this);

            // 获取选择行的id
            unauthorizedUserGridTable.rows('.m-datatable__row--active');
            var selectAllocationUserIds = [];
            if (unauthorizedUserGridTable.nodes().length > 0) {
                unauthorizedUserGridTable.columns('id').nodes().each(function(i){
                    selectAllocationUserIds.push($(this).text());
                });
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
                url: ajaxUrl+'roleUser',
                data : {
                    roleId:checkboxRoleId,
                    userIds:selectAllocationUserIds.toString()
                },
                type:"post",
                dataType:"json",
                /*xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,*/
                success: function(response, status, xhr) {
                    if (response.status == "0") {
                        toastr.success("数据保存成功.");
                        //加载已分配table数据
                        beAuthorizedUserGridTable.setDataSourceQuery({roleId:checkboxRoleId});
                        beAuthorizedUserGridTable.reload();
                        //关闭弹出窗口
                        $('#m_blockui_4_5_roleuser_modal').modal('hide');
                        //加载未分配table数据
                        unauthorizedUserGridTable.setDataSourceQuery({roleId:checkboxRoleId});
                        unauthorizedUserGridTable.reload();

                    }else {
                        toastr.error("数据保存失败.");
                    }
                    //移除遮罩层
                    mApp.unblock('#m_blockui_4_5_roleuser_modal .modal-content');
                }
            });

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


    //单击，赋值，改样式
    $("#role_table_grid > table > tbody > tr").click(function (e) {

        console.log("单击 === ")
    });



    //选中行事件
        $("#role_table_grid tbody").on("click","tr",function(){
                console.log(" 3333333 ")
           });

});