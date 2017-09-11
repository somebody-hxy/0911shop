<?php
namespace Admin\Controller;
class CompanyController extends BaseController {
	
	public function index(){
		$model = M('company');
		$count = $model->count();
		$page = $this->getPage($count);
		$list = $model->order('co_id asc')->limit($page['first'], $page['rows'])->select();
		$this->assign('list',$list);
		$this->assign('count',$count);
		$this->assign('page',$page);
		$this->display();
	}
	
	public function add(){
		if(IS_POST){
			$data['co_name'] = $_POST['co_name'];
			$data['co_people'] = $_POST['co_people'];
			$data['co_tel'] = $_POST['co_tel'];
			$data['co_address'] = $_POST['co_address'];
			$data['co_status'] = 1;
			if(!preg_match('/^1[34578]\d{9}$/',$data['co_tel'])){
            	$this->error('电话号码不正确');
        	}
			$result = M('company')->add($data);
			$this->checkResult($result, U('index'));
		}else{
			$this->display();
		}
	}
	
	public function edit(){
		if(IS_POST){
			$data['co_id'] = $_POST['co_id'];
            $data['co_name'] = $_POST['co_name'];
            $data['co_people'] = $_POST['co_people'];
            $data['co_tel'] = $_POST['co_tel'];
            $data['co_address'] = $_POST['co_address'];
			if(!preg_match('/^1[34578]\d{9}$/',$data['co_tel'])){
            	$this->error('电话号码不正确');
        	}
			$result = M('company')->save($data);
			$this->checkResult($result, U('index?curr='.I('post.curr').''));
		}else{
			$list = M('company')->where(array('co_id'=>I('get.id')))->find();
			$this->assign('list', $list);
			$this->assign('curr', I('get.curr'));
			$this->display();
		}
	}
	
	public function del(){
		$result = M('company')->where(array('co_id'=>I('get.id')))->delete();
		$this->checkResult($result, U('index?curr='.I('get.curr').''));
	}
}