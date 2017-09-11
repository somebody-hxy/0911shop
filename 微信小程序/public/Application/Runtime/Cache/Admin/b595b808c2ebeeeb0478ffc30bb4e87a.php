<?php if (!defined('THINK_PATH')) exit();?>﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>后台管理系统</title>
<link href="/public/Public/admin/css/style.css" rel="stylesheet" type="text/css" />
<script src="/public/Public/admin/js/jquery.min.js" language="JavaScript" ></script>
<script src="/public/Public/layer/layer.js" language="JavaScript" ></script>
<script language="javascript">
$(function(){
    $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
    $(window).resize(function(){  
        $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
    })  
});  
</script> 
</head>
<body class="login">
    <div class="logintop"><span>欢迎登录后台管理系统</span></div>
    <div class="loginbody">
        <span class="systemlogo"></span>
        <div class="loginbox">
            <form action="<?php echo U('Index/login');?>" method="post">
            <ul>
                <li><input name="phone" type="text" class="loginuser" placeholder="帐号"  /></li>
                <li><input name="password" type="password" class="loginpwd" placeholder="密码" /></li>
                <li>
                    <input name="code" type="text" class="logincode" placeholder="验证码" style="float: left;" />
                    <div  style="float: left;margin-left: 15px;"><img src="<?php echo U('Index/getCode');?>" onclick="this.src='<?php echo U('Index/getCode');?>'" /></div>
                    <div style="clear: both;"></div>
                </li>
                <li><input id="sub" type="submit" class="loginbtn" value="登录"   /></li>
            </ul>
            </form>
        </div>
    </div>
    <div class="loginbm">版权所有&nbsp;&nbsp;2017&nbsp;&nbsp;四川互联互加科技有限公司</div>
</body>
</html>
<script>
$("#sub").click(function(){
	var username = $(".loginuser").val();
	var loginpwd = $(".loginpwd").val();
	var logincode = $(".logincode").val();

	if(username==""){
		layer.msg('帐号不能为空', {icon:5, shade:[0.5, '#000000'], shadeClose:true});
		return false;
	}
	if(loginpwd==""){
		layer.msg('密码不能为空', {icon:5, shade:[0.5, '#000000'], shadeClose:true});
		return false;
	}
	if(logincode==""){
		layer.msg('验证码不能为空', {icon:5, shade:[0.5, '#000000'], shadeClose:true});
		return false;
	}
});
</script>