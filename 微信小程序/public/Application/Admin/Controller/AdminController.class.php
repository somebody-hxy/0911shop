<?php
namespace Admin\Controller;
class AdminController extends BaseController {
	
	public function index(){
		$model = M('admin');
		$count = $model->count();
		$page = $this->getPage($count);
		$list = $model->order('au_id asc')->limit($page['first'], $page['rows'])->select();
		$this->assign('list',$list);
		$this->assign('count',$count);
		$this->assign('page',$page);
		$this->display();
	}
	
	public function add(){
		if(IS_POST){
			$data['au_phone'] = $_POST['au_phone'];
			$data['au_pwd'] = md5($_POST['au_pwd']);
			$data['au_name'] = $_POST['au_name'];
			
			$result = M('admin')->add($data);
			$this->checkResult($result, U('index'));
		}else{
			$this->display();
		}
	}
	
	public function edit(){
		if(IS_POST){
			$data['au_id'] = $_POST['au_id'];
			$data['au_phone'] = $_POST['au_phone'];
			$data['au_name'] = $_POST['au_name'];
			if($_POST['au_pwd'])
				$data['au_pwd'] = md5($_POST['au_pwd']);

			$result = M('admin')->save($data);
			$this->checkResult($result, U('index?curr='.I('post.curr').''));
		}else{
			$list = M('admin')->where(array('au_id'=>I('get.id')))->find();
			$this->assign('list', $list);
			$this->assign('curr', I('get.curr'));
			$this->display();
		}
	}
	
	public function del(){
		$result = M('admin')->where(array('au_id'=>I('get.id')))->delete();
		$this->checkResult($result, U('index?curr='.I('get.curr').''));
	}
}