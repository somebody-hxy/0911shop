<?php
namespace Admin\Controller;
use Think\Controller;
class BaseController extends Controller {
	
	public function _initialize(){
		if(session('user')=="")
			$this->redirect('Index/index');
	}
	
	/**
	 * 分页参数计算
	 * curr 当前页数
	 * rows 每页显示条数
	 * pages 共分几页
	 * first 起始数据
	 */
	public function getPage($count, $rows=30){
		$data['curr'] = I('get.curr',1);
		$data['rows'] = $rows;
		$data['pages'] =  ceil($count/$data['rows']);
		$data['groups'] = 10;
		$data['first'] = ($data['curr']-1)*$data['rows']; 
		return $data;
	}
	
	/**
	 * 上传图片
	 */
	public function upload(){
		$upload = new \Think\Upload();											// 实例化上传类
		$upload->maxSize = 1024*1024*10 ;										// 设置附件上传大小
		$upload->exts = array('jpg', 'gif', 'png', 'jpeg');						// 设置附件上传类型
		$upload->rootPath = './Uploads/'; 										// 设置附件上传根目录
		$upload->savePath = '/images/';
		$info = $upload->uploadOne($_FILES['upload_pic']);
		if($info){
			$res['result_code'] = 100;
			$res['file'] = '/Uploads'.$info['savepath'].$info['savename'];
		}else{
			$res['result_code'] = 101;
		}
		$this->ajaxReturn($res);
	}
	
	/**
	 * 验证更新数据是否成功
	 * $result [操作返回值]
	 */
	public function checkResult($result, $href){
		if($result!==false){
			$this->success('操作成功', $href);
		}else{
			$this->error('操作失败', $href);	
		}
	}
	
	
}