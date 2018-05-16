//== Class definition

var Index = function () {
    //== Private functions
    var ajaxUrl = "http://127.0.0.1:18081/oauth/v1/api/";

    // 获取资源菜单数据
    var moduleTreeData = function () {
        $.ajax({
            url:ajaxUrl+"module/user/module/tree",
           // url:ajaxUrl+"module/tree/0",
            type:'get',
            dataType:"json",
            success:function (data) {
                console.log("获取data：" );
                console.log( data);

               // initMenu(data);
            }
        })
    };

    /**
     * 初始化 资源菜单
     */
    var initMenu = function (data) {
        var ul = $("#menu-tree");
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
        ul.html(li);

    };

    var initFirstLi = function (data) {
        var firstli = '<li class="m-menu__item  m-menu__item--active" aria-haspopup="true" >';
            firstli += ' <a  href="" class="m-menu__link ">';
            firstli += '<span class="m-menu__item-here"></span>';
            firstli += ' <i class="m-menu__link-icon '+data.menuIcon+'></i>';
            firstli += '<span class="m-menu__link-text">';
            firstli += data.moduleName;
            firstli += '</span>';
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