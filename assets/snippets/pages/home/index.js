//== Class definition

var Index = function () {
    //== Private functions
    //var ajaxUrl = "http://127.0.0.1:18081/oauth/v1/api/";
    var ajaxUrl = commonUtil.ajaxUrl;
    var userToken = commonUtil.getUserToken();
    var homeUser = commonUtil.getUser()

    //初始化用户相关数据
    var initUserData =  function () {
         $("#m-card-user__email").text(homeUser.email);
        $("#m-card-user__name").text(homeUser.userName);
    };

    // 获取资源菜单数据
    var moduleTreeData = function () {
        $.ajax({
            url:ajaxUrl+"module/user/tree",
            headers : {'Authorization':userToken},
            type:'get',
            dataType:"json",
            success:function (response, status, xhr) {
                console.log("获取data：" );
                console.log( response);
                var serverStatus = response.status;
                if(serverStatus == -1){
                   //登陆超时，需要重新登陆系统
                    toastr.error(response.message);
                    toastr.info("即将跳转到登陆页面.");

                    return;
                }
                if (response.status != 0){
                    toastr.error(response.message);
                }else {
                    var data = response.data;
                    initMenu(data);
                }
            },
            error:function (response, status, xhr) {
                toastr.error("网络出现错误.");
            }
        })
    };

    /**
     * 初始化 资源菜单
     */
    var initMenu = function (data) {
        var ul = $("#home_menu_tree_left");
        var li = ""
        $.each(data,function (i,v) {
            console.log("解析数据：");
            console.log(v);
            li+=initFirstLi(v);
            var children = v.children;
            if (children.length > 0){

            }else {

            }
        })
        ul.appendChild(li);

    };

    var initFirstLi = function (data) {
        var firstli = '<li class="layui-nav-item">';
            firstli += ' <a href="javascript:javaScript:void(0);">';
            firstli += data.moduleName;
            firstli +=' </a>';
            firstli +='</li>';

            console.log(firstli);
        return firstli;
    }

    var initLink = function(){
        $('.m-menu__link').click(function () {
            //标记
            var sign = $(this).attr("sign");

            switch(sign){
                case "1":
                    openPageHtml("../role/role_list.html");
                    break;
                case "2":
                    openPageHtml("../module/module_list.html");
                    break;
                case "3":
                     openPageHtml("../role/role_user.html");
                    break;
                case "4":
                    openPageHtml("../role/role_module.html");
                    break;
                case "5":
                    openPageHtml("");
                    break;
            }
        });
    }

    //打开页面
    var openPageHtml = function (url) {
        if(url != "" || url != null){
            //计算window 高度
            changeFrameHeight();
            $("#mainIframe").attr("src",url+"?p="+1);
        }
    };

    /**
     * iframe 高度
     */
    function changeFrameHeight(){
        var homeTitleHeight = $(".m-header").height();
        var pageContentHeight = $(".m-page").height();
        console.log( "页面高度 = " + pageContentHeight);
        console.log( "头高度 = " + homeTitleHeight);
        var iframeHeight = pageContentHeight-homeTitleHeight-10;
        $("#mainIframe").attr("height", iframeHeight);
    }

    return {
        // public functions
        init: function () {
            initUserData();
            moduleTreeData();
            initLink();

        }
    };
}();

jQuery(document).ready(function () {
    Index.init();
    /**
     * iframe 自适应高度
     */
    $("#mainIframe").load(function () {
        changeFrameHeight();
    });

    /**
     * 窗口变化事件
     */
    window.onresize=function(){
        changeFrameHeight();
    }
});