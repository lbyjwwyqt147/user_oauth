//== Class definition

var Role = function () {
    //== Private functions
    var ajaxUrl = "http://127.0.0.1:18081/oauth/v1/api/";

    //角色 grid
    var roleTable = function () {

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
                field: "roleCode",
                title: "角色编号",
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering,
                width: 150
            }, {
                field: "roleName",
                title: "角色名称"
            }, {
                field: "roleDescription",
                title: "角色描述",
                width: 150
            }, {
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
                    }
                },
                messages: {
                    roleCode: {
                        required: "请输入角色编号."
                    },
                    roleName: {
                        required: "请输入角色名称."
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
                url: ajaxUrl+'role',
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
            roleTable();
            roleFrom();
        }
    };
}();

jQuery(document).ready(function () {
    Role.init();
});