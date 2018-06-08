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
            url:ajaxUrl+"module/tree/user",
            headers : {'Authorization':userToken},
            type:'get',
            dataType:"json",
            success:function (response, status, xhr) {
                console.log(" =============================== ")
                console.log("index.js 获取资源tree data")
                console.log(response);
                console.log(" =============================== ")
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
                    var data = JSON.parse(response.data);
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
        var li = "";
        $.each(data,function (i,v) {
            li+=initFirstLi(v);
        });
        ul.append(li);
        initlayui();
    };

    /**
     * 初始化第一级菜单数据
     * @param data
     * @returns {string}
     */
    var initFirstLi = function (data) {
        var firstli = '<li class="layui-nav-item">';
        firstli += ' <a href="javascript:;" lay-tips="'+data.moduleName+'" lay-direction="2">';
        firstli += '<i class="layui-icon '+data.menuIcon+'"></i>';
        firstli += '<cite> '+data.moduleName+'</cite>';
        firstli +=' </a>';
        var children = data.children;
        if (children.length > 0){
            var dl = initDl(children);
            firstli+=dl;
        }else {

        }
        firstli +='</li>';
        return firstli;
    }

    /**
     * 初始化第二级菜单数据
     * @param children
     * @returns {string}
     */
    var initDl =  function (children){
        var dl = '<dl class="layui-nav-child">';
        $.each(children,function(i,v){
            dl += '<dd data-name="console" class="">';
            dl += '<a lay-href="'+v.menuUrl+'" lay-href-id="'+v.id+'">'+v.moduleName+'</a>';
            dl += '</dd>';
        });
        dl += '</dl>';
        return dl;
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
     * 退出系统
     */
    var loginout = function(){
        $('#logout-btn').click(function () {
            $.ajax({
                url:ajaxUrl+"login/logout",
                headers : {'Authorization':userToken},
                type:'get',
                dataType:"json",
                success:function (response, status, xhr) {
                    toastr.info("即将跳转到登陆页面.");
                    localStorage.removeItem('user_token');
                    localStorage.removeItem('user');
                    window.location.href="../../../../login.html";
                },
                error:function (response, status, xhr) {
                    toastr.error("网络出现错误.");
                }
            })
        });
    }

    /**
     * iframe 高度
     */
    function changeFrameHeight(){
        var homeTitleHeight = $(".m-header").height();
        var pageContentHeight = $(".m-page").height();
        console.log(" =============================== ")
        console.log( "index.js 获取　页面高度 = " + pageContentHeight);
        console.log( "ndex.js 获取　头高度 = " + homeTitleHeight);
        console.log(" =============================== ")
        var iframeHeight = pageContentHeight-homeTitleHeight-10;
        $("#main_home_iframe").attr("height", iframeHeight);
    }

    function initlayui() {

        layui.use('layer', function(){
            var layer= layui.layer//获取layer模块
            //你index页面涉及到layer的都写在这里面
        });


        layui.use('element', function(){
            var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块

            //监听导航点击
            element.on('nav(demo)', function(elem){
                var tab_height = document.body.offsetHeight - $("#m_header_nav").height()-100-50;
                console.log(" =============================== ")
                console.log("index.js　tab 高度："+tab_height);
                var tab_context_width = $("#m_header_nav").width();
                console.log("index.js　tab 宽度："+tab_context_width);
                console.log(" =============================== ")
                $(".layui-tab-content").css("width",tab_context_width);

                var tab_id = 'tab_id_'+elem.attr("lay-href-id");;
                var menu_url = elem.attr("lay-href");
                if( typeof menu_url === 'undefined'){

                }else{
                    //删除指定Tab项
                    element.tabDelete('layadmin-layout-tabs', tab_id);
                    //新增一个Tab项
                    element.tabAdd('layadmin-layout-tabs', {
                        title: elem.text(),
                        content: '<iframe id="main_home_iframe"" src="'+menu_url+'" frameborder="0" class="layadmin-iframe" width="'+tab_context_width+'" height="'+tab_height+'"></iframe>',
                        id: tab_id
                    });
                    //切换到指定Tab项
                    element.tabChange('layadmin-layout-tabs',tab_id);
                }
                console.log(menu_url);

                layer.msg(elem.text());
            });



            //触发事件
            /*var active = {
                tabAdd: function(){
                    //新增一个Tab项
                    element.tabAdd('demo', {
                        title: '新选项'+ (Math.random()*1000|0) //用于演示
                        ,content: '内容'+ (Math.random()*1000|0)
                        ,id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
                    })
                }
                ,tabDelete: function(othis){
                    //删除指定Tab项
                    element.tabDelete('demo', '44'); //删除：“商品管理”


                    othis.addClass('layui-btn-disabled');
                }
                ,tabChange: function(){
                    //切换到指定Tab项
                    element.tabChange('demo', '22'); //切换到：用户管理
                }
            };

            $('.site-demo-active').on('click', function(){
                var othis = $(this), type = othis.data('type');
                active[type] ? active[type].call(this, othis) : '';
            });

            //Hash地址的定位
            var layid = location.hash.replace(/^#test=/, '');
            element.tabChange('test', layid);

            element.on('tab(test)', function(elem){
                location.hash = 'test='+ $(this).attr('lay-id');
            });
           */


        });
    }

    return {
        // public functions
        init: function () {
            initUserData();
            moduleTreeData();
            initLink();
            loginout();
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