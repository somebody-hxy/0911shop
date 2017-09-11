var WxParse = require('components/wxParse/wxParse.js');
var util    = require('utils/util.js');
// var wxValidate = require('utils/wxValidate.js');
import wxValidate from 'utils/wxValidate'

App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  onLaunch: function () {
    var userInfo;
    if(userInfo = wx.getStorageSync('userInfo')){
      this.globalData.userInfo = userInfo;
    }
    this.getSystemInfo();
    this.appInitial();
  },
  appInitial: function () {
    wx.request({
      url: this.globalData.siteBaseUrl +'/index.php?r=AppUser/MarkWxXcxStatus',
      data: {
        app_id: this.getAppId()
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    });
  },
  onShow: function (options) {
    if( options && options.scene && options.scene == 1011){
      this.globalData.urlLocationId = options.query.location_id || '';
      if (options.query.user_token){
        this._getPromotionUserToken({
          user_token: options.query.user_token
        });
      }
      if (options.query.leader_user_token) {
        var that = this;      
        that.showModal({
          content: '是否要成为推广人员的团员',
          showCancel: true,
          confirm: function () {
            that._getPromotionUserToken({
              leader_user_token: options.query.leader_user_token
            });
          }
        })
      }
    }
  },
  _getPromotionUserToken: function (param) {
    var that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppDistribution/userBind',
      method: 'post',
      data: param,
      success:function(res){
        that.setPageTitle(res.data.shop_name + '的小店');
      },
      successStatusAbnormal:function(res){
        if(res.status == 99){
          let homepageRouter = that.getHomepageRouter();
          that.turnToPage('/pages/' + homepageRouter + '/' + homepageRouter, true);
        }
        if (res.status == 100){
          that.turnToPage('/pages/promotionApply/promotionApply', true);
        }
      }
    });
  },


  getSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.systemInfo = res;
      }
    });
  },
  sendRequest: function (param, customSiteUrl) {
    let that   = this;
    let data   = param.data || {};
    let header = param.header;
    let requestUrl;

    if(data.app_id){
      data._app_id = data.app_id;
    } else {
      data._app_id = data.app_id = this.getAppId();
    }

    if(!this.globalData.notBindXcxAppId){
      data.session_key = this.getSessionKey();
    }

    if(customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl + param.url;
    }

    if(param.method){
      if(param.method.toLowerCase() == 'post'){
        data = this._modifyPostParam(data);
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      }
      param.method = param.method.toUpperCase();
    }

    if(!param.hideLoading){
      this.showToast({
        title: '请求中...',
        icon: 'loading'
      });
    }
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.statusCode && res.statusCode != 200){
          that.hideToast();
          that.showModal({
            content: ''+res.errMsg
          });
          typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
          return;
        }
        if(res.data.status){
          if(res.data.status == 2 || res.data.status == 401){
            that.goLogin({
              success: function () {
                that.sendRequest(param, customSiteUrl);
              },
              fail: function () {
                typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
              }
            });
            return;
          }
          if(res.data.status != 0){
          // 服务器返回请求错误
            that.hideToast();
            that.showModal({
              content: ''+res.data.data
            });
            typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
            return;
          }
        }
        typeof param.success == 'function' && param.success(res.data);
      },
      fail: function(res){
        that.hideToast();
        that.showModal({
          content: '请求失败 '+res.errMsg
        })
        typeof param.fail == 'function' && param.fail(res.data);
      },
      complete: function(res){
        // wx.hideLoading();
        param.hideLoading || that.hideToast();
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });
  },
  _modifyPostParam: function (obj) {
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  turnToPage: function (url, isRedirect) {
    var tabBarPagePathArr = this.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if(tabBarPagePathArr.indexOf(url) != -1) {
      this.switchToTab(url);
      return;
    }
    if(!isRedirect){
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },
  reLaunch: function (options) {
    wx.reLaunch({
      url: options.url,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  reLaunch: function (options) {
    wx.reLaunch({
      url: options.url,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  switchToTab: function (url) {
    wx.switchTab({
      url: url
    });
  },
  turnBack: function (options) {
    wx.navigateBack({
      delta: options ? (options.delta || 1) : 1
    });
  },
  navigateToXcx: function (appid) {
    let that = this;
    if(wx.navigateToMiniProgram){
      wx.navigateToMiniProgram({
        appId: appid,
        fail: function (res) {
          that.showModal({
            content: '' + res.errMsg
          })
        }
      });
    }
  },
  setPageTitle: function (title) {
    wx.setNavigationBarTitle({
      title: title
    });
  },
  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function(res){
        typeof param.success == 'function' && param.success(res);
      },
      fail: function(res){
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function(res){
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  hideToast: function () {
    wx.hideToast();
  },
  showModal: function (param) {
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function(res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function(res){
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function(res){
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  chooseVideo: function(callback, maxDuration){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: maxDuration || 60,
      camera: ['front', 'back'],
      success: function (res) {
        typeof callback == 'function' && callback(res.tempFilePaths[0]);
      }
    })
  },
  chooseImage: function(callback, count){
    var that = this;
    wx.chooseImage({
      count: count || 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths,
            imageUrls = [];

        that.showToast({
          title: '提交中...',
          icon: 'loading',
          duration: 10000
        });
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url : that.globalData.siteBaseUrl+ '/index.php?r=AppData/uploadImg',
            filePath: tempFilePaths[i],
            name: 'img_data',
            success: function(res){
              var data = JSON.parse(res.data);
              if(data.status == 0){
                imageUrls.push(data.data);
                if(imageUrls.length == tempFilePaths.length){
                  that.hideToast();
                  typeof callback == 'function' && callback(imageUrls);
                }
              } else {
                that.showModal({
                  content: data.data
                })
              }
            },
            fail: function (res) {
              console.log(res.errMsg);
            },
            complete: function () {
              that.hideToast();
            }
          })
        }

      }
    })
  },
  previewImage: function (options) {
    wx.previewImage({
      current: options.current || '',
      urls: options.urls || [options.current]
    })
  },
  playVoice: function (filePath) {
    wx.playVoice({
      filePath: filePath
    });
  },
  pauseVoice: function () {
    wx.pauseVoice();
  },
  // 统计用户分享
  countUserShareApp: function () {
    this.sendRequest({
      url: '/index.php?r=AppShop/UserShareApp'
    });
  },
  shareAppMessage: function (options) {
    var that = this;
    return {
      title: options.title || this.getAppTitle() || '即速应用',
      desc: options.desc || this.getAppDescription() || '即速应用，拖拽生成app，无需编辑代码，一键打包微信小程序',
      path: options.path,
      success: function () {
        // 统计用户分享
        that.countUserShareApp();
      }
    }
  },

  wxPay: function (param) {
    var _this = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': 'MD5',
      'paySign': param.paySign,
      success: function(res){
        _this.wxPaySuccess(param);
        typeof param.success === 'function' && param.success();
      },
      fail: function(res){
        if(res.errMsg === 'requestPayment:fail cancel'){
          typeof param.fail === 'function' && param.fail();
          return;
        }
        if(res.errMsg === 'requestPayment:fail'){
          res.errMsg = '支付失败';
        }
        _this.showModal({
          content: res.errMsg
        })
        _this.wxPayFail(param, res.errMsg);
        typeof param.fail === 'function' && param.fail();
      }
    })
  },
  wxPaySuccess: function (param) {
    var orderId = param.orderId,
        goodsType = param.goodsType,
        formId = param.package.substr(10),
        t_num = goodsType == 1 ? 'AT0104':'AT0009';

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: t_num,
        order_id: orderId
      }
    })
  },
  wxPayFail: function (param, errMsg) {
    var orderId = param.orderId,
        formId = param.package.substr(10);

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: 'AT0010',
        order_id: orderId,
        fail_reason: errMsg
      }
    })
  },
  // 拨打电话
  makePhoneCall: function (number, callback) {
    if(number.currentTarget){
      var dataset = number.currentTarget.dataset;

      number = dataset.number;
    }
    wx.makePhoneCall({
      phoneNumber: number,
      success: callback
    })
  },
  // 获取地理位置
  getLocation: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success: options.success,
      fail: options.fail
    })
  },
  // 选择地图上位置
  chooseLocation: function (options) {
    wx.chooseLocation({
      success: function(res){
        console.log(res);
        options.success(res);
      },
      cancel: options.cancel,
      fail: options.fail
    });
  },
  openLocation: function (options) {
    wx.openLocation(options);
  },
  setClipboardData: function (options) {
    wx.setClipboardData({
      data: options.data || '',
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  getClipboardData: function (options) {
    wx.getClipboardData({
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  showShareMenu: function (options) {
    options = options || {};
    wx.showShareMenu({
      withShareTicket: options.withShareTicket || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  scanCode: function (options) {
    options = options || {};
    wx.scanCode({
      onlyFromCamera: options.onlyFromCamera || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  pageScrollTo: function (scrollTop) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: scrollTop
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
    }
  },
  getAuthSetting: function () {
    wx.getSetting({
      success: function (res) {
        return res.authSetting;
      },
      fail: function () {
        return {};
      }
    })
  },

  goLogin: function (options) {
    this._sendSessionKey(options);
  },
  isLogin: function () {
    return this.getIsLogin();
  },
  // 向服务器发送本地储存的sessionkey 如果没有sessionkey则调用微信登录接口
  _sendSessionKey: function (options) {
    var that = this;
    try {
      var key = wx.getStorageSync('session_key');
    } catch(e) {
      console.log('wx.getStorageSync session_key error');
      console.log(e);
    }

    if (!key) {
      console.log("check login key=====");
      this._login(options);

    } else {
      this.globalData.sessionKey = key;
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppUser/onLogin',
        success: function (res) {
          if (!res.is_login) {
            // 如果没有登录
            that._login(options);
            return;
          } else if (res.is_login == 2) {
            // 没有绑定appId
            that.globalData.notBindXcxAppId = true;
          }
          that._requestUserInfo(res.is_login, options);
        },
        fail: function (res) {
          console.log('_sendSessionKey fail');
          typeof options.fail == 'function' && options.fail();
        }
      });
    }
  },
  _login: function (options) {
    var that = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          that._sendCode(res.code, options);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        console.log('login fail: '+res.errMsg);
      }
    })
  },
  _sendCode: function (code, options) {
    var that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/onLogin',
      data: {
        code: code
      },
      success: function (res) {
        if (res.is_login == 2) {
          that.globalData.notBindXcxAppId = true;
        }
        that.setSessionKey(res.data);
        that._requestUserInfo(res.is_login, options);
      },
      fail: function (res) {
        console.log('_sendCode fail');
      }
    })
  },
  _requestUserInfo: function (is_login, options) {
    if (is_login==1) {
      this._requestUserXcxInfo(options);
    } else {
      this._requestUserWxInfo(options);
    }
  },
  _requestUserXcxInfo: function (options) {
    var that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/getXcxUserInfo',
      success: function (res) {
        if (res.data) {
          that.setUserInfoStorage(res.data);
        }
        that.setIsLogin(true);
        typeof options.success === 'function' && options.success();
      },
      fail: function (res) {
        console.log('_requestUserXcxInfo fail');
      }
    })
  },
  _requestUserWxInfo: function (options) {
    var that = this;

    wx.getUserInfo({
      success: function (res) {
        that._sendUserInfo(res.userInfo, options);
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '获取用户信息失败，这将影响您使用小程序，是否重新设置授权？',
          showCancel: true,
          cancelText: "否",
          confirmText: "是",
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  if(res.authSetting['scope.userInfo'] === true){
                    that._requestUserWxInfo(options);
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户取消授权个人信息');
              typeof options.fail == 'function' && options.fail();
            }
          }
        })        
      }
    })
  },
  _sendUserInfo: function (userInfo, options) {
    var that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/LoginUser',
      method: 'post',
      data: {
        nickname: userInfo['nickName'],
        gender: userInfo['gender'],
        city: userInfo['city'],
        province: userInfo['province'],
        country: userInfo['country'],
        avatarUrl: userInfo['avatarUrl']
      },
      success: function (res) {
        if(res.status == 0){
          that.setUserInfoStorage(res.data.user_info);
        }
        typeof options.success === 'function' && options.success();
        that.setIsLogin(true);
      },
      fail: function (res) {
        console.log('_requestUserXcxInfo fail');
        typeof options.fail == 'function' && options.fail(res);
      }
    })
  },

  onPageLoad: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let detail        = event.detail;
    let promotionName = event.promotionName;

    pageInstance.setData({
      dataId: detail,
      addShoppingCartShow: false,
      addTostoreShoppingCartShow: false
    });
    this.setPageUserInfo();
    if (detail) {
      pageInstance.dataId = detail;
    }
    if (promotionName) {
      var userInfo = this.getUserInfo();
      this.setPageTitle(userInfo.nickname + '的小店');
    }
    pageInstance.dataInitial();
    pageInstance.suspensionBottom();
  },

  pageDataInitial: function () {
    let _this          = this;
    let pageInstance   = this.getAppCurrentPage();
    let pageRequestNum = pageInstance.requestNum;
    let newdata        = {};

    if (!!pageInstance.dataId && !!pageInstance.page_form) {
      var dataid = parseInt(pageInstance.dataId);
      var param = {};

      param.data_id = dataid;
      param.form = pageInstance.page_form;

      pageInstance.requestNum = pageRequestNum + 1;
      _this.sendRequest({
        hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
        url: '/index.php?r=AppData/getFormData',
        data: param,
        method: 'post',
        success: function (res) {
          if (res.status == 0) {
            let newdata = {},
                formdata = res.data[0].form_data;

            for (let i in formdata) {
              if (i == 'category') {
                continue;
              }

              let description = formdata[i];
              if (!description) {
                continue;
              }
              // 检测如果不是一个图片链接的话就解析
              if (typeof description == 'string' && !/^http:\/\/img/g.test(description)) {
                formdata[i] = _this.getWxParseResult(description);
              }
            }
            newdata['detail_data'] = formdata;
            pageInstance.setData(newdata);

            if (!!pageInstance.dynamicVesselComps) { // 处理动态容器请求
              for (let i in pageInstance.dynamicVesselComps) {
                let vessel_param = pageInstance.dynamicVesselComps[i].param;
                let compid = pageInstance.dynamicVesselComps[i].compid;
                if (vessel_param.param_segment === 'id') {
                  vessel_param.idx = vessel_param.search_segment;
                  vessel_param.idx_value = pageInstance.dataId;
                } else if (!!newdata.detail_data[vessel_param.param_segment]) {
                  vessel_param.idx = vessel_param.search_segment;
                  vessel_param.idx_value = newdata.detail_data[vessel_param.param_segment];
                  if (!(typeof vessel_param.idx_value == 'string')) {
                    let iv = vessel_param.idx_value[0];
                    if ( iv == '') {
                      vessel_param.idx_value = '';
                    } else {
                      vessel_param.idx_value = iv.text;
                    }
                  }
                }
                pageInstance.requestNum = pageRequestNum + 1;
                _this.sendRequest({
                  hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                  url: '/index.php?r=AppData/getFormDataList&idx_arr[idx]=' + vessel_param.idx + "&idx_arr[idx_value]=" + vessel_param.idx_value,
                  data: {
                    app_id: vessel_param.app_id,
                    form: vessel_param.form,
                    page: 1
                  },
                  method: 'post',
                  success: function (res) {
                    let newDynamicData = {},
                        form_data = res.data[0].form_data;

                    if (param.form !== 'form') {
                      for (let k in form_data) {
                        if (k == 'category') {
                          continue;
                        }

                        let description = form_data[k];

                        if (!description) {
                          continue;
                        }
                        // 检测如果不是一个图片链接的话就解析
                        if (typeof description === 'string' && !/^http:\/\/img/g.test(description)) {
                          form_data[k] = _this.getWxParseResult(description);
                        }
                      }
                    }

                    newDynamicData['dynamic_vessel_data_' + compid] = res.data[0];
                    pageInstance.setData(newDynamicData);
                  },
                  fail: function () {
                    console.log("[fail info]dynamic-vessel data request  failed");
                  }
                });
              }
            }
          }
        },
        complete: function () {
          pageInstance.setData({
            page_hidden: false
          });
        }
      })
    } else {
      pageInstance.setData({
        page_hidden: false
      });
    }

    if (!!pageInstance.carouselGroupidsParams) {
      for (let i in pageInstance.carouselGroupidsParams) {
        let compid = pageInstance.carouselGroupidsParams[i].compid;
        let carouselgroupId = pageInstance.carouselGroupidsParams[i].carouselgroupId;
        let url = '/index.php?r=AppExtensionInfo/carouselPhotoProjiect';

        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: url,
          data: {
            type: carouselgroupId
          },
          method: 'post',
          success: function (res) {
            newdata = {};
            if (res.data.length) {
              let content = [];
              for (let j in res.data) {
                let form_data = JSON.parse(res.data[j].form_data);
                if (form_data.isShow == 1) {
                  let eventParams = {};
                  let eventHandler = "";
                  switch (form_data.action) {
                    case "goods-trade":
                      eventHandler = "tapGoodsTradeHandler";
                      eventParams = '{"goods_id":"' + form_data['goods-id'] + '","goods_type":"' + form_data['goods-type'] + '"}'
                      break;
                    case "inner-link":
                      eventHandler = "tapInnerLinkHandler";
                      let pageLink = form_data['page-link'];
                      let pageLinkPath = '/pages/'+pageLink+'/'+pageLink;
                      eventParams = '{"inner_page_link":"'+pageLinkPath+'","is_redirect":0}'
                      break;
                    case "call":
                      eventHandler = "tapPhoneCallHandler";
                      eventParams = '{"phone_num":"' + form_data['phone-num'] + '"}';
                      break;
                    case "get-coupon":
                      eventHandler = "tapGetCouponHandler";
                      eventParams = '{"coupon_id":"' + form_data['coupon-id'] + '"}';
                      break;
                    case "community":
                      eventHandler = "tapCommunityHandler";
                      eventParams = '{"community_id":"' + form_data['community-id'] + '"}';
                      break;
                    case "to-franchisee":
                      eventHandler = "tapToFranchiseeHandler";
                      eventParams = '{"franchisee_id":"' + form_data['franchisee-id'] + '"}';
                      break;
                    default:
                      eventHandler = "";
                      eventParams = "{}";
                  }
                  content.push({
                    "customFeature": [],
                    'page-link': form_data['page-link'],
                    'pic': form_data.pic,
                    "content": "",
                    "parentCompid": "carousel1",
                    "style": "",
                    eventHandler: eventHandler,
                    eventParams: eventParams
                  })
                }
              }
              console.log(content);
              newdata[compid] = {};
              newdata[compid].type = pageInstance.data[compid].type;
              newdata[compid].style = pageInstance.data[compid].style;
              newdata[compid].content = content;
              newdata[compid].customFeature = pageInstance.data[compid].customFeature;
              newdata[compid].animations = [];
              newdata[compid].page_form = "";
              newdata[compid].compId = compid;

              pageInstance.setData(newdata);
            }
          }
        });
      }
    }


    if (!!pageInstance.list_compids_params) {
      for (let i in pageInstance.list_compids_params) {
        let compid = pageInstance.list_compids_params[i].compid;
        let param = pageInstance.list_compids_params[i].param;
        let url = '/index.php?r=AppData/getFormDataList';

        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: url,
          data: param,
          method: 'post',
          success: function (res) {
            if (res.status == 0) {
              newdata = {};

              if (param.form !== 'form') {
                for (let j in res.data) {
                  for (let k in res.data[j].form_data) {
                    if (k == 'category') {
                      continue;
                    }

                    let description = res.data[j].form_data[k];

                    if (!description) {
                      continue;
                    }
                    // 检测如果不是一个图片链接的话就解析
                    if(typeof description === 'string' && !/^http:\/\/img/g.test(description)){
                      res.data[j].form_data[k] = _this.getWxParseResult(description);
                    }
                  }
                }
              }

              newdata[compid + '.list_data'] = res.data;
              newdata[compid + '.is_more'] = res.is_more;
              newdata[compid + '.curpage'] = 1;

              pageInstance.setData(newdata);
            }
          }
        });
      }
    }

    if (!!pageInstance.goods_compids_params) {
      for (let i in pageInstance.goods_compids_params) {
        let compid = pageInstance.goods_compids_params[i].compid;
        let param = pageInstance.goods_compids_params[i].param;
        let newWaimaiData = pageInstance.data;
        newWaimaiData[compid + '.goodsDetailShow'] = false;
        newWaimaiData[compid + '.goodsModelShow'] = false;
        pageInstance.setData(newWaimaiData)
        if (param.form === 'takeout') {
          _this.getLocation({
            success: function (res) {
              param.longitude = res.longitude;
              param.latitude = res.latitude;
              param.page = -1;
              pageInstance.requestNum = pageRequestNum + 1;
              _this.sendRequest({
                hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                url: '/index.php?r=AppShop/GetGoodsList',
                data: param,
                method: 'post',
                success: function (res) {
                  if (res.status == 0) {
                    newdata = {};
                    newdata = pageInstance.data;
                    var waimaiList = res.data,
                        takeoutByGoodsIdInfo = {},
                        waimaiArrayList = [];
                    for (let takeoutGoodsId in waimaiList['all']) {
                      if (waimaiList['all'][takeoutGoodsId].form_data.goods_model) {
                        var goodsModel = waimaiList['all'][takeoutGoodsId].form_data.goods_model;
                        waimaiList['all'][takeoutGoodsId].form_data['goodsModel'] = {}
                        for(let goodsmodel in goodsModel){
                          waimaiList['all'][takeoutGoodsId].form_data['goodsModel'][goodsModel[goodsmodel].id] = goodsModel[goodsmodel]
                        }
                      }
                      waimaiList['all'][takeoutGoodsId].form_data.totalNum = 0;
                      takeoutByGoodsIdInfo[waimaiList['all'][takeoutGoodsId].form_data.id] = waimaiList['all'][takeoutGoodsId].form_data;
                    }
                    pageInstance.requestNum = pageRequestNum + 1;
                    _this.sendRequest({
                      hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                      url: '/index.php?r=AppShop/getTakeOutInfo',
                      data: {},
                      success: function (data) {
                        let newdata = pageInstance.data;
                        newdata[compid].takeoutInfo = data.data;
                        newdata[compid].takeoutInfo.in_distance = res.in_distance;
                        newdata[compid].takeoutInfo.in_business_time = res.in_business_time;
                        newdata[compid].assessScore = (data.data.commont_stat.average_score).toFixed(2);
                        newdata[compid].goodsScore = Math.round(data.data.commont_stat.score);
                        newdata[compid].serviceScore = Math.round(data.data.commont_stat.logistic_score);
                        _this.globalData.takeoutShopInfo = data.data;
                        pageInstance.setData(newdata)
                      }
                    });
                    pageInstance.requestNum = pageRequestNum + 1;
                    _this.sendRequest({
                      hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                      url: '/index.php?r=AppShop/getAssessList&idx_arr[idx]=goods_type&idx_arr[idx_value]=2',
                      data: { page: 1, page_size: 10, obj_name: 'app_id' },
                      success: function (res) {
                        let newdata = pageInstance.data,
                          
                          showAssess = [],
                          hasImgAssessList = 0,
                          goodAssess = 0,
                          normalAssess = 0,
                          badAssess = 0;
                        for (var i = 0; i < res.data.length; i++) {
                          res.data[i].assess_info.has_img == 1 ? (hasImgAssessList++ , showAssess.push(res.data[i])) : null;
                          res.data[i].assess_info.level == 3 ? goodAssess++ : (res.data[i].assess_info.level == 1 ? badAssess++ : normalAssess++ )
                        }
                        for (let j = 0; j < res.num.length;j++) {
                          res.num[j] = parseInt(res.num[j])
                        }
                        newdata[compid].assessActive = 0;
                        newdata[compid].assessList = res.data;
                        newdata[compid].showAssess = showAssess;
                        newdata[compid].assessNum = res.num;
                        newdata[compid].moreAssess = res.is_more;
                        newdata[compid].assessCurrentPage = res.current_page;
                        pageInstance.setData(newdata);
                      }
                    })
                    pageInstance.requestNum = pageRequestNum + 1;
                    _this.sendRequest({
                      hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                      url: '/index.php?r=AppShop/cartList',
                      data: { page: -1, sub_shop_app_id: '', parent_shop_app_id: '' },
                      success: function (cartlist) {
                        // 遍历购物车列表
                        var totalNum = 0, totalPrice = 0.00;
                        for (var i = 0; i < cartlist.data.length; i++) {
                          // 遍历商品
                          if (cartlist.data[i].goods_type == 2) {
                            totalNum += Number(cartlist.data[i].num);
                            totalPrice += Number(cartlist.data[i].price) * cartlist.data[i].num;
                          }

                          for (var j in takeoutByGoodsIdInfo) {
                              // 同个商品
                              var goods_data_info = takeoutByGoodsIdInfo[j], cart_goods_info = cartlist.data[i], goodsNum = 0;
                              if (goods_data_info.id == cart_goods_info.goods_id) {
                                // 多规格商品
                                let thisGoodsNum = 0;
                                if (cart_goods_info.model) {
                                  for (var l = 0; l < goods_data_info.goods_model.length; l++) {
                                    if (cart_goods_info.model.split(',').sort().toString() == goods_data_info.goods_model[l].model.split(',').sort().toString()) {
                                      goodsNum += Number(cart_goods_info.num)
                                      goods_data_info.goods_model[l].num = cart_goods_info.num;
                                      thisGoodsNum += +cart_goods_info.num
                                      Object.assign(newdata[compid + '.takeoutByGoodsIdInfo'][goods_data_info.id].goodsModel[goods_data_info.goods_model[l].id], {
                                        price: (+cart_goods_info.price).toFixed(2),
                                        num: +cart_goods_info.num,
                                        modalId: cart_goods_info.model.split(',').sort() || 0,
                                        modalStr: cart_goods_info.model_value || 0,
                                        modelid: cart_goods_info.model_id || 0,
                                        cart_id: cart_goods_info.id,
                                        totalPrice: Number(cart_goods_info.price * cart_goods_info.num).toFixed(2)
                                      })
                                    }
                                  }
                                  newdata[compid + '.takeoutByGoodsIdInfo'][goods_data_info.id].totalNum = thisGoodsNum;
                                } else {
                                  goodsNum += Number(cart_goods_info.num)
                                  goods_data_info.num = cart_goods_info.num;
                                  newdata[compid + '.takeoutByGoodsIdInfo'][goods_data_info.id].cart_id = cart_goods_info.id;
                                  newdata[compid + '.takeoutByGoodsIdInfo'][goods_data_info.id].totalNum = cart_goods_info.num;
                                  newdata[compid + '.takeoutByGoodsIdInfo'][goods_data_info.id].totalPrice = Number(cart_goods_info.price * +cart_goods_info.num).toFixed(2);
                                }
                                pageInstance.setData(newdata);
                              }
                          }
                        }
                        for (var i = 0; i < res.data[newdata[compid].content[0].source].length; i++) {
                          waimaiArrayList.push(res.data[newdata[compid].content[0].source][i])
                        }
                        newdata[compid + '.waimaiTotalNum'] = totalNum;
                        _this.globalData.waimaiTotalNum = totalNum;
                        newdata[compid + '.waimaiTotalPrice'] = totalPrice.toFixed(2);
                        newdata[compid + '.goods_data'] = res.data;
                        pageInstance.setData(newdata);
                      }
                    })
                    wx.getSystemInfo({
                      success: function (res) {
                        if (!newdata[compid].customFeature.showShopInfo) {
                          newdata[compid + '.heightPx'] = res.windowHeight - 86;
                        } else {
                          newdata[compid + '.heightPx'] = res.windowHeight - 181;
                        }
                      },
                    })
                    newdata[compid + '.takeoutByGoodsIdInfo'] = takeoutByGoodsIdInfo;
                    newdata[compid + '.showCategory'] = newdata[compid].content[0];
                    newdata[compid + '.selected'] = 1;
                    newdata[compid + '.goods_data'] = waimaiList;
                    newdata[compid + '.show_goods_data'] = waimaiArrayList;
                    // newdata[compid + '.waimaiTotalNum'] = _this.getWaimaiTotalNum();
                    // newdata[compid + '.waimaiTotalPrice'] = _this.getWaimaiTotalPrice();
                    newdata[compid + '.is_more'] = res.is_more;
                    newdata[compid + '.curpage'] = 1;
                    pageInstance.setData(newdata);
                  }
                }
              });
            }
          });
        }else if(param.form === 'tostore'){
          _this.getTostoreCartList();
          pageInstance.requestNum = pageRequestNum + 1;
          _this.sendRequest({
            hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
            url: '/index.php?r=AppShop/GetGoodsList',
            data: param,
            method: 'post',
            success: function (res) {
              if (res.status == 0) {
                newdata = {};
                var arr = [];
                for (var i = 0; i < res.data.length; i++) {
                  var data = res.data[i],
                    maxMinArr = [],
                    pri = '';
                  if (data.form_data.goods_model && (data.form_data.goods_model.length >= 2)) {
                    for (var j = 0; j < data.form_data.goods_model.length; j++) {
                      maxMinArr.push(data.form_data.goods_model[j].price);
                    }
                    if (Math.min.apply(null, maxMinArr) != Math.max.apply(null, maxMinArr)) {
                      pri = Math.min.apply(null, maxMinArr).toFixed(2) + '-' + Math.max.apply(null, maxMinArr).toFixed(2);
                      data.form_data.price = pri;
                    }
                  }
                  arr.push(data);
                }
                if (_this.getHomepageRouter() == pageInstance.page_router) {
                  var second = new Date().getMinutes().toString();
                  if (second.length <= 1) {
                    second = '0' + second;
                  }
                  var currentTime = new Date().getHours().toString() + second,
                      showFlag = true,
                      showTime = '';

                  pageInstance.requestNum = pageRequestNum + 1;
                  _this.sendRequest({
                    hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                    url: '/index.php?r=AppShop/getBusinessTime',
                    method: 'post',
                    data: {
                      app_id: _this.getAppId()
                    },
                    success: function (res) {
                      var businessTime = res.data.business_time;
                      if (businessTime) {
                        for (var i = 0; i < businessTime.length; i++) {
                          showTime += businessTime[i].start_time.substring(0, 2) + ':' + businessTime[i].start_time.substring(2, 4) + '-' + businessTime[i].end_time.substring(0, 2) + ':' + businessTime[i].end_time.substring(2, 4) + ' / ';
                          if (+currentTime > +businessTime[i].start_time && +currentTime < +businessTime[i].end_time) {
                            showFlag = false;
                          }
                        }
                        if (showFlag) {
                          showTime = showTime.substring(0, showTime.length - 2);
                          _this.showModal({
                            content: '店铺休息中,暂时无法接单。营业时间为：' + showTime
                          })
                        }
                      }
                    }
                  });
                }
                newdata[compid + '.goods_data'] = arr;
                newdata[compid + '.is_more'] = res.is_more;
                newdata[compid + '.curpage'] = 1;
                pageInstance.setData(newdata);
              }
            }
          });
        }else {
          pageInstance.requestNum = pageRequestNum + 1;
          _this.sendRequest({
            hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
            url: '/index.php?r=AppShop/GetGoodsList',
            data: param,
            method: 'post',
            success: function (res) {
              if (res.status == 0) {
                newdata = {};
                newdata[compid + '.goods_data'] = res.data;
                newdata[compid + '.is_more'] = res.is_more;
                newdata[compid + '.curpage'] = 1;
                pageInstance.setData(newdata);
              }
            }
          });
        }
      }
    }
    if (!!pageInstance.franchiseeComps) {
      for (let i in pageInstance.franchiseeComps) {
        let compid = pageInstance.franchiseeComps[i].compid;
        let param = pageInstance.franchiseeComps[i].param;

        _this.getLocation({
          success: function(res){
            var latitude = res.latitude,
                longitude = res.longitude;

            pageInstance.requestNum = pageRequestNum + 1;
            _this.sendRequest({
              hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
              url: '/index.php?r=Region/GetAreaInfoByLatAndLng',
              data: {
                latitude: latitude,
                longitude: longitude
              },
              success: function(res){
                newdata = {};
                newdata[compid + '.location_address'] = res.data.addressComponent.street + res.data.sematic_description;
                pageInstance.setData(newdata);

                param.latitude = latitude;
                param.longitude = longitude;
                param.page = -1; // 暂时处理子店列表高度自适应无法加载第二页数据问题，等上拉加载数据做完之后可以删除
                _this.setLocationInfo({
                  latitude: latitude,
                  longitude: longitude,
                  address: res.data.addressComponent.street + res.data.sematic_description
                });
                pageInstance.requestNum = pageRequestNum + 1;
                _this.sendRequest({
                  hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                  url: '/index.php?r=AppShop/GetAppShopByPage',
                  data: param,
                  method: 'post',
                  success: function (res) {
                    // for (let j = 0; j < res.data.length; j++) {
                    //   res.data[j].description = _this.getWxParseResult(res.data[j].description);
                    // }
                    for(let index in res.data){
                      let distance = res.data[index].distance;
                      res.data[index].distance = util.formatDistance(distance);
                    }

                    newdata = {};
                    newdata[compid + '.franchisee_data'] = res.data;
                    newdata[compid + '.is_more'] = res.is_more;
                    newdata[compid + '.curpage'] = 1;

                    pageInstance.setData(newdata);
                  }
                });
              }
            });
          }
        });
      }
    }

    if (!!pageInstance.relobj_auto) {
      for (let i in pageInstance.relobj_auto) {
        let obj = pageInstance.relobj_auto[i],
            objrel = obj.obj_rel,
            AutoAddCount = obj.auto_add_count,
            compid = obj.compid,
            hasCounted = obj.has_counted,   // 默认是 0，没有计算过
            parentcompid = obj.parentcompid;

        if (parentcompid != '' && parentcompid != null) {
          if (compid.search('data.') !== -1) {
            compid = compid.substr(5);
          }
          compid = parentcompid + '.' + compid;
        }

        if(!!pageInstance.dataId && !!pageInstance.page_form){
          objrel = pageInstance.page_form + '_' + pageInstance.dataId;

          if(AutoAddCount){
            objrel = objrel + '_view';
          }
        }

        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppData/getCount',
          data: {
            obj_rel: objrel
          },
          success: function (res) {
            if (res.status == 0) {
              if (AutoAddCount == 1) {
                if (hasCounted == 0) {
                  pageInstance.requestNum = pageRequestNum + 1;
                  _this.sendRequest({
                    hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                    url: '/index.php?r=AppData/addCount',
                    data: {
                      obj_rel: objrel
                    },
                    success: function (newres) {
                      if (newres.status == 0) {
                        newdata = {};
                        newdata[compid + '.count_data.count_num'] = parseInt(newres.data.count_num);
                        newdata[compid + '.count_data.has_count'] = parseInt(newres.data.has_count);
                        pageInstance.setData(newdata);
                      }
                    },
                    fail: function () {
                    }
                  });
                }
              } else {
                newdata = {};
                newdata[compid + '.count_data.count_num'] = parseInt(res.data.count_num);
                newdata[compid + '.count_data.has_count'] = parseInt(res.data.has_count);
                pageInstance.setData(newdata);
              }
            }
          }
        });
      }
    }

    if(pageInstance.bbsCompIds.length){
      for (let i in pageInstance.bbsCompIds) {
        let compid = pageInstance.bbsCompIds[i],
            bbsData = pageInstance.data[compid],
            bbs_idx_value = '';

        if(bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false'){
          if(pageInstance.page_form && pageInstance.page_form != 'none'){
            bbs_idx_value = pageInstance.page_form + '_' + pageInstance.dataId;
          }else{
            bbs_idx_value = pageInstance.page_router;
          }
        }else{
          bbs_idx_value = _this.getAppId();
        }
        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppData/getFormDataList',
          method: 'post',
          data: {
            form: 'bbs',
            is_count: bbsData.customFeature.ifLike ? 1 : 0,
            page: 1,
            idx_arr: {
              idx: 'rel_obj',
              idx_value: bbs_idx_value
            }
          },
          success: function(res){
            let data = {};

            res.isloading = false;

            data[compid+'.content'] = res;
            data[compid+'.comment'] = {};
            pageInstance.setData(data);
          }
        });
      }
    }
    if (!!pageInstance.communityComps) {
      for (let i in pageInstance.communityComps) {
        let compid = pageInstance.communityComps[i].compid,
            dataId = [],
            content = pageInstance.data[compid].content,
            customFeature = pageInstance.data[compid].customFeature,
            styleData = {},
            imgStyle = [],
            liStyle = [],
            secStyle = [];

        secStyle = [
              'color:'+ customFeature.secColor ,
              'text-decoration:' + (customFeature.secTextDecoration || 'none'),
              'text-align:' + (customFeature.secTextAlign || 'left'),
              'font-size:' + customFeature.secFontSize,
              'font-style:' + (customFeature.secFontStyle || 'normal'),
              'font-weight:' + (customFeature.secFontWeight || 'normal')
          ].join(";");

        imgStyle = [
                'width :'+ (customFeature.imgWidth * 2.34) + 'rpx',
                'height :'+ (customFeature.imgHeight * 2.34) + 'rpx'
          ].join(";");
        liStyle = [
              'height :'+ (customFeature.lineHeight * 2.34) + 'rpx',
              'margin-bottom :'+ (customFeature.margin * 2.34) +'rpx'
          ];
        customFeature['lineBackgroundColor'] && (liStyle.push('background-color:' + customFeature['lineBackgroundColor']));
        customFeature['lineBackgroundImage'] && (liStyle.push('background-image:' + customFeature['lineBackgroundImage']));
        liStyle = liStyle.join(";");

        styleData[compid + '.secStyle'] = secStyle;
        styleData[compid + '.imgStyle'] = imgStyle;
        styleData[compid + '.liStyle']  = liStyle;
        pageInstance.setData(styleData);

        for (let j in content) {
          dataId.push(content[j]['community-id']);
        }

        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppSNS/GetSectionByPage',
          data: {
            section_ids : dataId ,
            page: 1 ,
            page_size: 100
          },
          method: 'post',
          success: function (res) {
            if (res.status == 0) {
              var ddata = {},
                  lastdata = [],
                  newdata = {};

              for (let x = 0; x < res.data.length; x++) {
                let val = res.data[x];
                ddata[val.id] =val;
              }
              for (let y = 0; y < dataId.length; y++) {
                let val = ddata[dataId[y]];
                if(val){
                  lastdata.push(val);
                }
              }
              newdata[compid + '.community_data'] = lastdata;

              pageInstance.setData(newdata);
            }
          }
        });
      }
    }

    if (pageInstance.cityLocationComps.length){
      for (let i in pageInstance.cityLocationComps){
        pageInstance.data[pageInstance.cityLocationComps[i]].hidden = false;
        _this.getLocation({
          success:function(res){
            var latitude = res.latitude,
                longitude = res.longitude;

            pageInstance.requestNum = pageRequestNum + 1;
            _this.sendRequest({
              hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
              url: '/index.php?r=Region/GetAreaInfoByLatAndLng',
              data: {
                latitude: latitude,
                longitude: longitude
              },
              success:function(res){
                var newdata = pageInstance.data,
                    id =  pageInstance.cityLocationComps[i];

                newdata[id].provinces = [];
                newdata[id].provinces_ids = [];
                newdata[id].province = '';
                newdata[id].citys = [];
                newdata[id].city_ids = [];
                newdata[id].city = '';
                newdata[id].districts = [];
                newdata[id].district_ids = [];
                newdata[id].district = '';
                newdata[id].value = [0,0,0];
                newdata[id].local = res.data.addressComponent.province+' '+res.data.addressComponent.city + ' ' +res.data.addressComponent.district + ' >';
                pageInstance.setData(newdata);
              }
            })
          }
        });
        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppRegion/getAllExistedDataRegionList&is_xcx=1',
          success:function(data){
            var newdata = pageInstance.data,
                    id =  pageInstance.cityLocationComps[i];
            newdata[id].areaList = data.data;
            pageInstance.setData(newdata);
          },
        });
      }
    }

    // 秒杀
    if (!!pageInstance.seckillOnLoadCompidParam) {
      for (let i in pageInstance.seckillOnLoadCompidParam) {
        let compid = pageInstance.seckillOnLoadCompidParam[i].compid;
        let param = pageInstance.seckillOnLoadCompidParam[i].param;

        param.is_seckill = 1;
        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppShop/GetGoodsList',
          data: param,
          method: 'post',
          success: function (res) {
            if (res.status == 0) {
              let rdata = res.data,
                  newdata = {},
                  downcountArr = pageInstance.data.downcountArr || [];

              for (let i = 0; i < rdata.length; i++) {
                let f = rdata[i].form_data,
                    dc ;

                f.downCount = {
                  hours : '00' ,
                  minutes : '00' ,
                  seconds : '00'
                };
                if(f.seckill_start_state == 0){
                  dc = _this.beforeSeckillDownCount(f , pageInstance , compid + '.goods_data[' + i + '].form_data');
                }else if(f.seckill_start_state == 1){
                  dc = _this.duringSeckillDownCount(f , pageInstance , compid + '.goods_data[' + i + '].form_data');
                }
                downcountArr.push(dc);
              }

              newdata[compid + '.goods_data'] = res.data;

              newdata[compid + '.is_more'] = res.is_more;
              newdata[compid + '.curpage'] = 1;
              newdata.downcountArr = downcountArr;

              pageInstance.setData(newdata);
            }
          }
        });
      }
    }
  },
  onPageShareAppMessage: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let pageRouter   = pageInstance.page_router;
    let pagePath     = '/pages/' + pageRouter + '/' + pageRouter;
    let desc         = event.target ? event.target.dataset.desc : app.getAppDescription();

    pagePath += pageInstance.dataId ? '?detail=' + pageInstance.dataId : '';
    return this.shareAppMessage({path: pagePath, desc: desc});
  },
  onPageShow: function () {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    if (this.globalData.takeoutRefresh) {
      this.pageDataInitial();
      this.globalData.takeoutRefresh = false;
    } else {
      setTimeout(function () {
        that.setPageUserInfo();
      });
    }

    if (pageInstance.need_login && !this.getUserInfo().phone) {
      this.isLogin() 
      ? this.turnToPage('/pages/bindCellphone/bindCellphone')
      : this.goLogin({ 
          success: function () {
            !that.getUserInfo().phone && that.turnToPage('/pages/bindCellphone/bindCellphone'); 
          }
        });
    }
  },
  onPageReachBottom: function () {
    let pageInstance = this.getAppCurrentPage();
    for(let i in pageInstance.data){
      if(/^bbs[\d]+$/.test(i)){
        this._bbsScrollFuc(i);
      }
    }
  },
  _bbsScrollFuc: function (compid) {
    let _this         = this;
    let pageInstance  = this.getAppCurrentPage();
    let bbsData       = pageInstance.data[compid];
    let bbs_idx_value = '';

    if (bbsData.content.isloading || bbsData.content.is_more == 0) {
      return ;
    }
    bbsData.content.isloading = true;

    if (bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false') {
      if (pageInstance.page_form && pageInstance.page_form != 'none') {
        bbs_idx_value = pageInstance.page_form + '_' + pageInstance.dataId;
      } else {
        bbs_idx_value = pageInstance.page_router;
      }
    } else {
      bbs_idx_value = _this.getAppId();
    }
    _this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      method: 'post',
      data: {
        form: 'bbs',
        is_count: bbsData.customFeature.ifLike ? 1 : 0,
        page: bbsData.content.current_page + 1,
        idx_arr: {
          idx: 'rel_obj',
          idx_value: bbs_idx_value
        }
      },
      success: function (res) {
        let data = {},
            newData = {};
        data = res;

        data.data = bbsData.content.data.concat(res.data);
        data.isloading = false;

        newData[compid+'.content'] = data;
        pageInstance.setData(newData);
      },
      complete: function () {
        let newData = {};
        newData[compid+'.content.isloading'] = false;
        pageInstance.setData(newData);
      }
    });
  },
  onPageUnload: function () {
    let pageInstance = this.getAppCurrentPage();
    let downcountArr = pageInstance.downcountArr;
    if(downcountArr && downcountArr.length){
      for (var i = 0; i < downcountArr.length; i++) {
        downcountArr[i].clear();
      }
    }
  },
  tapPrevewPictureHandler: function (event) {
    this.previewImage({
      urls: event.currentTarget.dataset.imgarr instanceof Array ? event.currentTarget.dataset.imgarr : [event.currentTarget.dataset.imgarr],
    })
  },
  suspensionBottom: function () {
    let pageInstance = this.getAppCurrentPage();
    for (let i in pageInstance.data) {
      if(/suspension/.test(i)){
        let suspension = pageInstance.data[i],
            newdata = {};

        if(pageInstance.data.has_tabbar == 1){
          newdata[i + '.suspension_bottom'] = (+suspension.suspension_bottom - 56)*2.34;
        }else{
          newdata[i + '.suspension_bottom'] = (+suspension.suspension_bottom)*2.34;
        }
        pageInstance.setData(newdata);
      }
    }
  },
  pageScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = event.target.dataset.compid;
    let curpage      = parseInt(event.target.dataset.curpage) + 1;
    let newdata      = {};
    let param        = {};
    let _this        = this;

    if (pageInstance.requesting || !pageInstance.data[compid].is_more) {
      return;
    }
    pageInstance.requesting = true;

    if (pageInstance.list_compids_params) {
      for (let index in pageInstance.list_compids_params) {
        if (pageInstance.list_compids_params[index].compid === compid) {
          param = pageInstance.list_compids_params[index].param;
          break;
        }
      }
    }

    param.page = curpage;

    _this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      data: param,
      method: 'post',
      success: function (res) {
        newdata = {};

        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }

            let description = res.data[j].form_data[k];

            if (!description) {
              continue;
            }
            // 检测如果不是一个图片链接的话就解析
            if(typeof description === 'string' && !/^http:\/\/img/g.test(description)){
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
          }
        }

        newdata[compid + '.list_data'] = pageInstance.data[compid].list_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;

        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  goodsScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = event.target.dataset.compid;
    let curpage      = parseInt(event.target.dataset.curpage) + 1;
    let newdata      = {};
    let param        = {};

    if (pageInstance.requesting || !pageInstance.data[compid].is_more) {
      return;
    }
    pageInstance.requesting = true;

    if (pageInstance.goods_compids_params) {
      for (let index in pageInstance.goods_compids_params) {
        if (pageInstance.goods_compids_params[index].compid === compid) {
          param = pageInstance.goods_compids_params[index].param;
          break;
        }
      }
    }

    param.page = curpage;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      data: param,
      method: 'post',
      success: function (res) {
        newdata = {};
        newdata[compid + '.goods_data'] = pageInstance.data[compid].goods_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;

        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  franchiseeScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = event.target.dataset.compid;
    let curpage      = parseInt(event.target.dataset.curpage) + 1;
    let newdata      = {};
    let param        = {};

    if (pageInstance.requesting || !pageInstance.data[compid].is_more) {
      return;
    }
    pageInstance.requesting = true;

    if (pageInstance.franchiseeComps) {
      for (let index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].compid === compid) {
          param = pageInstance.franchiseeComps[index].param;
          break;
        }
      }
    }
    param.page = curpage;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: param,
      method: 'post',
      success: function (res) {
        for(let index in res.data){
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }
        newdata = {};
        newdata[compid + '.franchisee_data'] = pageInstance.data[compid].franchisee_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;

        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  seckillScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = event.target.dataset.compid;
    let curpage      = parseInt(event.target.dataset.curpage) + 1;
    let _this        = this;
    let newdata      = {};
    let param        = {};
    if (pageInstance.requesting || !pageInstance.data[compid].is_more) {
      return;
    }
    pageInstance.requesting = true;

    if (pageInstance.seckillOnLoadCompidParam) {
      for (let index in pageInstance.seckillOnLoadCompidParam) {
        if (pageInstance.seckillOnLoadCompidParam[index].compid === compid) {
          param = pageInstance.seckillOnLoadCompidParam[index].param;
          break;
        }
      }
    }
    param.page = curpage;

    _this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      data: param,
      method: 'post',
      success: function (res) {
        newdata = {};
        let rdata = res.data,
            downcountArr = pageInstance.data.downcountArr || [];

        for (let i = 0; i < rdata.length; i++) {
          let f = rdata[i].form_data,
              dc ,
              idx = (curpage-1) * 10 + i;

          f.downCount = {
            hours : '00' ,
            minutes : '00' ,
            seconds : '00'
          };
          if(f.seckill_start_state == 0){
            dc = _this.beforeSeckillDownCount(f , pageInstance , compid + '.goods_data[' + idx + '].form_data');
          }else if(f.seckill_start_state == 1){
            dc = _this.duringSeckillDownCount(f , pageInstance , compid + '.goods_data[' + idx + '].form_data');
          }
          downcountArr.push(dc);
        }
        newdata[compid + '.goods_data'] = pageInstance.data[compid].goods_data.concat(res.data);
        newdata[compid + '.is_more']    = res.is_more;
        newdata[compid + '.curpage']    = res.current_page;
        newdata.downcountArr = downcountArr;

        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  changeCountRequert : {},
  changeCount: function (event) {
    let dataset      = event.currentTarget.dataset;
    let that         = this;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = {};
    let counted      = dataset.counted;
    let compid       = dataset.compid;
    let objrel       = dataset.objrel;
    let form         = dataset.form;
    let dataIndex    = dataset.index;
    let parentcompid = dataset.parentcompid;
    let parentType   = dataset.parenttype;
    let url;
    let objIndex     = compid + '_' + objrel;

    if(counted == 1){
      url = '/index.php?r=AppData/delCount';
    } else {
      url = '/index.php?r=AppData/addCount';
    }

    if(that.changeCountRequert[objIndex]){
      return ;
    }
    that.changeCountRequert[objIndex] = true;

    that.sendRequest({
      url: url,
      data: { obj_rel: objrel },
      success: function (res) {
        newdata = {};

        if (parentcompid) {
          if (parentcompid.indexOf('list_vessel') === 0) {
            newdata[parentcompid + '.list_data[' + dataIndex + '].count_num'] = counted == 1
              ? parseInt(pageInstance.data[parentcompid].list_data[dataIndex].count_num) - 1
              : parseInt(res.data.count_num);
            newdata[parentcompid + '.list_data[' + dataIndex + '].has_count'] = counted == 1
              ? 0 : parseInt(res.data.has_count);
          } else if (parentcompid.indexOf('bbs') === 0) {
            newdata[parentcompid + '.content.data[' + dataIndex + '].count_num'] = counted == 1
              ? parseInt(pageInstance.data[parentcompid].content.data[dataIndex].count_num) - 1
              : parseInt(res.data.count_num);
            newdata[parentcompid + '.content.data[' + dataIndex + '].has_count'] = counted == 1
              ? 0 : parseInt(res.data.has_count);
          } else if (parentcompid.indexOf('free_vessel') === 0 || parentcompid.indexOf('dynamic_vessel') === 0) {
            let path = compid
            if (compid.search('data.') !== -1) {
              path = compid.substr(5);
            }
            path = parentcompid + '.' + path;
            newdata[path + '.count_data.count_num'] = parseInt(res.data.count_num);
            newdata[path + '.count_data.has_count'] = parseInt(res.data.has_count);
          } else if (parentType && parentType.indexOf('list_vessel') === 0) {
            newdata[parentType + '.list_data[' + dataIndex + '].count_num'] = parseInt(res.data.count_num);
            newdata[parentType + '.list_data[' + dataIndex + '].has_count'] = parseInt(res.data.has_count);
          }
        } else {
          if (parentcompid != '' && parentcompid != null) {
            if (compid.search('data.') !== -1) {
              compid = compid.substr(5);
            }
            compid = parentcompid + '.' + compid;
          }
          newdata[compid + '.count_data.count_num'] = parseInt(res.data.count_num);
          newdata[compid + '.count_data.has_count'] = parseInt(res.data.has_count);
          pageInstance.setData(newdata);
        }

        pageInstance.setData(newdata);
        that.changeCountRequert[objIndex] = false;
      },
      complete : function () {
        that.changeCountRequert[objIndex] = false;
      }
    });
  },
  inputChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let segment      = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    var newdata = {};
    newdata[datakey] = value;
    pageInstance.setData(newdata);
  },
  bindDateChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let segment      = dataset.segment;
    let newdata      = {};

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }

    let obj = pageInstance.data[formcompid]['form_data'];
    if (util.isPlainObject(obj)) {
      obj = pageInstance.data[formcompid]['form_data'] = {};
    }
    obj = obj[segment];

    if (!!obj) {
      let date = obj.substr(0, 10);
      let time = obj.substr(11);

      if (obj.length == 16) {
        newdata[datakey] = value + ' ' + time;
      } else if (obj.length == 10) {  
        newdata[datakey] = value;
      } else if (obj.length == 5) {  
        newdata[datakey] = value + ' ' + obj;
      } else if (obj.length == 0) {
        newdata[datakey] = value;
      }
    } else {
      newdata[datakey] = value;
    }
    newdata[compid + '.date'] = value;
    pageInstance.setData(newdata);
  },
  bindTimeChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let segment      = dataset.segment;
    let newdata      = {};

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }

    let obj = pageInstance.data[formcompid]['form_data'];
    if (util.isPlainObject(obj)) {
      obj = pageInstance.data[formcompid]['form_data'] = {};
    }
    obj = obj[segment];

    if (!!obj) {
      let date = obj.substr(0, 10);
      let time = obj.substr(11);

      if (obj.length == 16) {
        newdata[datakey] = date + ' ' + value;
      } else if (obj.length == 10) {  // 只设置了 date
        newdata[datakey] = obj + ' ' + value;
      } else if (obj.length == 5) {   // 只设置了 time
        newdata[datakey] = value;
      } else if (obj.length == 0) {
        newdata[datakey] = value;
      }
    } else {
      newdata[datakey] = value;
    }
    newdata[compid + '.time'] = value;
    pageInstance.setData(newdata);
  },
  bindSelectChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let segment      = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    var newdata = {};
    newdata[datakey] = value;
    pageInstance.setData(newdata);
  },
  bindScoreChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let value        = dataset.score;
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let segment      = dataset.segment;

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    var newdata = {};
    newdata[datakey] = value;
    newdata[compid + '.editScore'] = value;
    pageInstance.setData(newdata);
  },
  submitForm: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let _this        = this;
    let compid       = dataset.compid;
    let form         = dataset.form;
    let form_data    = pageInstance.data[compid].form_data;
    let field_info   = pageInstance.data[compid].field_info;
    let content      = pageInstance.data[compid].content;
    let formEleType  = ['input-ele', 'textarea-ele', 'grade-ele', 'select-ele', 'upload-img', 'time-ele'];

    if (!util.isPlainObject(form_data)) {
      for(let index = 0; index < content.length; index++){
        if(formEleType.indexOf(content[index].type) == -1){
          continue;
        }
        let customFeature = content[index].customFeature,
            segment = customFeature.segment,
            ifMust = content[index].segment_required;

        if ((!form_data[segment] || form_data[segment].length == 0) && ifMust == 1) { // 提示错误
          _this.showModal({
            content: field_info[segment].title + ' 没有填写'
          });
          return;
        }
      }

      if(pageInstance.data[compid].submitting) return;
      let newdata = {};
      newdata[compid + '.submitting'] = true;
      pageInstance.setData(newdata);

      _this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppData/addData',
        data: {
          form: form,
          form_data: form_data
        },
        method: 'POST',
        success: function (res) {
          _this.showToast({
            title: '提交成功',
            icon: 'success'
          });
        },
        complete: function () {
          let newdata = {};
          newdata[compid + '.submitting'] = false;
          pageInstance.setData(newdata);
        }
      })
    } else {
      _this.showModal({
        content: '这个表单什么都没填写哦！'
      });
    }
  },
  udpateVideoSrc: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;

    this.chooseVideo(function(filePath){
      var newdata = {};
      newdata[compid + '.src'] = filePath;
      pageInstance.setData(newdata);
    });
  },
  tapMapDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let params  = dataset.eventParams;
    if(!params) return;

    params = JSON.parse(params)[0];
    this.openLocation({
      latitude: params.latitude,
      longitude: params.longitude,
      name: params.desc,
      address: params.name
    });
  },
  uploadFormImg: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let datakey      = dataset.datakey;
    let segment      = dataset.segment;

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      })
      console.log('segment empty 请绑定数据对象字段');
      return;
    }
    this.chooseImage(function (res) {
      let img_src = res[0];
      let newdata = pageInstance.data;
      typeof (newdata[compid + '.content']) == 'object' ? '' : newdata[compid + '.content'] = [];
      typeof (newdata[datakey]) == 'object' ? '' : newdata[datakey] = [];
      newdata[datakey].push(img_src);
      newdata[compid + '.display_upload'] = false;
      newdata[compid + '.content'].push(img_src);
      pageInstance.setData(newdata);
    });
  },
  deleteUploadImg:function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let formcompid   = dataset.formcompid;
    let index        = dataset.index;
    let compid       = dataset.compid;
    let datakey      = dataset.datakey;
    let newdata      = pageInstance.data;
    compid = formcompid + compid.substr(4);
    this.showModal({
      content: '确定删除该图片？',
      confirm: function () {
        newdata[compid + '.content'].splice(index,1);
        newdata[datakey].splice(index, 1);
        pageInstance.setData(newdata);
      }
    })
  },
  listVesselTurnToPage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let data_id      = dataset.dataid;
    let router       = dataset.router;
    let page_form    = pageInstance.page_form;

    if (router == -1 || router == '-1') {
      return;
    }
    if (page_form != '') {
      if(router == 'tostoreDetail'){
        this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + data_id);
      }else{
        this.turnToPage('/pages/' + router + '/' + router + '?detail=' + data_id);
      }
    }
  },
  userCenterTurnToPage: function (event) {
    let that = this;
    if (this.isLogin()) {
      this._userCenterToPage(event);
    } else {
      this.goLogin({
        success: function () {
          that._userCenterToPage(event);
        }
      });
    }
  },
  _userCenterToPage: function (event) {
    let dataset         = event.currentTarget.dataset;
    let router          = dataset.router;
    let openVerifyPhone = dataset.openVerifyPhone;
    let that            = this;

    if (router === 'userCenter' && this.isLogin() !== true) {

      this.goLogin({
        success: function () {
          that.turnToPage('/pages/' + router + '/' + router +'?from=userCenterEle');
        }
      })
      return;
    }
    if (openVerifyPhone) {
      if (!this.getUserInfo().phone) {
        this.turnToPage('/pages/bindCellphone/bindCellphone');
      } else {
        this.turnToPage('/pages/' + router + '/' + router +'?from=userCenterEle');
      }
    } else {
      this.turnToPage('/pages/' + router + '/' + router +'?from=userCenterEle');
    }
  },
  turnToGoodsDetail: function (event) {
    let dataset   = event.currentTarget.dataset;
    let id        = dataset.id;
    let contact   = dataset.contact;
    let goodsType = dataset.goodsType;
    let group     = dataset.group;
    let hidestock = dataset.hidestock;

    if (group && group == 1) {
      this.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + id + '&contact=' + contact);
      return;
    }
    switch (+goodsType) {
      case 0:
      case 1: this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id +'&contact=' + contact +'&hidestock=' + hidestock);
        break;
      case 3: this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + id);
        break;
    }
  },
  turnToFranchiseeDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    this.turnToPage('/pages/franchiseeDetail/franchiseeDetail?detail=' + id);
  },
  turnToSeckillDetail: function (event) {
    let id      = event.currentTarget.dataset.id;
    let contact = event.currentTarget.dataset.contact;
    this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id +'&goodsType=seckill&contact=' + contact);
  },
  sortListFunc: function (event) {
    let dataset       = event.currentTarget.dataset;
    let pageInstance  = this.getAppCurrentPage();
    let listid        = dataset.listid;
    let idx           = dataset.idx;
    let listParams    = {
      'list-vessel': pageInstance.list_compids_params,
      'goods-list': pageInstance.goods_compids_params,
      'franchisee-list': pageInstance.franchiseeComps
    };
    let component_params, listType;

    for (var key in listParams) {
      if(listType !== undefined) break;
      component_params = listParams[key];
      if(component_params.length){
        for (var j = 0; j < component_params.length; j++) {
          if(component_params[j].param.id === listid){
            listType = key;
            component_params = component_params[j];
          }
        }
      }
    }

    if(!component_params) return;
    component_params.param.page = 1;

    if (idx != 0) {
      component_params.param.sort_key       = dataset.sortkey;
      component_params.param.sort_direction = dataset.sortdirection;
    } else {
      component_params.param.sort_key       = '';
      component_params.param.sort_direction = 0;
    }

    switch (listType) {
      case 'list-vessel': this._sortListVessel(component_params, dataset); break;
      case 'goods-list': this._sortGoodsList(component_params, dataset); break;
      case 'franchisee-list': this._sortFranchiseeList(component_params, dataset); break;
    }
  },
  _sortListVessel: function (component_params, dataset) {
    var that = this;
    let pageInstance  = this.getAppCurrentPage();
    this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      data: component_params.param,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let newdata = {};
          let compid  = component_params['compid'];

          for (let j in res.data) {
            for (let k in res.data[j].form_data) {
              if (k == 'category') continue;

              let description = res.data[j].form_data[k];
              if (!description) continue;

              // 检测如果不是一个图片链接的话就解析
              if(typeof description === 'string' && !/^http:\/\/img/g.test(description)){
                res.data[j].form_data[k] = that.getWxParseResult(description);
              }
            }
          }

          newdata[compid + '.list_data'] = res.data;
          newdata[compid + '.is_more']   = res.is_more;
          newdata[compid + '.curpage']   = 1;

          that._updateSortStatus(dataset,component_params);
          pageInstance.setData(newdata);
        }
      }
    });
  },
  _sortGoodsList: function (component_params, dataset) {
    var that = this;
    let pageInstance  = this.getAppCurrentPage();
    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      data: component_params.param,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let newdata = {};
          let compid  = component_params['compid'];

          newdata[compid + '.goods_data'] = res.data;
          newdata[compid + '.is_more'] = res.is_more;
          newdata[compid + '.curpage'] = 1;

          that._updateSortStatus(dataset, newdata);
          pageInstance.setData(newdata);
        }
      }
    });
  },
  _sortFranchiseeList: function (component_params, dataset) {
    var that = this;
    let pageInstance  = this.getAppCurrentPage();

    component_params.param.page = -1; // 暂时处理子店列表高度自适应无法加载第二页数据问题，等上拉加载数据做完之后可以删除

    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: component_params.param,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let newdata = {};
          let compid  = component_params['compid'];

          for(let index in res.data){
            let distance = res.data[index].distance;
            res.data[index].distance = util.formatDistance(distance);
          }
          newdata[compid + '.franchisee_data'] = res.data;
          newdata[compid + '.is_more'] = res.is_more;
          newdata[compid + '.curpage'] = 1;

          that._updateSortStatus(dataset, newdata);
          pageInstance.setData(newdata);
        }
      }
    });
  },
  _updateSortStatus: function (dataset, newdata) {
    let pageInstance  = this.getAppCurrentPage();
    let sortCompid = dataset.compid;
    let selectSortIndex = dataset.idx;

    newdata[sortCompid + '.customFeature.selected'] = selectSortIndex;
    if (selectSortIndex != 0 && dataset.sortdirection == 1) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 0;
    } else if (selectSortIndex != 0) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 1;
    } else if (selectSortIndex == 0) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 0;
    }

    pageInstance.setData(newdata);
  },
  bbsInputComment: function (event) {
    let dataset      = event.target.dataset;
    let comment      = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let data         = {};

    data[compid+'.comment.text'] = comment;
    pageInstance.setData(data);
  },
  bbsInputReply: function (event) {
    let dataset      = event.target.dataset;
    let comment      = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    data[compid+'.content.data['+index+'].replyText'] = comment;
    pageInstance.setData(data);
  },
  uploadBbsCommentImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let data         = {};

    this.chooseImage(function(res){
      data[compid+'.comment.img'] = res[0];
      pageInstance.setData(data);
    });
  },
  uploadBbsReplyImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    this.chooseImage(function(res){
      data[compid+'.content.data['+index+'].replyImg'] = res[0];
      pageInstance.setData(data);
    });
  },
  deleteCommentImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let data         = {};

    data[compid+'.comment.img'] = '';
    pageInstance.setData(data);
  },
  deleteReplyImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    data[compid+'.content.data['+index+'].replyImg'] = '';
    pageInstance.setData(data);
  },
  bbsPublishComment: function (event) {
    let dataset      = event.currentTarget.dataset;
    let _this        = this;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let bbsData      = pageInstance.data[compid];
    let comment      = bbsData.comment;
    let param;

    if (!comment.text || !comment.text.trim()) {
      this.showModal({
        content: '请输入评论内容'
      })
      return;
    }

    delete comment.showReply;
    comment.addTime = util.formatTime();

    param = {};
    param.nickname = pageInstance.data.userInfo.nickname;
    param.cover_thumb = pageInstance.data.userInfo.cover_thumb;
    param.user_token = pageInstance.data.userInfo.user_token;
    param.page_url = pageInstance.page_router;
    param.content = comment;
    param.rel_obj = '';
    if (bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false') {
      if (pageInstance.page_form && pageInstance.page_form != 'none') {
        param.rel_obj = pageInstance.page_form + '_' + pageInstance.dataId;
      } else {
        param.rel_obj = pageInstance.page_router;
      }
    } else {
      param.rel_obj = _this.getAppId();
    }

    this.sendRequest({
      url: '/index.php?r=AppData/addData',
      method: 'post',
      data: {
        form: 'bbs',
        form_data: param
      },
      success: function(res){
        var commentList = pageInstance.data[compid].content.data || [],
            newdata = {};

        param.id = res.data;
        newdata[compid+'.content.data'] = [{
          form_data: param,
          count_num: 0
        }].concat(commentList);
        newdata[compid+'.content.count'] = +pageInstance.data[compid].content.count + 1;
        newdata[compid+'.comment'] = {};

        pageInstance.setData(newdata);
      }
    })
  },
  clickBbsReplyBtn: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    data[compid+'.content.data['+index+'].showReply'] = !pageInstance.data[compid].content.data[index].showReply;
    pageInstance.setData(data);
  },
  bbsPublishReply: function (event) {
    let dataset      = event.currentTarget.dataset;
    let _this        = this;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let bbsData      = pageInstance.data[compid];
    let form_data    = bbsData.content.data[index].form_data;
    let comment      = {};
    let param;

    comment.text = bbsData.content.data[index].replyText;
    comment.img = bbsData.content.data[index].replyImg;
    if (!comment.text || !comment.text.trim()) {
      this.showModal({
        content: '请输入回复内容'
      })
      return;
    }

    comment.addTime = util.formatTime();
    comment.reply = {
      nickname: form_data.nickname,
      text: form_data.content.text,
      img: form_data.content.img,
      user_token: form_data.user_token,
      reply: form_data.content.reply
    };

    param = {};
    param.nickname = pageInstance.data.userInfo.nickname;
    param.cover_thumb = pageInstance.data.userInfo.cover_thumb;
    param.user_token = pageInstance.data.userInfo.user_token;
    param.page_url = pageInstance.page_router;
    param.content = comment;
    param.rel_obj = '';
    if (bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false') {
      if (pageInstance.page_form && pageInstance.page_form != 'none') {
        param.rel_obj = pageInstance.page_form + '_' + pageInstance.dataId;
      } else {
        param.rel_obj = pageInstance.page_router;
      }
    } else {
      param.rel_obj = _this.getAppId();
    }

    this.sendRequest({
      url: '/index.php?r=AppData/addData',
      method: 'post',
      data: {
        form: 'bbs',
        form_data: param,
      },
      success: function(res){
        var commentList = pageInstance.data[compid].content.data || [],
            newdata = {};

        param.id = res.data;
        if(commentList.length){
          delete commentList[index].replyText;
          delete commentList[index].showReply;
        }
        newdata[compid+'.content.data'] = [{
          form_data: param,
          count_num: 0
        }].concat(commentList);
        newdata[compid+'.content.count'] = +pageInstance.data[compid].content.count + 1;
        newdata[compid+'.comment'] = {};

        pageInstance.setData(newdata);
      }
    })
  },
  searchList: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    let compid       = dataset.compid;
    let listid       = dataset.listid;
    let listType     = dataset.listtype;
    let form         = dataset.form;
    let keyword      = pageInstance.keywordList[compid];
    let targetList   = '';
    let index        = '';

    if(listType === 'list-vessel'){
      for (index in pageInstance.list_compids_params) {
        if (pageInstance.list_compids_params[index].param.id === listid) {
          pageInstance.list_compids_params[index].param.page = 1;
          targetList = pageInstance.list_compids_params[index];
          break;
        }
      }
    }

    if(listType === 'goods-list'){
      for (index in pageInstance.goods_compids_params) {
        if (pageInstance.goods_compids_params[index].param.id === listid) {
          pageInstance.goods_compids_params[index].param.page = 1;
          targetList = pageInstance.goods_compids_params[index];
          break;
        }
      }
    }

    if(listType === 'franchisee-list'){
      for (index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].param.id === listid) {
          pageInstance.franchiseeComps[index].param.page = 1;
          targetList = pageInstance.franchiseeComps[index];
          break;
        }
      }
    }

    let url = '/index.php?r=appData/search';
    let param = {"search":{"data":[{"_allkey":keyword,"form": form}],"app_id":targetList.param.app_id}};

    if(listType === 'franchisee-list'){
      let info = this.getLocationInfo();
      param.search.longitude = info.longitude;
      param.search.latitude = info.latitude;
    }

    this.sendRequest({
      url: url,
      data: param,
      success: function (res) {
        if(res.data.length == 0){
          setTimeout(function () {
            that.showToast({
              title: '没有找到与'+keyword+'相关的内容',
              duration: 2000
            });
          },0)
          return;
        }
        if (res.status == 0) {
          let newdata = {};
          if (listType === "goods-list") {
            newdata[targetList.compid + '.goods_data'] = res.data;
          } else if (listType === 'list-vessel') {
            for (let j in res.data) {
              for (let k in res.data[j].form_data) {
                if (k == 'category') {
                  continue;
                }
                let description = res.data[j].form_data[k];
                if (!description) {
                  continue;
                }
                if (typeof description === 'string' && !/^http:\/\/img/g.test(description)) {
                  res.data[j].form_data[k] = that.getWxParseResult(description);
                }
              }
            }
            newdata[targetList.compid + '.list_data'] = res.data;
          } else if (listType === 'franchisee-list') {
            for(let index in res.data){
              let distance = res.data[index].distance;
              res.data[index].distance = util.formatDistance(distance);
            }
            newdata[targetList.compid + '.franchisee_data'] = res.data;
          }

          newdata[targetList.compid + '.is_more']   = res.is_more;
          newdata[targetList.compid + '.curpage']   = 1;

          pageInstance.setData(newdata);
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  selectLocal: function (event) {
    let id           = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;

    newdata[id].hidden = typeof(pageInstance.data[id].hidden) == undefined ? false : !pageInstance.data[id].hidden;
    newdata[id].provinces = ['请选择'];  newdata[id].citys =['请选择']; newdata[id].districts = ['请选择']
    newdata[id].provinces_ids =[null]; newdata[id].city_ids =[null]; newdata[id].district_ids = [null];
    for(var i in newdata[id].areaList){
      newdata[id].provinces.push(newdata[id].areaList[i].name);
      newdata[id].provinces_ids.push(newdata[id].areaList[i].region_id);
    }
    newdata[id].newlocal = '';
    pageInstance.setData(newdata);
  },
  cancelCity: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let id           = event.currentTarget.dataset.id;
    let newdata      = pageInstance.data;
    newdata[id].hidden = !pageInstance.data[id].hidden;
    newdata[id].province = '';
    newdata[id].city = '';
    newdata[id].district = '';
    pageInstance.setData(newdata);
  },
  bindCityChange: function (event) {
    let val          = event.detail.value;
    let id           = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let cityList     = newdata[id].areaList;
    if(!newdata[id].newlocal){
      if(newdata[id].value[0] == val[0]){
        newdata[id].province = pageInstance.data[id].provinces[val[0]] == '请选择' ? '' : pageInstance.data[id].provinces[val[0]];
        newdata[id].citys = newdata[id].province == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities);
        newdata[id].city_ids = newdata[id].province == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities, 1);
        newdata[id].city = newdata[id].province == '' ? '' : newdata[id].citys[val[1]];
        newdata[id].districts = newdata[id].city == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns);
        newdata[id].district_ids = newdata[id].city == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns, 1);
        newdata[id].region_id = newdata[id].district_ids[val[2]];
        newdata[id].district = newdata[id].city == '' ? '' : newdata[id].districts[val[2]];
        newdata[id].value = val;
      }else{
        newdata[id].province = pageInstance.data[id].provinces[val[0]] == '请选择' ? '' : pageInstance.data[id].provinces[val[0]];
        newdata[id].citys = newdata[id].province == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities);
        newdata[id].city_ids = newdata[id].province == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities, 1);
        newdata[id].city = newdata[id].province == '' ? '' : newdata[id].citys[0];
        newdata[id].districts = newdata[id].city == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities[0].towns);
        newdata[id].district_ids = newdata[id].city == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities[0].towns, 1);
        newdata[id].region_id = newdata[id].district_ids[val[2]];
        newdata[id].district = newdata[id].city == '' ? '' : newdata[id].districts[val[2]];
        newdata[id].value = val;
      }
      pageInstance.setData(newdata)
    }
  },
  _getCityList:function (province, id) {
    let cityList = [];
    let cityList_id = [];
    for(let i in province){
      if(typeof(province[i]) == 'object'){
        cityList.push(province[i].name)
        cityList_id.push(province[i].region_id);
      }else{
        cityList[1] = province.name;
        cityList_id[1]=province.region_id;
      }
    }
    if(id){
      return cityList_id;
    }else{
      return cityList;
    }
  },
  submitCity: function (event) {
    let id = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let newdata = pageInstance.data;
    if (!newdata[id].districts) {
      this.showModal({content: '您未选择城市!'});
      newdata[id].province = '';
      newdata[id].city = '';
      newdata[id].district = '';
    } else {
      newdata[id].hidden = !pageInstance.data[id].hidden;
      newdata[id].newlocal = newdata[id].province + ' ' + newdata[id].city + ' ' +      newdata[id].district;
      newdata[id].value = [0,0,0];
      this._citylocationList(event.currentTarget.dataset, newdata[id].region_id);
    }
    pageInstance.setData(newdata);
  },
  _citylocationList: function (dataset, region_id) {
    let compid       = dataset.id;
    let listid       = dataset.listid;
    let listType     = dataset.listtype;
    let form         = dataset.form;
    let index        = '';
    let targetList   = '';
    let that         = this;
    let pageInstance = this.getAppCurrentPage();

    if (listType === 'list-vessel') {
      for (index in pageInstance.list_compids_params) {
        if (pageInstance.list_compids_params[index].param.id === listid) {
          pageInstance.list_compids_params[index].param.page = 1;
          targetList = pageInstance.list_compids_params[index];
          break;
        }
      }
    }

    if (listType === 'goods-list') {
      for (index in pageInstance.goods_compids_params) {
        if (pageInstance.goods_compids_params[index].param.id === listid) {
          pageInstance.goods_compids_params[index].param.page = 1;
          targetList = pageInstance.goods_compids_params[index];
          break;
        }
      }
    }

    if (listType === 'franchisee-list') {
      for (index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].param.id === listid) {
          pageInstance.franchiseeComps[index].param.page = 1;
          targetList = pageInstance.franchiseeComps[index];
          break;
        }
      }
    }
    let url = '/index.php?r=AppData/GetFormDataList&idx_arr[idx]=region_id&idx_arr[idx_value]='+region_id+'&extra_cond_arr[latitude]='+this.globalData.locationInfo.latitude+'&extra_cond_arr[longitude]='+this.globalData.locationInfo.longitude + '&extra_cond_arr[county_id]='+region_id,
        param = {'form':form};
    this.sendRequest({
      url: url,
      data: param,
      success: function (res) {
        if(res.data.length == 0){
          setTimeout(function () {
            that.showToast({
              title: '没有找到与所选区域的相关的内容',
              duration: 2000
            });
          },0)
          return;
        }
        if (res.status == 0) {
          let newdata = {};

          if (listType === "goods-list") {
            newdata[targetList.compid + '.goods_data'] = res.data;
          } else if (listType === 'list-vessel') {
            if(param.form !== 'form'){ // 动态列表绑定表单则不调用富文本解析
              for (let j in res.data) {
                for (let k in res.data[j].form_data) {
                  if (k == 'category') {
                    continue;
                  }

                  let description = res.data[j].form_data[k];

                  if (!description) {
                    continue;
                  }
                  // 检测如果不是一个图片链接的话就解析
                  if(typeof description === 'string' && !/^http:\/\/img/g.test(description)){
                    res.data[j].form_data[k] = that.getWxParseResult(description);
                  }
                }
              }
            }
            newdata[targetList.compid + '.list_data'] = res.data;
          } else if (listType === 'franchisee-list') {
            for(let index in res.data){
              let distance = res.data[index].distance;
              res.data[index].distance = util.formatDistance(distance);
            }
            newdata[targetList.compid + '.franchisee_data'] = res.data;
          }

          newdata[targetList.compid + '.is_more']   = res.is_more;
          newdata[targetList.compid + '.curpage']   = 1;

          pageInstance.setData(newdata);
        }
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  openTakeoutLocation: function (event) {
    var dataset = event.currentTarget.dataset;
    this.openLocation({
      latitude: +dataset.lat,
      longitude: +dataset.lng,
      name: dataset.name,
      address: dataset.address
    })
  },
  callTakeout: function (event) {
    var phone = event.currentTarget.dataset.phone;
    this.makePhoneCall(phone);
  },
  getMoreAssess: function (event) {
    let dataset      = event.currentTarget.dataset;
    let page         = dataset.nextpage;
    let compid       = dataset.compid;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let assessIndex  = newdata[compid].assessActive;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/getAssessList&idx_arr[idx]=goods_type&idx_arr[idx_value]=2',
      data: { page: page, page_size: 10, obj_name: 'app_id' },
      success: function (res) {
        for(let i in res.data){
          newdata[compid].assessList.push(res.data[i]);
        }
        let commentNums = [],
            showAssess = [],
            hasImgAssessList = 0,
            goodAssess = 0,
            normalAssess = 0,
            badAssess = 0;
        for (var i = 0; i < newdata[compid].assessList.length; i++) {
          newdata[compid].assessList[i].assess_info.has_img == 1 ? hasImgAssessList++ : null;
          newdata[compid].assessList[i].assess_info.level == 3 ? goodAssess++ : (newdata[compid].assessList[i].assess_info.level == 1 ? badAssess++ : normalAssess++)
          if (newdata[compid].assessList[i].assess_info.has_img == 1 && newdata[compid].assessActive == 0) {
            showAssess.push(newdata[compid].assessList[i]);
          } else if(newdata[compid].assessList[i].assess_info.level == 3 && newdata[compid].assessActive == 1){
            showAssess.push(newdata[compid].assessList[i]);
          } else if(newdata[compid].assessList[i].assess_info.level == 1 && newdata[compid].assessActive == 3){
            showAssess.push(newdata[compid].assessList[i]);
          } else if(newdata[compid].assessList[i].assess_info.level == 2 && newdata[compid].assessActive == 2) {
            showAssess.push(newdata[compid].assessList[i]);
          }
        }
        commentNums = [hasImgAssessList, goodAssess, normalAssess, badAssess]
        newdata[compid].commentNums = commentNums;
        newdata[compid].assessCurrentPage = page;
        newdata[compid].showAssess = showAssess;
        newdata[compid].moreAssess = res.is_more;
        pageInstance.setData(newdata);
      }
    })
  },
  changeEvaluate: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let newdata = pageInstance.data;
    let compid = event.currentTarget.dataset.takeout;
    newdata[compid + '.selected'] = event.currentTarget.dataset.index;
    pageInstance.setData(newdata);
  },
  deleteAllCarts: function (event) {
    let compid          = event.currentTarget.dataset.takeout;
    let pageInstance    = this.getAppCurrentPage();
    let newdata         = pageInstance.data;
    let takeoutGoodsArr = newdata[compid + '.takeoutByGoodsIdInfo'];
    let that            = this;
    let cartIds         = [];
    for (var i in takeoutGoodsArr) {
      if (takeoutGoodsArr[i].cart_id) {
        takeoutGoodsArr[i].cart_id && cartIds.push(takeoutGoodsArr[i].cart_id)
      } else {
        for (var j in takeoutGoodsArr[i].goodsModel) {
          takeoutGoodsArr[i].goodsModel[j].cart_id && cartIds.push(takeoutGoodsArr[i].goodsModel[j].cart_id)
        }
      }
    }
    if (cartIds.length == 0) {
      this.showModal({
        content: '请先添加商品'
      });
      return;
    }
    this.sendRequest({
      url: '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: cartIds
      },
      success: function (res) {
        
        for(let goodsinfo in newdata[compid + '.takeoutByGoodsIdInfo']){
          newdata[compid + '.takeoutByGoodsIdInfo'][goodsinfo].totalNum = 0;
          newdata[compid + '.takeoutByGoodsIdInfo'][goodsinfo].totalPrice = 0;
          if (newdata[compid + '.takeoutByGoodsIdInfo'][goodsinfo].goodsModel) {
            for(let model in newdata[compid + '.takeoutByGoodsIdInfo'][goodsinfo].goodsModel){
              newdata[compid + '.takeoutByGoodsIdInfo'][goodsinfo].goodsModel[model].num = 0
              newdata[compid + '.takeoutByGoodsIdInfo'][goodsinfo].goodsModel[model].totalPrice = 0
            }
          }
        }
        that.globalData.waimaiTotalNum = 0;
        newdata[compid + '.waimaiTotalNum'] = 0;
        newdata[compid + '.waimaiTotalPrice'] = 0;
        newdata[compid + '.shoppingCartShow'] = true;
        pageInstance.setData(newdata)
      },
      fail: function () {
        that.showModal({
          content: '修改失败'
        })
      }
    });
  },
  clickWaimaiCategory: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let index        = dataset.index;
    let categoryId   = dataset.categoryid;
    let newdata      = pageInstance.data;
    newdata[compid + '.showCategory'] = newdata[compid].content[index];
    newdata[compid + '.show_goods_data'] = newdata[compid + '.goods_data'][categoryId];
    newdata[compid].customFeature.selected = index;
    pageInstance.setData(newdata);
  },
  clickWaimaiMinus: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let data         = pageInstance.data;
    let dataset      = event.target.dataset;
    let goodsId      = dataset.goodsid;
    let compid       = dataset.compid;
    let that         = this;
    let totalNum     = data[compid + '.waimaiTotalNum'];
    let totalPrice   = +data[compid + '.waimaiTotalPrice'];
    let model        = dataset.model;
    if (model) {
      this.showModal({
        content: '多规格商品只能去购物车操作',
      });
      return;
    }
    if (pageInstance.data[compid].is_disabled || data[compid + '.waimaiTotalNum'] == 0) {return}
    data[compid].is_disabled = true;
    pageInstance.setData(data);
    this.globalData.waimaiTotalNum --;
    data[compid + '.waimaiTotalNum'] --;
    data[compid + '.waimaiTotalPrice'] = (totalPrice - Number(data[compid + '.takeoutByGoodsIdInfo'][goodsId].price)).toFixed(2);
    data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum--;
    data[compid + '.takeoutByGoodsIdInfo'][goodsId].num--;
    data[compid + '.takeoutByGoodsIdInfo'].totalPrice -= Number(data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum * data[compid + '.takeoutByGoodsIdInfo'][goodsId].price).toFixed(2);
    if (data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum == 0) {
      this._removeWaimaiFromCart(data[compid + '.takeoutByGoodsIdInfo'][goodsId].cart_id, function () {
        data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum = data[compid + '.takeoutByGoodsIdInfo'][goodsId].num = 0;
        data[compid].is_disabled = false;
        pageInstance.setData(data);
      }, function () {
        let data = pageInstance.data;
        data[compid].is_disabled = false;
        pageInstance.setData(data);
      });
    } else if (data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum > 0) {
      this._changeWaimaiOrderCount(goodsId, data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum, undefined, function(cart_id){
        data[compid + '.takeoutByGoodsIdInfo'][goodsId].cart_id = cart_id;
        data[compid].is_disabled = false;
        pageInstance.setData(data);
      }, function () {
        let newdata = pageInstance.data;
        newdata[compid].is_disabled = false;
        pageInstance.setData(newdata);
      })
    }
  },
  _removeWaimaiFromCart: function (cart_id, callback, failCallback) {
    this.sendRequest({
      url: '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: [cart_id],
      },
      hideLoading:true,
      success: function (res) {
        callback && callback() 
      },
      fail: function (res) {
        failCallback && failCallback()
        this.showModal({
          content: '修改失败'
        })
      }
    });
  },
  _changeWaimaiOrderCount: function (id, num, modelid, callback, failCallback) {
    this.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: {
        goods_id: id,
        num: num,
        model_id: modelid || 0,
      },
      hideLoading: true,
      success: function (res) {
        callback && callback(res.data);
      },
      fail: function (res) {
        failCallback && failCallback();
        this.showModal({
          content: '修改失败'
        })
      }
    });
  },
  clickWaimaiPlus: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let data         = pageInstance.data;
    let goodsId      = event.target.dataset.goodsid;
    let compid       = event.target.dataset.compid;
    let model        = event.target.dataset.model;
    let goodsInfo    = data[compid + '.takeoutByGoodsIdInfo'][goodsId];
    let totalNum     = data[compid].waimaiTotalNum;
    let totalPrice   = +data[compid].waimaiTotalPrice;
    let modelLength  = [];
    let that         = this;
    if (pageInstance.data[compid].is_disabled) {return}
    data[compid].modelPrice = 0;
    if (!this.globalData.takeoutShopInfo.in_business_time) {
      this.showModal({ content: '店铺休息中,暂时无法接单' })
      return;
    }
    if (!data[compid].takeoutInfo.in_distance) {
      this.showModal({ content: '不在配送范围内' })
      return;
    }
    if (model) {
      var newModel = {}, countModel = 1;
      data[compid + '.clickGoodsId'] = goodsId;
      data[compid + '.goodsModelShow'] = true;
      data[compid + '.goodsModelInfo'] = goodsInfo;
      for (var i in goodsInfo.model) {
        modelLength.push(0)
        newModel[countModel] = goodsInfo.model[i];
        countModel++
      }
      for (var i in goodsInfo.model) {

        if (!data[compid + '.goodsModelInfo'].model[i].selected) {
          data[compid + '.goodsModelInfo'].model[i].selected = modelLength.concat();
          data[compid + '.goodsModelInfo'].chooseModelId = modelLength.concat();
        }
      }
      data[compid + '.goodsModelInfo'].model = {};
      data[compid + '.goodsModelInfo'].model = newModel;
      pageInstance.setData(data);
    } else {
      if (data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum >= data[compid + '.takeoutByGoodsIdInfo'][goodsId].stock){
        this.showModal({ content: '该商品库存不足' })
        return;
      }
      data[compid].is_disabled = true;
      pageInstance.setData(data);
      data[compid + '.waimaiTotalNum'] ++;
      this.globalData.waimaiTotalNum ++;
      data[compid + '.waimaiTotalPrice'] = (totalPrice + +goodsInfo.price).toFixed(2);
      data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum ++;
      data[compid + '.takeoutByGoodsIdInfo'][goodsId].num ? data[compid + '.takeoutByGoodsIdInfo'][goodsId].num++ : data[compid + '.takeoutByGoodsIdInfo'][goodsId].num = 1;
      data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalPrice = Number(data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum * data[compid + '.takeoutByGoodsIdInfo'][goodsId].price).toFixed(2);
      // (goodsInfo, _this, compid,  callback) 
      this._changeWaimaiOrderCount(goodsInfo.id, data[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum, undefined, function(cart_id){
        data[compid + '.takeoutByGoodsIdInfo'][goodsInfo.id].cart_id = cart_id;
        data[compid].is_disabled = false;
        pageInstance.setData(data);
      }, function () {
        let newdata = pageInstance.data;
        newdata[compid].is_disabled = false;
        pageInstance.setData(newdata);
      });
    }
  },
  clickTakeoutMinus: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let newdata      = pageInstance.data;
    let compid       = dataset.compid;
    let goodsId      = dataset.goodsid;
    let price        = dataset.price;
    let cart_id      = dataset.cart_id;
    let modelid      = dataset.modelid;
    if (newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum == 0 || (modelid && newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].num == 0)) {
      return;
    }
    if (pageInstance.data[compid].is_disabled) {return}
    newdata[compid].is_disabled = true;
    pageInstance.setData(newdata)
    this.globalData.waimaiTotalNum --;
    newdata[compid + '.waimaiTotalNum']--;
    newdata[compid + '.waimaiTotalPrice'] = (Number(newdata[compid + '.waimaiTotalPrice']) - Number(price)).toFixed(2);
    newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].totalNum--
    if (modelid) {
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].num--
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].totalPrice = Number(price * newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].num).toFixed(2);
      if (newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].num == 0) {
        this._removeWaimaiFromCart(cart_id, function () {
          pageInstance.setData(newdata);
        }, function () {
          let data=pageInstance.data;
          data[compid].is_disabled = false;
          pageInstance.setData(data);
        })
      } else if(newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].num > 0) {
        this._changeWaimaiOrderCount(goodsId, newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].num, modelid, function (cart_id) {
          newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelid].cart_id = cart_id;
          newdata[compid].is_disabled = false;
          pageInstance.setData(newdata);
        }, function () {
          let data = pageInstance.data;
          data[compid].is_disabled = false;
          pageInstance.setData(data);
        })
      }
    } else {
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].num--;
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].totalPrice = Number(price * newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].num).toFixed(2);
      if (newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].num == 0) {
        this._removeWaimaiFromCart(cart_id, function () {
          newdata[compid].is_disabled = false;
          pageInstance.setData(newdata);
        }, function () {
          let data=pageInstance.data;
          data[compid].is_disabled = false;
          pageInstance.setData(data);
        })
      } else {
        this._changeWaimaiOrderCount(goodsId, newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].num, undefined, function(cart_id){
          newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].cart_id = cart_id;
          newdata[compid].is_disabled = false;
          pageInstance.setData(newdata);
        }, function () {
          let data = pageInstance.data;
          data[compid].is_disabled = false;
          pageInstance.setData(data);
        })
      }
    }
  },
  clickTakeoutPlus: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let dataset      = event.currentTarget.dataset;
    let goodsid      = dataset.goodsid;
    let modelid      = dataset.modelid;
    let price        = dataset.price;
    let stock        = dataset.stock;
    let that         = this;
    let compid       = dataset.compid;
    if (pageInstance.data[compid].is_disabled) {return}
    newdata[compid].is_disabled = true;
    pageInstance.setData(newdata)
    if (newdata[compid + '.waimaiTotalNum'] >= stock){
      this.showModal({ content: '该商品库存不足' })
      return;
    }
    newdata[compid + '.waimaiTotalNum']++;
    this.globalData.waimaiTotalNum ++;
    newdata[compid + '.waimaiTotalPrice'] = (Number(newdata[compid + '.waimaiTotalPrice']) + Number(price)).toFixed(2);
    newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].totalNum++
    if (modelid) {
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].goodsModel[modelid].num++;
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].goodsModel[modelid].totalPrice = Number(price * newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].goodsModel[modelid].num).toFixed(2);
      this._changeWaimaiOrderCount(goodsid, newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].goodsModel[modelid].num, modelid, function (cart_id) {
        newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].goodsModel[modelid].cart_id = cart_id;
        newdata[compid].is_disabled = false;
        pageInstance.setData(newdata);
      }, function () {
        let data = pageInstance.data;
        data[compid].is_disabled = false;
        pageInstance.setData(data);
      });
    } else {
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].num++
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].totalPrice = Number(newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].num * price).toFixed(2)
      this._changeWaimaiOrderCount(goodsid, newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].num, undefined, function(cart_id){
        newdata[compid + '.takeoutByGoodsIdInfo'][goodsid].cart_id = cart_id;
        newdata[compid].is_disabled = false;
        pageInstance.setData(newdata);
      }, function () {
        let data = pageInstance.data;
        data[compid].is_disabled = false;
        pageInstance.setData(data);
      });
    }
  },
  changeAssessType: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let assessActive = event.currentTarget.dataset.active;
    let showAssess   = [];
    let compid       = event.currentTarget.dataset.compid;
    newdata[compid].assessActive = assessActive;
    for (var i = 0; i < newdata[compid].assessList.length; i++) {
      if (assessActive == 0) {
        newdata[compid].assessList[i].assess_info.has_img == 1 ? showAssess.push(newdata[compid].assessList[i]) : null;
      } else if (newdata[compid].assessList[i].assess_info.level == assessActive) {
        showAssess.push(newdata[compid].assessList[i]);
      }
    }
    newdata[compid].showAssess = showAssess;
    pageInstance.setData(newdata)
  },
  showShoppingCartPop: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.takeout;
    let newdata      = pageInstance.data;
    newdata[compid + '.shoppingCartShow'] = true;
    pageInstance.setData(newdata);
  },
  hideTakeoutShoppingCart: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.takeout;
    let newdata      = pageInstance.data;
    newdata[compid + '.shoppingCartShow'] = false;
    pageInstance.setData(newdata);
  },
  showTakeoutDetail: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let id           = event.currentTarget.dataset.id;
    let index        = event.currentTarget.dataset.index;
    let compid       = event.currentTarget.dataset.takeout;
    newdata[compid + '.goodsDetailShow'] = true;
    newdata[compid + '.goodsDetail'] = newdata[compid + '.show_goods_data'][index].form_data;
    pageInstance.setData(newdata)
  },
  hideTakeoutDetailPop: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.takeout;
    let newdata      = pageInstance.data;
    newdata[compid + '.goodsDetailShow'] = false;
    pageInstance.setData(newdata);
  },
  hideTakeoutModelPop: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.takeout;
    let newdata      = pageInstance.data;
    let goodsindex   = newdata[compid + '.index'];
    if (newdata[compid + '.willChooseTakeout']) {
      delete newdata[compid + '.willChooseTakeout']
    }
    newdata[compid + '.goodsModelShow'] = false;
    newdata[compid + '.modelPrice'] = 0;
    pageInstance.setData(newdata);
  },
  chooseTakeoutModel: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let index        = dataset.index;
    let compid       = dataset.takeout;
    let modelname    = dataset.modelname;
    let id           = dataset.id;
    let parentIndex  = dataset.parentindex;
    let modelNameArr;
    let newdata      = pageInstance.data;
    let goodsIndex   = newdata[compid + '.index'];
    let newModel     = {};
    let countModel   = 1;
    if (!newdata[compid + '.modelNameArr']) {
      newdata[compid + '.modelNameArr'] = [];
      for (var i in newdata[compid + '.goodsModelInfo'].model) {
        newdata[compid + '.modelNameArr'].push(0);
        newModel[countModel] = newdata[compid + '.goodsModelInfo'].model[i];
        countModel++
      }
      newdata[compid + '.goodsModelInfo'].model[parentIndex].selected = newdata[compid + '.modelNameArr'].concat();
    }

    newdata[compid + '.goodsModelInfo'].chooseModelId[+parentIndex - 1] = id;
    newdata[compid + '.modelNameArr'][+parentIndex - 1] = modelname;
    for (var i = 0; i < newdata[compid + '.goodsModelInfo'].model[parentIndex].selected.length; i++) {
      i == index ? newdata[compid + '.goodsModelInfo'].model[parentIndex].selected[i] = 1 : newdata[compid + '.goodsModelInfo'].model[parentIndex].selected[i] = 0
    }
    newdata[compid + '.goodsModelInfo'].model[parentIndex].selected[index] = 1;

    pageInstance.setData(newdata);
    this._takeoutModelPirce(dataset, newdata[compid + '.modelNameArr']);
  },
  _takeoutModelPirce: function (dataset, modelNameArr) {
    var pageInstance = this.getAppCurrentPage(),
        newdata = pageInstance.data,
        compid = dataset.takeout,
        index = dataset.index,
        price = '',
        modelids = newdata[compid + '.goodsModelInfo'].chooseModelId.concat().sort().toString(),
        modelstr = '',
        modelid = '',
        goodsIndex = newdata[compid + '.index'],
        hasModelIds = newdata[compid + '.goodsModelInfo'].goods_model;
    for (var i = 0; i < hasModelIds.length; i++) {
      let ids = hasModelIds[i].model.split(',').sort().toString();
      if (modelids == ids) {
        newdata[compid + '.modelPrice'] = +hasModelIds[i].price;
        modelid = hasModelIds[i].id;
        price = +hasModelIds[i].price;
        if (!newdata[compid + '.willChooseTakeout'] || newdata[compid+'.chosenModelIds']) {
          newdata[compid + '.willChooseTakeout'] = {};
          newdata[compid + '.willChooseTakeout'][newdata[compid + '.clickGoodsId']] = {};
          newdata[compid + '.willChooseTakeout'][newdata[compid + '.clickGoodsId']][modelid] = {
            title: newdata[compid + '.takeoutByGoodsIdInfo'][newdata[compid + '.clickGoodsId']].title,
            price: Number(price).toFixed(2),
            num: 1,
            modalId: newdata[compid + '.goodsModelInfo'].chooseModelId,
            modalStr: modelNameArr,
            modelid: modelid,
            totalPrice: Number(price).toFixed(2)
          }
        }
      }
    }
    newdata[compid + '.chosenModelIds'] = modelid;
    newdata[compid + '.chosenModelPrice'] = Number(price).toFixed(2);
    pageInstance.setData(newdata)
  },
  sureChooseModel: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let newdata      = pageInstance.data;
    let goodsId      = dataset.goodsid;
    let price        = +dataset.modelprice;
    let compid       = dataset.takeout;
    if (!newdata[compid + '.chosenModelIds']) {
      this.showModal({
        content: '请选择规格'
      });
      return
    }
    if (newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[newdata[compid + '.chosenModelIds']].num >= newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[newdata[compid + '.chosenModelIds']].stock) {
      this.showModal({
        content: '该规格库存不足'
      });
      return
    }
    let modelInfo = newdata[compid + '.willChooseTakeout'][newdata[compid + '.clickGoodsId']][newdata[compid + '.chosenModelIds']];
    
    Object.assign(newdata[compid + '.takeoutByGoodsIdInfo'][newdata[compid + '.clickGoodsId']].goodsModel[newdata[compid + '.chosenModelIds']], modelInfo)
    newdata[compid + '.takeoutByGoodsIdInfo'][newdata[compid + '.clickGoodsId']].totalNum += modelInfo.num;
    newdata[compid + '.waimaiTotalPrice'] = (Number(newdata[compid + '.waimaiTotalPrice']) + Number(price)).toFixed(2);
    newdata[compid + '.waimaiTotalNum']++;
    this.globalData.waimaiTotalNum ++;
    newdata[compid + '.goodsModelShow'] = false;
    newdata[compid + '.modelPrice'] = 0;
    this._changeWaimaiOrderCount(goodsId, modelInfo.num, modelInfo.modelid, function (cart_id) {
      newdata[compid + '.takeoutByGoodsIdInfo'][goodsId].goodsModel[modelInfo.modelid].cart_id = cart_id;
      newdata[compid].is_disabled = false;
      delete newdata[compid + '.modelNameArr'];
      delete newdata[compid + '.chosenModelIds'];
      delete newdata[compid + '.chosenModelPrice'];
      delete newdata[compid + '.willChooseTakeout'];
      for(let model in newdata[compid + '.goodsModelInfo'].model){
        delete newdata[compid + '.goodsModelInfo'].model[model].selected
      }
      pageInstance.setData(newdata);
    }, function () {
      let data=pageInstance.data;
      data[compid].is_disabled = false;
      pageInstance.setData(data);
    });
  },
  clickWaimaiChooseComplete: function (event) {
    let pageInstance    = this.getAppCurrentPage();
    let compid          = event.target.dataset.compid;
    let newData         = pageInstance.data;
    let takeoutGoodsArr = newData[compid + '.takeoutByGoodsIdInfo'];
    let idArr           = [];
    if (!newData[compid + '.waimaiTotalNum']) {
      return;
    }
    if (+newData[compid].takeoutInfo.min_deliver_price > +newData[compid].waimaiTotalPrice) {
      this.showModal({
        content: '还没达到起送价哦'
      });
      return;
    }
    for (var i in takeoutGoodsArr) {
      if (takeoutGoodsArr[i].cart_id) {
        takeoutGoodsArr[i].cart_id && idArr.push(takeoutGoodsArr[i].cart_id)
      } else {
        for (var j in takeoutGoodsArr[i].goodsModel) {
          takeoutGoodsArr[i].goodsModel[j].cart_id && idArr.push(takeoutGoodsArr[i].goodsModel[j].cart_id)
        }
      }
    }
    this.turnToPage('/pages/previewTakeoutOrder/previewTakeoutOrder?cart_arr=' + idArr)
  },
  tapGoodsTradeHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let goods = JSON.parse(event.currentTarget.dataset.eventParams),
          goods_id = goods['goods_id'],
          goods_type = goods['goods_type'];
      if (!!goods_id) {
        goods_type == 3 ? this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + goods_id)
                        : this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + goods_id);
      }
    }
  },
  tapInnerLinkHandler: function (event) {
    var param = event.currentTarget.dataset.eventParams;
    if (param) {
      param = JSON.parse(param);
      var url = param.inner_page_link;
      if (url.indexOf('/prePage/') >= 0) {
        this.turnBack();
      } else if (url) {
        var is_redirect = param.is_redirect == 1 ? true : false;
        this.turnToPage(url, is_redirect);
      }
    }
  },
  tapPhoneCallHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      var phone_num = JSON.parse(event.currentTarget.dataset.eventParams)['phone_num'];
      this.makePhoneCall(phone_num);
    }
  },
  tapRefreshListHandler: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let eventParams   = JSON.parse(event.currentTarget.dataset.eventParams);
    let refreshObject = eventParams.refresh_object;
    let compids_params;

    if ((compids_params = pageInstance.goods_compids_params).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('goods-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.list_compids_params).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('list-vessel', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.franchiseeComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('franchisee-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
  },
  _refreshPageList: function (eleType, eventParams, compids_params, pageInstance) {
    let requestData = {
          page: 1,
          form: compids_params.param.form,
          is_count: compids_params.param.form.is_count ? 1 : 0,
          idx_arr: {
            idx: eventParams.index_segment,
            idx_value: eventParams.index_value
          }
        };

    if (eventParams.parent_type == 'classify') { // 如果是分类组件的分类项 需要更改当前选中元素的索引
      var classify_selected_index = {};
      classify_selected_index[eventParams.parent_comp_id + '.customFeature.selected'] = eventParams.item_index;
      pageInstance.setData(classify_selected_index);
    }

    compids_params.param.idx_arr = requestData.idx_arr;

    switch (eleType) {
      case 'goods-list': this._refreshGoodsList(compids_params['compid'], requestData, pageInstance); break;
      case 'list-vessel': this._refreshListVessel(compids_params['compid'], requestData, pageInstance); break;
      case 'franchisee-list': this._refreshFranchiseeList(compids_params['compid'], requestData, pageInstance); break;
    }
  },
  _refreshGoodsList: function (targetCompId, requestData, pageInstance) {
    let _this = this;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      method: 'post',
      data: requestData,
      success: function(res){
        var newData = {};

        newData[targetCompId + '.goods_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        pageInstance.setData(newData);
      }
    })
  },
  _refreshListVessel: function (targetCompId, requestData, pageInstance) {
    let _this = this;

    this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      method: 'post',
      data: requestData,
      success: function (res) {
        var newData = {};
        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            let description = res.data[j].form_data[k];
            if (!description) {
              continue;
            }
            // 检测如果不是一个图片链接的话就解析
            if(typeof description == 'string' && !/^http:\/\/img/g.test(description)){
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
          }
        }
        newData[targetCompId + '.list_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        pageInstance.setData(newData);
      }
    })
  },
  _refreshFranchiseeList: function (targetCompId, requestData, pageInstance) {
    let _this = this;

    requestData.page = -1;
    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      method: 'post',
      data: requestData,
      success: function (res) {
        var newData = {};

        for(let index in res.data){
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }
        newData[targetCompId + '.franchisee_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        pageInstance.setData(newData);
      }
    })
  },
  tapGetCouponHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      var coupon_id = JSON.parse(event.currentTarget.dataset.eventParams)['coupon_id'];
      this.turnToPage('/pages/couponDetail/couponDetail?detail=' + coupon_id);
    }
  },
  tapCommunityHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let community_id = JSON.parse(event.currentTarget.dataset.eventParams)['community_id'];
      this.turnToPage('/pages/communityPage/communityPage?detail=' + community_id);
    }
  },
  turnToCommunityPage: function (event) {
    let id = event.currentTarget.dataset.id;
    this.turnToPage('/pages/communityPage/communityPage?detail=' + id);
  },
  tapToFranchiseeHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let franchisee_id = JSON.parse(event.currentTarget.dataset.eventParams)['franchisee_id'];
      this.turnToPage('/pages/franchiseeDetail/franchiseeDetail?detail=' + franchisee_id);
    }
  },
  tapToTransferPageHandler: function () {
    this.turnToPage('/pages/transferPage/transferPage');
  },
  tapToSeckillHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let goods = JSON.parse(event.currentTarget.dataset.eventParams),
          seckill_id = goods['seckill_id'],
          seckill_type = goods['seckill_type'];
      if (!!seckill_id) {
        this.turnToPage('/pages/goodsDetail/goodsDetail?goodsType=seckill&detail=' + seckill_id);
      }
    }
  },
  tapToCouponReceiveListHandler: function () {
    this.turnToPage('/pages/couponReceiveListPage/couponReceiveListPage');
  },
  tapToRechargeHandler: function () {
    this.turnToPage('/pages/recharge/recharge');
  },
  tapToXcx: function (event) {
    if(event.currentTarget.dataset.eventParams){
      let appid = JSON.parse(event.currentTarget.dataset.eventParams)['xcx_appid'];
      this.navigateToXcx(appid);
    }
  },
  tapFranchiseeLocation: function (event) {
    let _this        = this;
    let compid       = event.currentTarget.dataset.compid;
    let pageInstance = this.getAppCurrentPage();

    function success(res) {
      let name    = res.name;
      let lat     = res.latitude;
      let lng     = res.longitude;
      let newdata = {};
      let param, requestData;

      newdata[compid +'.location_address'] = name;
      pageInstance.setData(newdata);

      for (var index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].param.id = compid) {
          param = pageInstance.franchiseeComps[index].param;
          param.latitude = lat;
          param.longitude = lng;
        }
      }
      requestData = {
        id: compid,
        form: 'app_shop',
        page: 1,
        sort_key: param.sort_key,
        sort_direction: param.sort_direction,
        latitude: param.latitude,
        longitude: param.longitude,
        idx_arr: param.idx_arr
      }
      _this.refreshFranchiseeList(compid, requestData, pageInstance);
      }

    function cancel() {
      console.log('cancel');
    }

    function fail() {
      console.log('fail');
    }
    this.chooseLocation({
      success: success,
      fail: fail,
      cancel: cancel
    });
  },
  showAddShoppingcart: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let goods_id     = dataset.id;
    let buynow       = dataset.buynow;
    this.sendRequest({
      url: '/index.php?r=AppShop/getGoods',
      data: {
        data_id: goods_id
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let goods         = res.data[0].form_data;
          let defaultSelect = goods.model_items[0];
          let goodsModel    = [];
          let selectModels  = [];
          let goodprice     = 0;
          let goodstock     = 0;
          let goodid;
          let selectText    = '';
          let goodimgurl    = '';

          if (goods.model_items.length) {
            goodprice = defaultSelect.price;
            goodstock = defaultSelect.stock;
            goodid = defaultSelect.id;
            goodimgurl = defaultSelect.img_url;
          } else {
            goodprice = goods.price;
            goodstock = goods.stock;
            goodimgurl = goods.cover;
          }
          for (let key in goods.model) {
            if (key) {
              let model = goods.model[key];
              goodsModel.push(model);
              selectModels.push(model.subModelId[0]);
              selectText += '“' + model.subModelName[0] + '” ';
            }
          }
          goods.model = goodsModel;
          if (goods.goods_type == 3) {
            var businesssTimeString = '';
            if (goods.business_time && goods.business_time.business_time) {
              var goodBusinesssTime = goods.business_time.business_time;
              for (var i = 0; i < goodBusinesssTime.length; i++) {
                businesssTimeString += goodBusinesssTime[i].start_time.substring(0, 2) + ':' + goodBusinesssTime[i].start_time.substring(2, 4) + '-' + goodBusinesssTime[i].end_time.substring(0, 2) + ':' + goodBusinesssTime[i].end_time.substring(2, 4) + '/';
              }
              businesssTimeString = '出售时间：' + businesssTimeString.substring(0, businesssTimeString.length - 1);
              pageInstance.setData({
              })
      }
            pageInstance.getCartList();
            pageInstance.setData({
              'addTostoreShoppingCartShow': true,
              businesssTimeString: businesssTimeString
            })
          } else {
            pageInstance.setData({
              'addShoppingCartShow': true,
              isBuyNow : buynow
            })
          }
          pageInstance.setData({
            goodsInfo: goods ,
            'selectGoodsModelInfo.price': goodprice,
            'selectGoodsModelInfo.stock': goodstock,
            'selectGoodsModelInfo.buyCount': 1,
            'selectGoodsModelInfo.buyTostoreCount': 0,
            'selectGoodsModelInfo.cart_id':'',
            'selectGoodsModelInfo.models': selectModels,
            'selectGoodsModelInfo.modelId': goodid ,
            'selectGoodsModelInfo.models_text' : selectText,
            'selectGoodsModelInfo.imgurl' : goodimgurl
          });
        }
      }
    });
  },
  hideAddShoppingcart: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      addShoppingCartShow: false,
      addTostoreShoppingCartShow:false
    });
  },
  selectGoodsSubModel: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let dataset       = event.target.dataset;
    let modelIndex    = dataset.modelIndex;
    let submodelIndex = dataset.submodelIndex;
    let data          = {};
    let selectModels  = pageInstance.data.selectGoodsModelInfo.models;
    let model         = pageInstance.data.goodsInfo.model;
    let text          = '';

    selectModels[modelIndex] = model[modelIndex].subModelId[submodelIndex];

    for (let i = 0; i < selectModels.length; i++) {
      let selectSubModelId = model[i].subModelId;
      for (let j = 0; j < selectSubModelId.length; j++) {
        if( selectModels[i] == selectSubModelId[j] ){
          text += '“' + model[i].subModelName[j] + '” ';
        }
      }
    }
    data['selectGoodsModelInfo.models'] = selectModels;
    data['selectGoodsModelInfo.models_text'] = text;

    pageInstance.setData(data);
    pageInstance.resetSelectCountPrice();
  },
  resetSelectCountPrice: function () {
    let pageInstance   = this.getAppCurrentPage();
    let selectModelIds = pageInstance.data.selectGoodsModelInfo.models.join(',');
    let modelItems     = pageInstance.data.goodsInfo.model_items;
    let data           = {};
    let cover          = pageInstance.data.goodsInfo.cover;

    data['selectGoodsModelInfo.buyCount'] = 1;
    data['selectGoodsModelInfo.buyTostoreCount'] = 0;
    for (let i = modelItems.length - 1; i >= 0; i--) {
      if(modelItems[i].model == selectModelIds){
        data['selectGoodsModelInfo.stock'] = modelItems[i].stock;
        data['selectGoodsModelInfo.price'] = modelItems[i].price;
        data['selectGoodsModelInfo.modelId'] = modelItems[i].id;
        data['selectGoodsModelInfo.imgurl'] = modelItems[i].img_url || cover;
        break;
      }
    }
    pageInstance.setData(data);
  },
  clickGoodsMinusButton: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let count        = pageInstance.data.selectGoodsModelInfo.buyCount;
    if(count <= 1){
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyCount': count - 1
    });
  },
  clickGoodsPlusButton: function (event) {
    let pageInstance         = this.getAppCurrentPage();
    let selectGoodsModelInfo = pageInstance.data.selectGoodsModelInfo;
    let count                = selectGoodsModelInfo.buyCount;
    let stock                = selectGoodsModelInfo.stock;

    if(count >= stock) {
      return;
    }

    pageInstance.setData({
      'selectGoodsModelInfo.buyCount': count + 1
    });
  },
  sureAddToShoppingCart: function () {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    let param        = {
      goods_id: pageInstance.data.goodsInfo.id,
      model_id: pageInstance.data.selectGoodsModelInfo.modelId || '',
      num: pageInstance.data.selectGoodsModelInfo.buyCount,
      sub_shop_app_id : '',
      is_seckill : ''
    };

    this.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      success: function (res) {
        setTimeout(function () {
          that.showToast({
            title:'添加成功',
            icon:'success'
          });
        } , 50);
        pageInstance.hideAddShoppingcart();
      }
    })
  },
  sureAddToBuyNow: function () {
    let pageInstance = this.getAppCurrentPage();
    let param        = {
      goods_id: pageInstance.data.goodsInfo.id,
      model_id: pageInstance.data.selectGoodsModelInfo.modelId || '',
      num: pageInstance.data.selectGoodsModelInfo.buyCount,
      sub_shop_app_id: '',
      is_seckill : ''
    };
    let that = this;
    this.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      success: function (res) {
        var cart_arr = [res.data],
            pagePath = '/pages/previewGoodsOrder/previewGoodsOrder?cart_arr='+ encodeURIComponent(cart_arr);
        pageInstance.hideAddShoppingcart();
        that.turnToPage(pagePath);
      }
    })
  },
  clickTostoreMinusButton: function () {
    let pageInstance = this.getAppCurrentPage();
    let count        = pageInstance.data.selectGoodsModelInfo.buyTostoreCount;
    if (count <= 0) {
      return;
    }
    if (count <= 1) {
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppShop/deleteCart',
        method: 'post',
        data: {
          cart_id_arr: [pageInstance.data.selectGoodsModelInfo.cart_id],
          sub_shop_app_id: pageInstance.franchiseeId || ''
        },
        fail: function (res) {
          pageInstance.setData({
            addToShoppingCartCount: currentGoodsNum,
            cartGoodsNum: currentCartNum,
            cartGoodsTotalPrice: currentTotalPrice
          });
        }
      });
      pageInstance.setData({
        'selectGoodsModelInfo.buyTostoreCount': count - 1
      });
      this.getTostoreCartList();
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyTostoreCount': count
    });
    this._sureAddTostoreShoppingCart('mins');
  },
  clickTostorePlusButton: function () {
    let pageInstance         = this.getAppCurrentPage();
    let selectGoodsModelInfo = pageInstance.data.selectGoodsModelInfo;
    let count                = selectGoodsModelInfo.buyTostoreCount;
    let stock                = selectGoodsModelInfo.stock;

    if (count >= stock) {
      this.showModal({
        content: '库存不足'
      });
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyTostoreCount': count
    });
    this._sureAddTostoreShoppingCart('plus');
  },
  _sureAddTostoreShoppingCart: function (type) {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    let goodsNum     = pageInstance.data.selectGoodsModelInfo.buyTostoreCount;
    if (type == 'plus') {
      goodsNum = goodsNum + 1;
    } else {
      goodsNum = goodsNum - 1;
    }
    var param = {
      goods_id: pageInstance.data.goodsInfo.id,
      model_id: pageInstance.data.selectGoodsModelInfo.modelId || '',
      num: goodsNum,
      sub_shop_app_id: ''
    };

    that.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      success: function (res) {
        var data = res.data;
        pageInstance.setData({
          'selectGoodsModelInfo.cart_id': data,
          'selectGoodsModelInfo.buyTostoreCount': goodsNum
        });
        that.getTostoreCartList();
      },
      successStatusAbnormal: function (res) {
        pageInstance.setData({
          'selectGoodsModelInfo.buyTostoreCount': 0
        });
        that.showModal({
          content: res.data
        })
      }
    })
  },
  readyToTostorePay: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId;
    let pagePath     = '/pages/previewOrderDetail/previewOrderDetail' + (franchiseeId ? '?franchisee=' + franchiseeId : '');
    if (pageInstance.data.cartGoodsNum <= 0 || !pageInstance.data.tostoreTypeFlag) {
      return;
    }
    this.turnToPage(pagePath);
    pageInstance.hideAddShoppingcart();
  },
  getValidateTostore: function () {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    this.sendRequest({
      url: '/index.php?r=AppShop/precheckShoppingCart',
      data: {
        sub_shop_app_id: pageInstance.franchiseeId || '',
        parent_shop_app_id: pageInstance.franchiseeId ? that.getAppId() : ''
      },
      success: function (res) {
        that.readyToTostorePay();
      },
      successStatusAbnormal: function (res) {
        that.showModal({
          content: res.data,
          confirm: function () {
            res.status === 1 && that.goToShoppingCart();
          }
        })
      }
    })
  },
  goToShoppingCart: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId;
    let pagePath     = '/pages/shoppingCart/shoppingCart' + (franchiseeId ? '?franchisee=' + franchiseeId : '');
    pageInstance.hideAddShoppingcart();
    this.turnToPage(pagePath);
  },
  getTostoreCartList: function () {
    let pageInstance = this.getAppCurrentPage(); 
    this.sendRequest({
      url: '/index.php?r=AppShop/cartList',
      data: {
        page: 1,
        page_size: 100,
        sub_shop_app_id: pageInstance.franchiseeId || ''
      },
      success: function (res) {
        var price = 0,
          num = 0,
          addToShoppingCartCount = 0,
          tostoreTypeFlag = false;

        for (var i = res.data.length - 1; i >= 0; i--) {
          var data = res.data[i];
          price += +data.num * +data.price;
          num += +data.num;
          if (data.goods_type == 3) {
            tostoreTypeFlag = true;
          }
          if (pageInstance.goodsId == data.goods_id) {
            addToShoppingCartCount = data.num;
            pageInstance.cart_id = data.id;
          }
        }
        pageInstance.setData({
          tostoreTypeFlag: tostoreTypeFlag,
          cartGoodsNum: num,
          cartGoodsTotalPrice: price.toFixed(2),
          addToShoppingCartCount: addToShoppingCartCount,

        });
      }
    })
  },
  turnToSearchPage: function (event) {
    if (event.target.dataset.param) {
      this.turnToPage('/pages/advanceSearch/advanceSearch?param=' + event.target.dataset.param);
    }else{
      this.turnToPage('/pages/advanceSearch/advanceSearch?form=' + event.target.dataset.form);
    }
  },
  suspensionTurnToPage: function (event) {
    let router = event.currentTarget.dataset.router;
    this.turnToPage('/pages/' + router + '/' + router +'?from=suspension');
  },
  beforeSeckillDownCount : function(formData , page ,path) {
    let _this = this,
        downcount ;
    downcount = _this.seckillDownCount({
      startTime : formData.server_time,
      endTime : formData.seckill_start_time,
      callback : function () {
        let newData = {};
        newData[path+'.seckill_start_state'] = 1;
        newData[path+'.server_time'] = formData.seckill_start_time;
        page.setData(newData);
        formData.server_time = formData.seckill_start_time;
        _this.duringSeckillDownCount(formData , page ,path);
      }
    } , page , path + '.downCount');

    return downcount;
  },
  duringSeckillDownCount : function(formData , page ,path) {
    let _this = this,
        downcount;
    downcount = _this.seckillDownCount({
      startTime : formData.server_time,
      endTime : formData.seckill_end_time ,
      callback : function () {
        let newData = {};
        newData[path+'.seckill_start_state'] = 2;
        page.setData(newData);
      }
    } , page , path + '.downCount');

    return downcount;
  },
  seckillDownCount: function(opts , page , path) {
    let opt = {
                startTime : opts.startTime || null,
                endTime : opts.endTime || null,
                callback : opts.callback
              },
        systemInfo = this.systemInfo.system,
        isiphone = systemInfo.indexOf('iOS') != -1;

    if(isiphone && /\-/g.test(opt.endTime)){
      opt.endTime = opt.endTime.replace(/\-/g , '/');
    }
    if(isiphone && /\-/g.test(opt.startTime)){
      opt.startTime = opt.startTime.replace(/\-/g , '/');
    }
    if(/^\d+$/.test(opt.endTime)){
      opt.endTime = opt.endTime * 1000;
    }
    if(/^\d+$/.test(opt.startTime)){
      opt.startTime = opt.startTime * 1000;
    }

    let target_date = new Date(opt.endTime),
        current_date = new Date(opt.startTime),
        interval ,
        isfirst = true,
        difference = target_date - current_date;

    function countdown () {
        if (difference < 0) {
            clearInterval(interval);
            if (opt.callback && typeof opt.callback === 'function'){opt.callback();};
            return;
        }

        let _second = 1000,
            _minute = _second * 60,
            _hour = _minute * 60,
            time = {};

        let hours = Math.floor(difference / _hour),
            minutes = Math.floor((difference % _hour) / _minute),
            seconds = Math.floor((difference % _minute) / _second);

            hours = (String(hours).length >= 2) ? hours : '0' + hours;
            minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
            seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
        if(isfirst){
          time[path+'.hours'] = hours;
          time[path + '.minutes'] = minutes;
        }else{
          (minutes == '59' && seconds == '59') && (time[path+'.hours'] = hours);
          (seconds == '59') && (time[path + '.minutes'] = minutes);
        }
        time[path + '.seconds'] = seconds;

        page.setData(time);

        isfirst = false;
        difference -= 1000;
    };
    interval = setInterval(countdown, 1000);

    return {
      interval : interval ,
      clear : function () {
        clearInterval(interval);
      }
    };
  },
  getAssessList: function(param){
    param.url = '/index.php?r=AppShop/GetAssessList';
    this.sendRequest(param);
  },
  getOrderDetail: function(param){
    param.url = '/index.php?r=AppShop/getOrder';
    this.sendRequest(param);
  },
  getHomepageRouter: function () {
    return this.globalData.homepageRouter;
  },
  getAppId: function () {
    return this.globalData.appId;
  },
  getDefaultPhoto: function () {
    return this.globalData.defaultPhoto;
  },
  getSessionKey: function () {
    return this.globalData.sessionKey;
  },
  setSessionKey: function(session_key){
    this.globalData.sessionKey = session_key;
    wx.setStorage({
      key: 'session_key',
      data: session_key
    })
  },
  getUserInfo: function () {
    return this.globalData.userInfo;
  },
  setUserInfoStorage: function(info){
    for (var key in info) {
      this.globalData.userInfo[key] = info[key];
    }
    wx.setStorage({
      key: 'userInfo',
      data: this.globalData.userInfo
    })
  },
  setPageUserInfo: function () {
    let currentPage = this.getAppCurrentPage();
    let newdata     = {};

    newdata['userInfo'] = this.getUserInfo();
    currentPage.setData(newdata);
  },
  getAppCurrentPage: function () {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
  },
  getWaimaiTotalPrice: function () {
    return this.globalData.waimaiTotalPrice;
  },
  getTabPagePathArr: function () {
    return JSON.parse(this.globalData.tabBarPagePathArr);
  },
  getWxParseOldPattern: function () {
    return this.globalData.wxParseOldPattern;
  },
  getWxParseResult: function (data, setDataKey) {
    var page = this.getAppCurrentPage();
    return WxParse.wxParse(setDataKey || this.getWxParseOldPattern(),'html', data, page);
  },
  getAppTitle: function () {
    return this.globalData.appTitle;
  },
  getAppDescription: function () {
    return this.globalData.appDescription;
  },
  setLocationInfo: function (info) {
    this.globalData.locationInfo = info;
  },
  getLocationInfo: function () {
    return this.globalData.locationInfo;
  },
  getSiteBaseUrl: function () {
    return this.globalData.siteBaseUrl;
  },
  getUrlLocationId: function () {
    return this.globalData.urlLocationId;
  },
  getPreviewGoodsInfo: function () {
    return this.globalData.previewGoodsOrderGoodsInfo;
  },
  setPreviewGoodsInfo: function (goodsInfoArr) {
    this.globalData.previewGoodsOrderGoodsInfo = goodsInfoArr;
  },
  getGoodsAdditionalInfo: function () {
    return this.globalData.goodsAdditionalInfo;
  },
  setGoodsAdditionalInfo: function (additionalInfo) {
    this.globalData.goodsAdditionalInfo = additionalInfo;
  },
  getIsLogin: function () {
    return this.globalData.isLogin;
  },
  setIsLogin: function (isLogin) {
    this.globalData.isLogin = isLogin;
  },

  globalData:{
    appId: '5m6U5WNLzm',
        tabBarPagePathArr: '["/pages/page10000/page10000","/pages/page10002/page10002","/pages/page10010/page10010","/pages/page10001/page10001"]',
        homepageRouter: 'page10000',
    formData: null,
    userInfo: {},
    sessionKey: '',
    notBindXcxAppId: false,
    waimaiTotalNum: 0,
    waimaiTotalPrice: 0,
    takeoutShopInfo: {},
    takeoutRefresh : false,
    isLogin: false,
    locationInfo: {
      latitude: '',
      longitude: '',
      address: ''
    },
    previewGoodsOrderGoodsInfo: [],
    goodsAdditionalInfo: {}, 
    urlLocationId:'',
    wxParseOldPattern: '_listVesselRichText_',
    cdnUrl: 'http://cdn.jisuapp.cn',
    defaultPhoto: 'http://cdn.jisuapp.cn/zhichi_frontend/static/webapp/images/default_photo.png',
    siteBaseUrl:'https://xcx.yingyonghao8.com',
    appTitle: '拼图服饰',
    appDescription: '“拼途”定制，致力于提供各类高品质的文化衫、活动衫、工作服、活动服班服、情侣亲子服等个性服装定制。',
    appLogo: 'http://img.weiye.me/zcimgdir/album/file_598bc4afafb10.png'
  }
})

