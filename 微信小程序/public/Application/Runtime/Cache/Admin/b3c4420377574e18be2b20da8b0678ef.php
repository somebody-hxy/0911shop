<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link href="/public/Public/admin/css/style.css" rel="stylesheet" type="text/css" />
	<link href="/public/Public/layui/css/layui.css" rel="stylesheet" type="text/css" />
	<script src="/public/Public/admin/js/jquery.min.js" language="JavaScript" ></script>
	<script src="/public/Public/layui/layui.js" language="JavaScript" ></script>
	<script type="text/javascript" charset="utf-8" src="/public/Public/ueditor/ueditor.config.js"></script>
	<script type="text/javascript" charset="utf-8" src="/public/Public/ueditor/ueditor.all.min.js"> </script>
	<script type="text/javascript" charset="utf-8" src="/public/Public/ueditor/lang/zh-cn/zh-cn.js"></script>
</head>

<body>
	<div class="place">
	    <span>位置：</span>
	    <ul class="placeul">
			<li>单位管理</li>
		    <li>单位列表</li>
		    <li>新增单位</li>
	    </ul>
   </div>
    <div class="formbody">
    	<div class="formtitle"><span>新增单位</span></div>
	    <form action="<?php echo U('add');?>" method="post" class="layui-form">
			<div class="layui-form-item">
				<div class="layui-inline">
					<label class="layui-form-label">单位名称</label>
					<div class="layui-input-inline"><input type="text" name="co_name" class="layui-input"></div>
				</div>
			</div>
			<div class="layui-form-item">
				<div class="layui-inline">
					<label class="layui-form-label">单位负责人</label>
					<div class="layui-input-inline"><input type="text" name="co_people"  class="layui-input"></div>
				</div>
			</div>
			<div class="layui-form-item">
				<div class="layui-inline">
					<label class="layui-form-label">负责人电话</label>
					<div class="layui-input-inline"><input type="text" name="co_tel" lay-verify="phone" class="layui-input"></div>
				</div>
			</div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">单位地址</label>
                    <div class="layui-input-inline"><input type="text" name="co_address"  class="layui-input"></div>
                </div>
            </div>
			<div class="layui-form-item">
	            <div class="layui-input-block">
	                <button class="layui-btn layui-btn-small layui-btn-normal" lay-submit  lay-filter="sub">确认保存</button>
	                <button class="layui-btn layui-btn-small layui-btn-primary" onclick="history.go(-1)">返回操作</button>
	            </div>
        	</div>
	    </form>
    </div>
</body>
</html>
<script>
layui.use('form', function(){
	var form = layui.form();
	form.on('submit(sub)', function(data){
        
    });
});
</script>