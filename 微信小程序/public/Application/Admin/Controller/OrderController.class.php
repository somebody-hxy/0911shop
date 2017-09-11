<?php
namespace Admin\Controller;
class OrderController extends BaseController {
	
	public function index(){
		$model = M('order');
		$where['o_del'] = 0;
		$count = $model->where($where)->count();
		$page = $this->getPage($count);
		$list = $model->where($where)->order('o_id asc')->limit($page['first'], $page['rows'])->select();
		$this->assign('list',$list);
		$this->assign('count',$count);
		$this->assign('page',$page);
		$this->display();
	}
	
	public function add(){
		if(IS_POST){
			$data['o_name'] = I('post.o_name');
			$data['o_pic'] = I('post.o_pic');
			$data['o_detail'] = htmlspecialchars_decode(I('post.o_detail'));
			$data['o_del'] = 0;
			
			$result = M('order')->add($data);
			$this->checkResult($result, U('index'));
		}else{
			$this->display();
		}
	}
	
	public function edit(){
		if(IS_POST){
			$data['o_id'] = I('post.o_id');
			$data['o_name'] = I('post.o_name');
			$data['o_pic'] = I('post.o_pic');
			$data['o_detail'] = htmlspecialchars_decode(I('post.o_detail'));
			$data['o_del'] = 0;
			
			$result = M('order')->save($data);
			$this->checkResult($result, U('index?curr='.I('post.curr').''));
		}else{
			$list = M('order')->where(array('o_id'=>I('get.id')))->find();
			$this->assign('list', $list);
			$this->assign('curr', I('get.curr'));
			$this->display();
		}
	}
	
	public function del(){
		$result = M('order')->delete(I('get.id'));
		$this->checkResult($result, U('index?curr='.I('get.curr').''));
	}
}