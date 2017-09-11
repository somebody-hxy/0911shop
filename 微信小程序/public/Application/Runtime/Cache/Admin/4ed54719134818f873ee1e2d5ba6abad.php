<?php if (!defined('THINK_PATH')) exit();?>﻿<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link href="/public/Public/admin/css/style.css" rel="stylesheet" type="text/css" />
</head>

<body class="top">
    <div class="topleft"><img src="/Public/admin/images/logo.png" /></div>   
    <div class="topright">    
        <ul>
            <!-- <li><span><img src="/Public/admin/images/help.png" title="帮助"  class="helpimg"/></span><a href="javascript:;">帮助</a></li>
            <li><a href="javascript:;">关于</a></li> -->
            <li><a href="<?php echo U('Index/out');?>" target="_parent">退出</a></li>
        </ul>
        <div class="user">
            <span><?php echo ($_SESSION['user']['au_name']); ?></span>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>    
    </div>
</body>
</html>