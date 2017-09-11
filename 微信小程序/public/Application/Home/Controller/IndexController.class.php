<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends Controller {

//    public function index(){
//        $this->display();
//    }

    public function checkUserInfo(){
    	$wechat = new \Org\Tool\Wechat();
    	$res = $wechat->getLoginUserInfo(I('post.code'));
    	if($res['openid']){
    		$member = M('member')->where(array('m_openid'=>$res['openid']))->find();
    		if($member){
    			session('memberid', $member['m_id']);
    		}else{
    			$data['m_openid'] = $res['openid'];
    			$data['m_addtime'] = time();
    			$memberid = M('member')->add(array('m_openid'=>$res['openid'], 'm_addtime'=>time()));
    			session('memberid', $memberid);
    		}
    		$this->ajaxReturn(array('result_code'=>100,'message'=>'操作成功', 'data'=>array('sessionid'=>session_id())));
    	}else{
    		$this->ajaxReturn(array('result_code'=>101,'message'=>'操作失败'));
    	}
    }
    
    //首页讲师-视频列表接口
	public function getIndex(){
		$list1 = M('lecturer')->where(array('l_del'=>0))->order('l_id desc')->limit(10)->select();
		$list3 = M('category')->where(array('c_del'=>0))->order('c_id desc')->limit(10)->select();
		$list2 = M('video')->where(array('v_del'=>0))->order('v_id desc')->limit(10)->select();
		if($list1 || $list2 ||$list3){
			$this->ajaxReturn(array('result_code'=>100,'message'=>'获取成功', 'data'=>array('lecturer'=>$list1, 'video'=>$list2, 'card_category'=>$list3)));
		}else{
			$this->ajaxReturn(array('result_code'=>101,'message'=>'获取失败'));
		}
	}
	
	public function getAbout(){
		$list = M('about')->where(array('a_id'=>1))->find();
		$this->ajaxReturn(array('result_code'=>100, 'message'=>'操作成功', 'data'=>array('list'=>$list)));
	}
}