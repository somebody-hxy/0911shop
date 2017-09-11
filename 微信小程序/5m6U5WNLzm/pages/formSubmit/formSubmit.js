var app = getApp()
Page({
  data: {
    // items: [
    //   { name: 's', value: 'S' },
    //   { name: 'm', value: 'M' },
    //   { name: 'l', value: 'L' },
    //   { name: 'xl', value: 'XL' },
    //   { name: 'xxl', value: 'XXL' },
    //   { name: 'xxxl', value: 'XXXL' },
    //   { name: 'xxxxl', value: 'XXXXL' },
    //   { name: 'outher', value: '其他' },
    // ]
  },
  //表单提交
  formSubmit: function (e) {
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    var company = e.detail.value.company
    var o_color = e.detail.value.o_color
    var o_total = e.detail.value.o_total
    var o_size = e.detail.value.o_size
    var o_name = e.detail.value.o_name
    var tel = e.detail.value.tel
    var remark = e.detail.value.remark
    if (o_total == null || o_total == "") {
      warn = "总数量不能为空";
      // console.log("不能为空")
      // this.setData(
      //   { popErrorMsg: "总数量不能为空" }
      // );
      // this.ohShitfadeOut();
      // return;
    } else if (o_size == null || o_size == "") {
      warn = "尺码不能为空";
    } else if (o_name == null || o_name == "") {
      warn = "姓名不能为空";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else {
      flag == false;
      var that = this;
      //？后面跟的是需要传递到下一个页面的参数
      wx.request({
        method: 'POST',
        url: 'http://127.0.0.1/public/index.php/Home/Api/getOrder.html',
        header: {
          // 'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          'company': company,
          'o_color': o_color,
          'o_total': o_total,
          'o_size': o_size,
          'o_name': o_name,
          'tel': tel,
          'remark': remark,
          // company: e.detail.value.company,
          // o_color: e.detail.value.o_color,
          // o_total: e.detail.value.o_total,
          // o_size: e.detail.value.o_size,
          // o_name: e.detail.value.o_name,
          // tel: e.detail.value.tel,
          // remark: e.detail.value.remark
        },
        success: function (res) {
          // debugger;
          console.log(res.data)
          wx.showToast({
            title: '订单提交成功',
            // image: '../Image/suess.png',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../goodsDetail/goodsDetail',
            })
          }, 2000)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    // flag = false;//若必要信息都填写，则不用弹框，且页面可以进行跳转

  }
})
