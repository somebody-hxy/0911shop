
var app = getApp()

Page({
  data: {
    status: 0,              // 0: 普通页面 1:有集集乐的情况
    orderId: '',            // 订单号
    franchiseeId: '',       // 子店id
    wayOfDine: 0,           // 1:点餐, 2:预约
    queueNum: 0,            // 取餐号
    durationTime: 0,
    appointmentTime: 0,
    collectBenefitData: {}, // 集集乐数据
    starData: [],           // 集集乐的星 light:已集样式 dark:未集样式
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      'orderId': options.detail,
      'franchiseeId': options.franchisee
    });
    that.getOrderDetail();
    if(options.collectBenefit == 1){
      that.getCollectBenefitData(options.detail);
      that.setData({
        'status': 1
      });
    }
  },
  getOrderDetail: function(){
    var that = this;
    app.getOrderDetail({
      data: {
        order_id: that.data.orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function (res) {
        var tostore_data = res.data[0].form_data.tostore_data;

        that.setData({
          wayOfDine: tostore_data.tostore_order_type,
          queueNum: tostore_data.formatted_queue_num,
          appointmentTime: tostore_data.tostore_appointment_time.substr(11,5),
          durationTime: tostore_data.duration_time
        })
      }
    })
  },
  // 获取集集乐数据
  getCollectBenefitData: function(id){
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppMarketing/CollectmeSendCoupon',
      data: {
        'order_id': id,
      },
      hideLoading: true,
      success: function(res){
        let starData = [];
        for(var i = 0; i < res.data.star_num; i++){
          starData.push('light');
        }
        for(var i = 0; i < res.data.collect_num - res.data.star_num; i++){
          starData.push('dark');
        }
        that.setData({
          'collectBenefitData': res.data,
          'starData': starData
        });
      }
    });
  },
  goToHomepage: function(){
    var homepageRouter = app.getHomepageRouter();
    app.turnToPage('/pages/'+homepageRouter+'/'+homepageRouter, 1);
  },
  goToOrderDetail: function(){
    app.turnToPage('/pages/tostoreOrderDetail/tostoreOrderDetail?detail=' + this.data.orderId, 1);
  }
})
