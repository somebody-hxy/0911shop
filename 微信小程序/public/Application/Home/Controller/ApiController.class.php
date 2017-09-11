<?php
namespace Home\Controller;
use Think\Controller;
class ApiController extends Controller {
	//用户添加订单	
	public function getOrder(){
        $model=D('order');
        $company=$_POST['company'];
        $color=$_POST['o_color'];
        $size=$_POST['o_size'];
        $total=$_POST['o_total'];
        $name=$_POST['o_name'];
        $tel=$_POST['tel'];
        $remark=$_POST['remark'];
        if(!$model->create()){
            $this->ajaxReturn(array('result_code'=>101,'message'=>'获取失败'));
        }else{
            $num=date('Ymd').str_pad(1,4,0,STR_PAD_LEFT);
            $data=[
                'o_company'=>$company,
                'o_number'=>$num,
                'o_color'=>$color,
                'o_total'=>$total,
                'o_name'=>$name,
                'o_size'=>$size,
                'o_tel'=>$tel,
                'o_remark'=>$remark,
                'o_create_at'=>time(),
                'status'=>0,
            ];
            $result = $model->add($data);
            if($result!==false){
                $this->ajaxReturn(array('result_code'=>100, 'message'=>'操作成功','data'=>$data));
            }else{
                $this->ajaxReturn(array('result_code'=>101, 'message'=>'操作失败'));
            }
        }
    }
}