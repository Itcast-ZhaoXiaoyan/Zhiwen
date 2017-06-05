$(function () {
/*搜索按钮*/
	$('#search_button').button({
		icons : {
			primary : 'ui-icon-search',
		},
	});
	
	
/*Ajax提问——16.19*/
	//提问按钮
	$('#question_button').button({
		icons : {
			primary : 'ui-icon-lightbulb',
		},
	}).click(function () {
		if ($.cookie('user')) {
			$('#question').dialog('open');
		} else {
			$('#error').dialog('open');
			setTimeout(function () {
				$('#error').dialog('close');
				$('#login').dialog('open');
			}, 1000);
		}
	});
	

/*Ajax显示——16.20*/
	$.ajax({
		url:'show_content.php',
		type:'POST',
		success:function(response,status,xhr){
			var json=$.parseJSON(response);   //强制转换为json类型;
			var html='';
			var arr=[];
			var summary=[];      //摘要；
			$.each(json,function(index,value){
				html +='<h4>'+value.user+'发表于' + value.date+ '</h4><h3>'+ value.title +'</h3><div class="editor">' + value.content + '</div>' + '<div class="bottom" ><span class="comment" data-id=" ' + value.id  + ' ">' + value.count + '条评论</span>  <span class="up">收起</span></div><hr noshade="noshade" size="1"/><div class="comment_list"><dl class="comment_content"><dt>zxy</dt><dd>最新动态：新视觉科技创新</dd><dd class="date">2014-10-11</dd></dl><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="button" value="发表"/></dd></dl></div>';
			});
			$('.content').append(html);
			
			$.each($('.editor'),function(index,value){
				arr[index] = $(value).html();
				summary[index] = arr[index].substr(0,200);
				
				if(summary[index].substring(199,200) == '<'){
					summary[index] = replacePos(summary[index],200,'');
				}
				
				if(summary[index].substring(198,200) == '</'){
					summary[index] = replacePos(summary[index],200,'');
					summary[index] = replacePos(summary[index],199,'');
				}
				
				if(arr[index].length >200){
					summary[index] += '...<span class="down">显示全部</span>';
					$(value).html(summary[index]);
				}
				$('.bottom .up').hide();
			});
			
			//显示全部,on('click',function(){})方法表示委托；
			$.each($('.editor'),function(index,value){
				$(this).on('click','.down',function(){
					$('.editor').eq(index).html(arr[index]);
					$(this).hide();
					$('.bottom .up').eq(index).show();
				});
			});
			
			//收起
			$.each($('.bottom'),function(index,value){
				$(this).on('click','.up',function(){
					$('.editor').eq(index).html(summary[index]);
					$(this).hide();
					$('.editor .down').eq(index).show();
				});
			});	
			
			
			
			
			
			//njkhjkgjkkkkkkkkklhjkjhfgdfg
			$.each($('.bottom'), function(index,value) {
				$(this).on('click','comment',function(){
					if($.cookie('user')){
						if(!$('.comment_list').eq(index).has('form').length){
							//$('.comment_list').eq(index).append('<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="titleid" value=" ' + $(this).attr('data-id') +  ' "/><input type="text" name="user" value=" ' + $.cookie('user') + '" /><input type="button" value="发表"/></dd></dl></form>');
							//显示评论
							$.ajax({
								url:'show_comment.php',
								type:'POST',
								beforeSend:function(jqXHR,settings){
									$('.comment_list').eq(index).append('<dl class="comment_load"><dd>正在加载评论</dd></dl>');
								},
								success:function(response,status){
									$('.comment_list').eq(index).find('.comment_load').hide();
									$('.comment_list').eq(index).append('<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="titleid" value=" ' + $(this).attr('data-id') +  ' "/><input type="text" name="user" value=" ' + $.cookie('user') + '" /><input type="button" value="发表"/></dd></dl></form>')
								},	
							});
						}
						
						if($('.comment_list').eq(index).is(':hidden')){
							$('.comment_list').eq(index).show();
						}
						else{
							$('.comment_list').eq(index).hide();
						}
						
						$('.comment_list').eq(index).find('input[type=button]').button().click(function(){
							var _this=this;
							$('.comment_list').eq(index).find('form').ajaxSubmit({
								url:'add_comment.php',
								type:'POST',
								beforeSubmit:function(formData,jqForm,options){
									$(_this).button('disable');
								},
								success : function (responseText, statusText) {
									if (responseText) {
										$(_this).button('enable');
										$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('数据新增成功...');
										setTimeout(function () {
											$('#loading').dialog('close');
											$('.comment_list').eq(index).find('form').resetForm();
											$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
										}, 1000);
									}
								},
							});
						});
					}
					else{
						$('#error').dialog('open');
						setTimeout(function(){
							$('#error').dialog('close');
							$('#login').dialog('open');
						},1000);
					}
				});
				
				
			});
			
			
			
			
			
			
			//遍历编辑器是否显示或隐藏
			/*
			$.each($('.editor'),function(index,value){
				arr[index]=$(value).height();
				if($(value).height()>155){
					$(value).next('.bottom').find('.up').hide();
				}
				$(value).height(155);
			});
			
			//显示全部
			$.each($('.bottom .down'),function(index,value){
				$(this).click(function(){
					$(this).parent().prev().height(arr[index]);
					$(this).hide();
					$(this).parent().find('.down').show();
				});
			});
			
			//收起
			$.each($('.bottom .up'),function(index,value){
				$(this).click(function(){
					$(this).parent().prev().height(155);
					$(this).hide();
					$(this).parent().find('.down').show();
				});
			});	
			*/
		},
	});
	
	
/*Ajax提问对话框——16.19*/
	$('#question').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 500,
		height : 360,
		buttons : {
			'发布' : function () {
				$(this).ajaxSubmit({
					url : 'add_content.php',
					type : 'POST',
					data : {
						user : $.cookie('user'),
						content : $('.uEditorIframe').contents().find('#iframeBody').html(),
					},
					beforeSubmit : function (formData, jqForm, options) {
						$('#loading').dialog('open');
						$('#question').dialog('widget').find('button').eq(1).button('disable');
					},
					success : function (responseText, statusText) {
						if (responseText) {
							$('#question').dialog('widget').find('button').eq(1).button('enable');
							$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('数据新增成功...');
							setTimeout(function () {
								$('#loading').dialog('close');
								$('#question').dialog('close');
								$('#question').resetForm();
								$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							}, 1000);
						}
					},
				});
			}
		}
	});
	
	
/*编辑器插件——16.18*/
	$('.uEditorCustom').uEditor();
	
/*错误对话框，创建header区——16.2*/
	$('#error').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

	$('#member, #logout').hide();

/*cookie插件——16.14*/
	if ($.cookie('user')) {
		$('#member, #logout').show();
		$('#reg_a, #login_a').hide();
		$('#member').html($.cookie('user'));
	} else {
		$('#member, #logout').hide();
		$('#reg_a, #login_a').show();
	}
	
	$('#logout').click(function () {
		$.removeCookie('user');
		window.location.href = '/jquery/';
	});
	/*加载*/	
	$('#loading').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();
	
	$('#reg_a').click(function () {
		$('#reg').dialog('open');
	});

/*Ajax验证注册表单——16.13*/
	$('#reg').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 320,
		height : 340,
		buttons : {
			'提交' : function () {
				$(this).submit();
			}
		}
	}).buttonset().validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'add.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#reg').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('数据新增成功...');
						$.cookie('user', $('#user').val());
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#reg').dialog('option', 'height', errors * 20 + 340);
			} else {
				$('#reg').dialog('option', 'height', 340);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.reg_error',
		wrapper : 'li',
	
		rules : {
			user : {
				required : true,
				minlength : 2,
				remote : {
					url : 'is_user.php',
					type : 'POST',
				},
			},
			pass : {
				required : true,
				minlength : 6,
			},
			email : {
				required : true,
				email : true
			},
			date : {
				date : true,
			},
		},
		messages : {
			user : {
				required : '帐号不得为空！',
				minlength : jQuery.format('帐号不得小于{0}位！'),
				remote : '帐号被占用！',
			},
			pass : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码不得小于{0}位！'),
			},
			email : {
				required : '邮箱不得为空！',
				minlength : '请输入正确的邮箱地址！',
			},	
		}
	});
	
	
	
/*日期插件UI——16.9*/
	$('#date').datepicker({
		changeMonth : true,
		changeYear : true,
		yearSuffix : '',
		maxDate : 0,
		yearRange : '1950:2020',

	});
		
/*邮箱自动补全——16.8*/
	$('#email').autocomplete({
		delay : 0,
		autoFocus : true,
		source : function (request, response) {
			//获取用户输入的内容
			//alert(request.term);
			//绑定数据源的
			//response(['aa', 'aaaa', 'aaaaaa', 'bb']);
			
			var hosts = ['qq.com', '163.com', '263.com', 'sina.com.cn','gmail.com', 'hotmail.com'],
				term = request.term,		//获取用户输入的内容
				name = term,				//邮箱的用户名
				host = '',					//邮箱的域名
				ix = term.indexOf('@'),		//@的位置
				result = [];				//最终呈现的邮箱列表
				
				
			result.push(term);
			
			//当有@的时候，重新分别用户名和域名
			if (ix > -1) {
				name = term.slice(0, ix);
				host = term.slice(ix + 1);
			}
			
			if (name) {
				//如果用户已经输入@和后面的域名，
				//那么就找到相关的域名提示，比如bnbbs@1，就提示bnbbs@163.com
				//如果用户还没有输入@或后面的域名，
				//那么就把所有的域名都提示出来
				
				var findedHosts = (host ? $.grep(hosts, function (value, index) {
						return value.indexOf(host) > -1
					}) : hosts),
					findedResult = $.map(findedHosts, function (value, index) {
					return name + '@' + value;
				});
				
				result = result.concat(findedResult);
			}
			
			response(result);
		},	
	});
	
/*Ajax登录——16.15*/
	$('#login_a').click(function () {
		$('#login').dialog('open');
	});
	
	$('#login').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 320,
		height : 240,
		buttons : {
			'登录' : function () {
				$(this).submit();
			}
		}
	}).validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'login.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#login').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#login').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('登录成功...');
						if ($('#expires').is(':checked')) {
							$.cookie('user', $('#login_user').val(), {
								expires : 7,
							});
						} else {
							$.cookie('user', $('#login_user').val());
						}
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#login').dialog('option', 'height', errors * 20 + 240);
			} else {
				$('#login').dialog('option', 'height', 240);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.login_error',
		wrapper : 'li',
	
		rules : {
			login_user : {
				required : true,
				minlength : 2,
			},
			login_pass : {
				required : true,
				minlength : 6,
				remote : {
					url : 'login.php',
					type : 'POST',
					data : {
						login_user : function () {
							return $('#login_user').val();
						},
					},
				},
			},
		},
		messages : {
			login_user : {
				required : '帐号不得为空！',
				minlength : jQuery.format('帐号不得小于{0}位！'),
			},
			login_pass : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码不得小于{0}位！'),
				remote : '帐号或密码不正确！',
			}
		}
	});
	
/*选项卡——16.16*/
	$('#tabs').tabs();
	
/*折叠菜单——16.17*/
	$('#accordion').accordion({
		header : 'h3',
	});
	
	
});


/*特殊转换字符的函数*/
function replacePos(strObj,pos,replaceText){
	return strObj.substr(0,pos-1) + replaceText + strObj.substring(pos,strObj.length);
}























