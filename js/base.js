layui.use(['element','form','table','laypage','laytpl','layer','laydate','upload','carousel','util'], function () {
	var $ = layui.$, //jquery
    element = layui.element, //元素操作
    form = layui.form, //表单
    table = layui.table, //数据表格
    laypage = layui.laypage, //分页
    laytpl = layui.laytpl, //模板引擎
    layer = layui.layer, //弹出层
    laydate = layui.laydate, //时间日期
    upload = layui.upload,//上传
    carousel = layui.carousel,//轮播图
    util = layui.util;//工具

	//隐藏左侧菜单
	$('.layui-tab-tool').on('click', function () {
		if ($(this).hasClass("open")) {
			$(".layui-side").animate({ 'left': -200 }, 300);
			$(".layui-body").animate({ 'left': 0 }, 300);
			$(".layui-footer").animate({ 'left': 0 }, 300);
			$(this).removeClass("open");
			$(this).attr("title", "展开");
			$(this).children("i").removeClass("wdicon-xiangzuojiantou");
			$(this).children("i").addClass("wdicon-xiangyoujiantou");
		} else {
			$(".layui-side").animate({ 'left': 0 }, 300);
			$(".layui-body").animate({ 'left': 200 }, 300);
			$(".layui-footer").animate({ 'left': 200 }, 300);
			$(this).addClass("open");
			$(this).attr("title", "收起");
			$(this).children("i").removeClass("wdicon-xiangyoujiantou");
			$(this).children("i").addClass("wdicon-xiangzuojiantou");
		}
	});

	//左侧菜单
	$(".layui-side .layui-nav-item").click(function (event) {
		$(this).children('.layui-side .layui-nav-item').slideToggle();
	});
	$(".layui-side .layui-nav-item").click(function (event) {
		event.stopPropagation();
		$(".layui-side .layui-nav-item").removeClass('layui-nav-itemed');
		if ($(this).children("dl").length > 0) {
			$(this).addClass('layui-nav-itemed');
		}
	});

	
    // 选项卡右键事件阻止
    $(document).on("contextmenu", '.layui-body .layui-tab-wdphp > .layui-tab-title li', function () {
        return false;
    });
	
	// 双击关闭相应选项卡
    $(document).on('dblclick', '.layui-body .layui-tab-wdphp > .layui-tab-title li', function () {
        // 欢迎页面以外，删除选项卡
        if ($(this).index() > 0) {
            element.tabDelete('main-tab', $(this).attr('lay-id'));
        } else {
            layer.msg('欢迎页面不能关闭'); 
        }
    });
	
	
    // 选项卡右键事件
    $(document).on("mousedown", '.layui-body .layui-tab-wdphp > .layui-tab-title li', function (e) {
        // 判断是右键点击事件并且不是欢迎页面选项卡
        if (3 == e.which && $(this).index() > 0) {
            // 赋值
            cardIdx = $(this).index();
            cardLayId = $(this).attr('lay-id');
            // 选择框
            layer.tips($('.my-dblclick-box').html(), $(this), {
                skin: 'dblclick-tips-box',
                tips: [3, 'rgb(42, 45, 53)'],
                time: false,
            });
        }
    });

    // 右键提示框菜单操作-刷新页面
    $(document).on('click', '.card-refresh', function () {
        // 窗体对象
        var ifr = $(document).find('.layui-body .layui-tab-content .layui-tab-item iframe').eq(cardIdx);
        // 刷新当前页
        ifr.attr('src', ifr.attr('src'));
        // 切换到当前选项卡
        element.tabChange('main-tab', cardLayId);
    });

    // 右键提示框菜单操作-关闭页面
    $(document).on('click', '.card-close', function () {
        // 删除
		element.tabDelete('main-tab', cardLayId);
    });
	    // 点击body关闭tips
    $(document).on('click', 'html', function () {
        layer.closeAll('tips');
    });
	
	var add_tab = function(elem){
		//var currentTabCount = $('.layui-tab[lay-filter=\'main-tab\']').children('.layui-tab-title').children('li').length;
		//if (currentTabCount > 8) {
		//    layer.msg("为了系统的流畅度，只能同时打开8个选项卡。");
		//    return;
		//}
		var icon = $(elem).children('i').attr('data-icon');   //icon图标
		var icon_text  = $(elem).children('i').text();   //icon图标
		var url = $(elem).attr('data-url');   //页面url
		var id = $(elem).attr('data-id');     //tab唯一Id
		var title = $(elem).text();           //菜单名称

		if (title == "首页") {
			element.tabChange('main-tab', 0);
			return;
		}
		if (url == undefined) return;
		var tabTitleDiv = $('.layui-tab[lay-filter=\'main-tab\']').children('.layui-tab-title');
		var exist = tabTitleDiv.find('li[lay-id=' + id + ']');
		//当前tab是否存在
		if (exist.length > 0) {
			element.tabChange('main-tab', id);
			$('#' + id).attr('src', url);
		} else {
			if (typeof (icon) != "undefined") {
				title = "<i class=\"wdfont " + icon + "\"></i>" + title;
			}else if (typeof (icon_text) != "undefined") {
				title = "<i class=\"wdfont\">" + icon_text + "</i>" + title;
			}
			element.tabAdd('main-tab', { title: title, content: '<iframe id="' + id + '" src="' + url + '" class="layui-tab-iframe"></iframe>', id: id });
			element.tabChange('main-tab', id);
		}
	};
	//左侧菜单点击事件
	element.on('nav(leftNav)', function (elem) {
		add_tab(elem);
	});
	// 监听顶部右侧导航
	element.on('nav(UserNav)', function (elem) {
		//修改 skin
		var skinnum=$(this).children('a').attr('data-skin');
		if(skinnum){
			localStorage.skin = skinnum;
			skin();
		}else{
			add_tab(elem);
		}
	});
	skin();
	
	// 皮肤
    function skin() {
        var skin = localStorage.skin ? localStorage.skin : 0;
        var body = $('body');
        body.removeClass('skin-0');
        body.removeClass('skin-1');
		body.removeClass('skin-2');
		body.removeClass('skin-3');
        body.addClass('skin-' + skin);
    };
	
	
	//弹出层
	window.Dialog = {
		Confirm: function (text, url, data) {
			debugger
			layer.confirm(text, {
				icon: 3, btn: ['确定', '取消']
			}, function (index) {
				var postindex = layer.load(1);
				$.post(url, data, function (result) {
					layer.close(postindex);
					//状态state 信息message
					if (result.code == 1) {
						layer.msg(result.message, { icon: 6 });
					} else { 
						layer.msg(result.message, { icon: 5 });
					}
				});
			});
		},
		Error: function (value) {
			//错误提示 
			layer.msg(value, { icon: 5, time: 2000 });
		},
		Success: function (value) {
			//成功提示    
			layer.msg(value, { icon: 6, time: 2000 });
		},
		Open: function (title, url, width, height) {
			//弹出层
			if (title == null || title == '') {
				title = false;
			};
			if (width > $(window).width()) {
				width = ($(window).width() - 150);
			}
			if (height > $(window).height()) {
				height = ($(window).height() - 100);
			}
			var index = layer.open({
				title: title,
				type: 2,
				content: url,
				area: [width + 'px', height + 'px'],
				resize: false,
				end: function () {
					//关闭时刷新
					$('#btn-refresh').click();
				}
			});
		}
	};
	
    window.updateAlert = function (text,code=0) {
		if(code==1){
			Dialog.Success(text);
		}else{
			Dialog.Error(text);
		}
	};
	
    //ajax get请求
    $('.ajax-get').click(function(){
        var target;
        var that = this;
        if ( $(this).hasClass('confirm') ) {
			var confirm_msg = $(this).attr('msg')?'确认要执行该操作吗?\n'+$(this).attr('msg'):'确认要执行该操作吗?';
            if(!confirm(confirm_msg)){
                return false;
            }
        }
        if ( (target = $(this).attr('href')) || (target = $(this).attr('url')) ) {
            $.get(target).success(function(data){
                if (data.code==1) {
                    if (data.url) {
                        updateAlert(data.msg + ' 页面即将自动跳转~',1);
                    }else{
                        updateAlert(data.msg,1);
                    }
                    setTimeout(function(){
                        if (data.url) {
                            location.href=data.url;
                        }else if( $(that).hasClass('no-refresh')){
                            $('#top-alert').find('button').click();
                        }else{
                            location.reload();
                        }
                    },1500);
                }else{
                    updateAlert(data.msg,0);
                    setTimeout(function(){
                        if (data.url) {
                            location.href=data.url;
                        }else{
                            $('#top-alert').find('button').click();
                        }
                    },1500);
                }
            });

        }
        return false;
    });
	
    //ajax 预览请求
    $('.ajax-open').click(function(){
        var target;
        var that = this;

        if ( (target = $(this).attr('href')) || (target = $(this).attr('url'))  || (target = $(this).attr('wdphp-url'))) {
			var title = $(this).attr('wdphp-title');
			var width = $(this).attr('wdphp-width') || 600;
			var height = $(this).attr('wdphp-height') || 500;
			Dialog.Open(title,target,width,height);
        }
        return false;
    });

    //ajax post submit请求
    $('.ajax-post').click(function(){
        var target,query,form;
        var target_form = $(this).attr('target-form');
        var that = this;
        var nead_confirm=false;
        if( ($(this).attr('type')=='submit') || (target = $(this).attr('href')) || (target = $(this).attr('url')) ){
            form = $('.'+target_form);

            if ($(this).attr('hide-data') === 'true'){//无数据时也可以使用的功能
            	form = $('.hide-data');
            	query = form.serialize();
            }else if (form.get(0)==undefined){
            	return false;
            }else if ( form.get(0).nodeName=='FORM' ){
                if ( $(this).hasClass('confirm') ) {
                    if(!confirm('确认要执行该操作吗?')){
                        return false;
                    }
                }
                if($(this).attr('url') !== undefined){
                	target = $(this).attr('url');
                }else{
                	target = form.get(0).action;
                }
                query = form.serialize();
            }else if( form.get(0).nodeName=='INPUT' || form.get(0).nodeName=='SELECT' || form.get(0).nodeName=='TEXTAREA') {
                form.each(function(k,v){
                    if(v.type=='checkbox' && v.checked==true){
                        nead_confirm = true;
                    }
                })
                if ( nead_confirm && $(this).hasClass('confirm') ) {
                    if(!confirm('确认要执行该操作吗?')){
                        return false;
                    }
                }
                query = form.serialize();
            }else{
                if ( $(this).hasClass('confirm') ) {
                    if(!confirm('确认要执行该操作吗?')){
                        return false;
                    }
                }
                query = form.find('input,select,textarea').serialize();
            }
            $(that).addClass('disabled').attr('autocomplete','off').prop('disabled',true);
            $.post(target,query).success(function(data){
                if (data.code==1) {
                    if (data.url) {
                        updateAlert(data.msg + ' 页面即将自动跳转~',1);
                    }else{
                        updateAlert(data.msg ,1);
                    }
                    setTimeout(function(){
                    	$(that).removeClass('disabled').prop('disabled',false);
                        if (data.url) {
                            location.href=data.url;
                        }else{
                            location.reload();
                        }
                    },1500);
                }else{
                    updateAlert(data.msg);
                    setTimeout(function(){
                    	$(that).removeClass('disabled').prop('disabled',false);
                        if (data.url) {
                            location.href=data.url;
                        }
                    },1500);
                }
            });
        }
        return false;
    });
});
