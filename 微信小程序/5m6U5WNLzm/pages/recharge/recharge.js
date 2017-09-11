
var app = getApp()

Page({
  data: {
    itemList: [],
    selectedItem: {
      index: -1,
      id: '',
      description: ''
    }
  },
  onLoad: function(){
    this.getItemList();
  },
  // 获取已上架的储值项
  getItemList: function(){
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getStoredItems',
      success: function(res){
          if(res.data.length != 0){
            that.setData({
              'itemList': that.parseItemData(res.data),
              'selectedItem.index': 0,
              'selectedItem.id': res.data[0].id,
              'selectedItem.description': res.data[0].description
            });
          } else if(res.data.length == 0) {
            that.setData({
              'selectedItem.index': -1,
            });
          }
      }
    });
  },
  // 解析数据
  parseItemData: function(data){
    let array = [];
    let item = {};
    for(var i = 0; i < data.length; i++) {
      item = {};
      item.id = data[i].id;
      item.rechargeMoney = Number(data[i].price);
      item.giveMoney = Number(data[i].g_price);
      item.description = data[i].description;
      array.push(item);
    }
    return array;
  },
  // 选中储值项
  selectActiveItem: function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    that.setData({
      'selectedItem.index': index,
      'selectedItem.id': that.data.itemList[index].id,
      'selectedItem.description': that.data.itemList[index].description
    });
  },
  // 充值按钮
  gotoRecharge: function(event){
    let that = this;
    if(that.data.selectedItem.index == -1){
      app.showToast({
          'title': '商家尚未建立储值项',
          'icon': 'loading',
          'success': function(){
          }
      });
      return false;
    }
    if(that.data.selectedItem.id == ''){
      return false;
    }
    app.sendRequest({
      url: '/index.php?r=AppShop/creatStoredItemOrder',
      data:{
        'stored_id': that.data.selectedItem.id,
        'session_key': app.globalData.sessionKey
      },
      success: function(res){
        let orderId = res.data;
        app.sendRequest({
          url: '/index.php?r=AppShop/GetWxWebappPaymentCode',
          data: {
            order_id: orderId
          },
          success: function (res) {
            var param = res.data;
            param.orderId = orderId;
            param.success = function(){
              app.turnToPage('/pages/balance/balance', true);
            };
            app.wxPay(param);
          }
        });
      }
    });
  }
})

