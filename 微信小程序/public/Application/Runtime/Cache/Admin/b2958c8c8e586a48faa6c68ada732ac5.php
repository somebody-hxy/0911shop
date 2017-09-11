<?php if (!defined('THINK_PATH')) exit();?>﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<style type="text/css">
body {margin: 0px; padding:0px; font-family:"微软雅黑", Arial, "Trebuchet MS", Verdana, Georgia,Baskerville,Palatino,Times; font-size:16px;}
ul{display:block;margin:0;padding:0;list-style:none;}
li{display:block;margin:0;padding:0;list-style: none;}
.place{height:40px; background:url(/Public/admin/images/righttop.gif) repeat-x;}
.place span{line-height:40px; font-weight:bold;float:left; margin-left:12px;font-size: 9px;}
.placeul li{float:left; line-height:40px; padding-left:7px; padding-right:12px; background:url(/Public/admin/images/rlist.gif) no-repeat right;font-size: 9px;}
.placeul li:last-child{background:none;}

h1{margin:0;font-weight:normal; font-family: "微软雅黑", Arial, "Trebuchet MS", Helvetica, Verdana ;}
.page{width:600px; padding:20px 20px 40px 20px; margin-top:80px;border-style:dashed;border-color:#e4e4e4;line-height:30px;margin-left:auto; margin-right:auto;}
.page h1{font-size:30px; color:red; padding:20px 0px 10px 0px;}
.page font{color:#666;}
.page font a{text-decoration: none; color: #1064A0;}
.page font a:hover{color: #0078D2;}
</style>
</head>

<body>
	<div class="place">
		<span>位置：</span>
		<ul class="placeul">
			<li>跳转提示</li>
		</ul>
	</div>
	<div class="page">
		<h1><?php echo ($error); ?></h1>
		<font> 页面自动 <a id="href" href="<?php echo ($jumpUrl); ?>">跳转</a> 等待时间： <b id="wait"><?php echo ($waitSecond); ?></b></font>
	</div>
</body>
</html>
<script type="text/javascript">
(function(){
	var wait = document.getElementById('wait'),
	href = document.getElementById('href').href;
	var interval = setInterval(function(){
		var time = --wait.innerHTML;
		if(time <= 0) {
			location.href = href;
			clearInterval(interval);
		};
	}, 1000);
})();
</script>