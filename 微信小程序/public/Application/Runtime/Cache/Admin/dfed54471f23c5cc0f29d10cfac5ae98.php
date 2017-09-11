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
		    <li>商品管理</li>
		    <li>商品分类</li>
		    <li>修改分类</li>
	    </ul>
   </div>
    <div class="formbody">
    	<div class="formtitle"><span>修改分类</span></div>
	    <form action="<?php echo U('edit');?>" method="post" class="layui-form">
	    	<input type="hidden" name="curr" value="<?php echo ($curr); ?>">
	    	<input type="hidden" name="c_id" value="<?php echo ($list["c_id"]); ?>">
			<div class="layui-form-item">
				<div class="layui-inline">
					<label class="layui-form-label">分类名称</label>
					<div class="layui-input-inline"><input type="text" name="c_name" value="<?php echo ($list["c_name"]); ?>" lay-verify="required" class="layui-input"></div>
				</div>
			</div>

			<div class="layui-form-item">
				<div class="layui-inline">
					<label class="layui-form-label">所属分类</label>
					<div class="layui-input-inline">
						
						<select name="c_parent_id" style="display: block;border: 1px solid #ddd;height: 30px;">
							<option value="0">顶级分类</option>
							<?php if(is_array($list2)): foreach($list2 as $key=>$v): ?><option value="<?php echo ($v["c_id"]); ?>"><?php echo ($v["c_name"]); ?></option><?php endforeach; endif; ?>
						</select>
					</div>				
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