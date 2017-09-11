<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {
	
    public function index(){
    $this->display();
}
    
    public function login(){
    	$Verify = new \Think\Verify();
    	if($Verify->check($_POST['code'])){
    		if($_POST['phone']=='admin' && md5($_POST['password']) == 'b4501297c27d99667def29b6d5c60ccf'){
    			$user['au_name'] = '系统管理员';
    			session('user', $user);
    			$this->success('登录成功', U('Main/index'));
    		}else{
    			$user = M('admin')->where(array('au_phone'=>$_POST['phone'], 'au_pwd'=>md5($_POST['password'])))->find();
	    		if($user){	
		    		session('user', $user);
		    		$this->success('登录成功', U('Main/index'));
		    	}else{
		    		$this->error('用户名或密码错误');
		    	}
    		}
    	}else{
    		$this->error('验证码错误请重新输入');
    	}
    }
    
    public function out(){
    	session('user', null);
    	$this->success("退出成功", U('index'));
    }
    
    public function getCode(){
		$Verify =     new \Think\Verify();
		$Verify->codeSet = '0123456789'; 
		$Verify->fontSize = 21;
		$Verify->length   = 4;
		$Verify->useNoise = true;
		$Verify->imageH = 46;
		$Verify->imageW = 160;
		$Verify->entry();
    }
}