var app      = getApp();

var pageData = {
  data: {"search1":{"type":"search","style":"margin-top:0;height:117.1875rpx;width:750rpx;background-color:rgb(239, 239, 244);margin-left:auto;","content":{"placeholder":"请输入搜索内容"},"customFeature":{"hasQuickTags":false,"ifLocation":true,"quickTags":[],"searchObject":""},"animations":[],"page_form":"","compId":"search1","parentCompid":"search1"},"carousel2":{"type":"carousel","style":"height:367.96875rpx;margin-left:auto;margin-right:auto;opacity:1;","content":[{"customFeature":[],"pic":"http:\/\/cdn.jisuapp.cn\/zhichi_frontend\/static\/webapp\/images\/default.png","content":"","parentCompid":"carousel2","style":""},{"customFeature":[],"pic":"http:\/\/cdn.jisuapp.cn\/zhichi_frontend\/static\/webapp\/images\/default.png","content":"","parentCompid":"carousel2","style":""}],"customFeature":{"autoplay":true,"interval":"2.9","carouselgroupId":"147909"},"animations":[],"page_form":"","compId":"carousel2"},"classify3":{"type":"classify","style":"font-size:30.46875rpx;height:82.03125rpx;line-height:82.03125rpx;opacity:1;background-color:rgb(255, 255, 255);color:rgb(136, 136, 136);margin-top:11.71875rpx;margin-left:auto;","content":[{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10002"},"text":"圆领T恤","content":"","parentCompid":"classify3","style":"","itemType":null,"itemParentType":"classify","itemIndex":0,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10002\\\/page10002\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10003"},"text":"翻领Polo","content":"","parentCompid":"classify3","style":"","itemType":null,"itemParentType":"classify","itemIndex":1,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10003\\\/page10003\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10004"},"text":"卫衣长袖","content":"","parentCompid":"classify3","style":"","itemType":null,"itemParentType":"classify","itemIndex":2,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10004\\\/page10004\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10005"},"text":"风衣外套","content":"","parentCompid":"classify3","style":"","itemType":null,"itemParentType":"classify","itemIndex":3,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10005\\\/page10005\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10006"},"text":"儿童专区","content":"","parentCompid":"classify3","style":"","itemType":null,"itemParentType":"classify","itemIndex":4,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10006\\\/page10006\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"action":"inner-link","page-link":"page10007"},"text":"其它定制","content":"","parentCompid":"classify3","style":"","itemType":null,"itemParentType":"classify","itemIndex":5,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10007\\\/page10007\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"}],"customFeature":{"mode":"1","selected":"0","selectedColor":"rgb(136, 136, 136)"},"animations":[],"page_form":"","compId":"classify3"},"free_vessel4":{"type":"free-vessel","style":"width:750rpx;height:372.65625rpx;background-color:rgb(255, 255, 255);margin-bottom:auto;margin-right:auto;opacity:1;margin-left:auto;","content":[{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:363.28125rpx;width:750rpx;margin-left:auto;margin-right:0;margin-top:0;position:absolute;top:7.03125rpx;right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_598dca6c3f547.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","segment":"tp","ifMust":false,"action":"inner-link","inner-page-link":"page10007","goods-id":"1221014","goods-name":"2017夏装男士短袖t恤POLO衫新款体恤韩版潮流男装翻领衣服","goods-type":"0"},"animations":[],"compId":"data.content[0]","parentCompid":"free_vessel4","itemType":"picture","itemParentType":"free-vessel","itemIndex":0,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10007\\\/page10007\",\"is_redirect\":0}","eventHandler":"tapInnerLinkHandler"},{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(255, 255, 255);font-size:39.84375rpx;height:44.53125rpx;line-height:44.53125rpx;margin-left:auto;margin-top:0;opacity:1;text-align:left;position:absolute;left:405.46875rpx;top:131.25rpx;margin-right:0;","content":"在线定制","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0"},"animations":[],"compId":"data.content[1]","parentCompid":"free_vessel4","markColor":"","mode":0},{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(204, 0, 0);font-size:42.1875rpx;height:44.53125rpx;line-height:44.53125rpx;margin-left:auto;margin-top:0;opacity:1;text-align:left;position:absolute;left:307.03125rpx;top:70.3125rpx;margin-right:0;","content":"随心所欲","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0"},"animations":[],"compId":"data.content[2]","parentCompid":"free_vessel4","markColor":"","mode":0},{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:187.5rpx;width:234.375rpx;margin-left:auto;margin-right:0;margin-top:0;position:absolute;left:318.75rpx;top:366.796875rpx;","content":"http:\/\/cdn.jisuapp.cn\/zhichi_frontend\/static\/webapp\/images\/default.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5"},"animations":[],"compId":"data.content[3]","parentCompid":"free_vessel4"}],"customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":5,"boxStyle":false,"boxX":0,"boxY":0},"animations":[],"page_form":"","compId":"free_vessel4"},"title_ele5":{"type":"title-ele","style":"opacity:1;line-height:2.34375rpx;background-color:rgb(229, 229, 229);border-color:rgb(34, 34, 34);border-style:none;color:#666;font-size:32.8125rpx;margin-left:auto;margin-right:auto;","content":"  ","customFeature":{"mode":"0","markColor":"rgb(26, 147, 223)","boxColor":"#000","boxR":"5px","boxStyle":false,"boxX":"0","boxY":"0"},"animations":[],"page_form":"","compId":"title_ele5","parentCompid":"title_ele5","markColor":"rgb(26, 147, 223)","mode":0},"picture6":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:1171.875rpx;width:937.5rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_599655dfcd533.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","action":"goods-trade","inner-page-link":"prePage","goods-id":"1221014","goods-name":"圆领纯棉T恤","goods-type":"0"},"animations":[],"page_form":"","compId":"picture6","parentCompid":"picture6","itemType":"picture","itemParentType":null,"itemIndex":"picture6","eventParams":"{\"goods_id\":\"1221014\",\"goods_type\":\"0\"}","eventHandler":"tapGoodsTradeHandler"},"picture7":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:1171.875rpx;width:937.5rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_599655e1512f7.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","action":"goods-trade","inner-page-link":"prePage","goods-id":"1221014","goods-name":"圆领纯棉T恤","goods-type":"0"},"animations":[],"page_form":"","compId":"picture7","parentCompid":"picture7","itemType":"picture","itemParentType":null,"itemIndex":"picture7","eventParams":"{\"goods_id\":\"1221014\",\"goods_type\":\"0\"}","eventHandler":"tapGoodsTradeHandler"},"picture8":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:1171.875rpx;width:937.5rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_599655e0492eb.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","action":"goods-trade","inner-page-link":"prePage","goods-id":"1221009","goods-name":"纯色POLO衫","goods-type":"0"},"animations":[],"page_form":"","compId":"picture8","parentCompid":"picture8","itemType":"picture","itemParentType":null,"itemIndex":"picture8","eventParams":"{\"goods_id\":\"1221009\",\"goods_type\":\"0\"}","eventHandler":"tapGoodsTradeHandler"},"picture9":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:1171.875rpx;width:937.5rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_599655e0b44f7.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","action":"call","goods-id":"1221005","goods-name":"跳色POLO衫","goods-type":"0"},"animations":[],"page_form":"","compId":"picture9","parentCompid":"picture9","itemType":"picture","itemParentType":null,"itemIndex":"picture9"},"picture10":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:1171.875rpx;width:937.5rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_599655e00e4ec.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","action":"goods-trade","goods-id":"1242572","goods-name":"圆领卫衣","goods-type":"0"},"animations":[],"page_form":"","compId":"picture10","parentCompid":"picture10","itemType":"picture","itemParentType":null,"itemIndex":"picture10","eventParams":"{\"goods_id\":\"1242572\",\"goods_type\":\"0\"}","eventHandler":"tapGoodsTradeHandler"},"picture11":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:1171.875rpx;width:937.5rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_599655e144edb.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","action":"goods-trade","goods-id":"1243580","goods-name":"拉链卫衣","goods-type":"0"},"animations":[],"page_form":"","compId":"picture11","parentCompid":"picture11","itemType":"picture","itemParentType":null,"itemIndex":"picture11","eventParams":"{\"goods_id\":\"1243580\",\"goods_type\":\"0\"}","eventHandler":"tapGoodsTradeHandler"},"goods_list12":{"type":"goods-list","style":"background-color:rgb(243, 243, 243);opacity:1;color:rgb(102, 102, 102);font-size:28.125rpx;height:auto;margin-left:auto;","content":"","customFeature":{"lineBackgroundColor":"rgb(255, 255, 255)","lineBackgroundImage":"","margin":0,"lineHeight":212,"imgWidth":"150","imgHeight":"148","vesselAutoheight":1,"height":"300px","form":"goods","mode":1,"name":"商品列表","ifUseContact":true,"isIntegral":false,"isHideSales":false,"isHideStock":false,"isShoppingCart":false,"isBuyNow":false,"id":"list-534707914805"},"animations":[],"page_form":"","compId":"goods_list12","parentCompid":"goods_list12","list_style":"background-color:rgb(255, 255, 255);height:496.875rpx;margin-left:auto;","img_style":"width:351.5625rpx;height:346.875rpx;margin-left:auto;","title_width":{"width":"375rpx"},"param":"{\"id\":\"list-534707914805\",\"form\":\"goods\",\"goods_type\":0,\"page\":1,\"app_id\":\"5m6U5WNLzm\",\"is_count\":0,\"is_integral\":0}"},"suspension13":{"type":"suspension","style":"opacity:1;color:#fff;font-size:46.875rpx;margin-left:auto;","content":[{"customFeature":{"action":"","width":"20px","height":"20px"},"pic":"http:\/\/cdn.jisuapp.cn\/zhichi_frontend\/static\/webapp\/images\/default.png","title":"标题","content":"","parentCompid":"suspension13","style":""}],"customFeature":{"margin":1,"lineBackgroundColor":"rgba(0,0,0,0.5)","appendComponent":{"service":true,"myOrder":false,"shoppingCart":false,"top":false}},"animations":[],"page_form":"","compId":"suspension13","list_style":"margin-bottom:2.34375rpx;background-color:rgba(0,0,0,0.5);margin-left:auto;","suspension_bottom":70},"map14":{"type":"map","style":"color:rgb(102, 102, 102);font-size:32.8125rpx;height:46.875rpx;margin-left:auto;margin-right:0;margin-top:0;text-align:left;width:750rpx;","content":"显示地址","customFeature":{"address":"","type":"withoutmap","map_height":20,"map_width":320,"markers":[{"latitude":null,"longitude":null,"name":"","desc":null}],"markers_json_str":"[{\"latitude\":null,\"longitude\":null,\"name\":\"\",\"desc\":null}]"},"animations":[],"page_form":"","compId":"map14","parentCompid":"map14"},"map15":{"type":"map","style":"color:rgb(102, 102, 102);font-size:32.8125rpx;height:46.875rpx;margin-left:auto;margin-right:0;margin-top:0;text-align:left;width:750rpx;","content":"显示地址","customFeature":{"address":"万地广场","type":"withoutmap","lng":119.92346,"lat":28.46107,"map_height":20,"map_width":320,"markers":[{"latitude":28.46107,"longitude":119.92346,"name":"万地广场","desc":null}],"markers_json_str":"[{\"latitude\":28.46107,\"longitude\":119.92346,\"name\":\"\\u4e07\\u5730\\u5e7f\\u573a\",\"desc\":null}]"},"animations":[],"page_form":"","compId":"map15","parentCompid":"map15"},"has_tabbar":1,"page_hidden":true,"page_form":""},
    need_login: false,
    page_router: 'page10000',
    page_form: 'none',
      list_compids_params: [],
      goods_compids_params: [{"compid":"goods_list12","param":{"id":"list-534707914805","form":"goods","goods_type":0,"page":1,"app_id":"5m6U5WNLzm","is_count":0,"is_integral":0}}],
  prevPage:0,
      carouselGroupidsParams: [{"compid":"carousel2","carouselgroupId":"147909"}],
      relobj_auto: [],
      bbsCompIds: [],
      dynamicVesselComps: [],
      communityComps: [],
      franchiseeComps: [],
      cityLocationComps: [],
      seckillOnLoadCompidParam: [],
      requesting: false,
  requestNum: 1,
  onLoad: function (e) {
    app.onPageLoad(e);
  },
  dataInitial: function () {
    app.pageDataInitial();
  },
  onShareAppMessage: function (e) {
    return app.onPageShareAppMessage(e);
  },
  onShow: function () {
    app.onPageShow();
  },
  onReachBottom: function () {
    app.onPageReachBottom();
  },
  onUnload: function () {
    app.onPageUnload();
  },
  tapPrevewPictureHandler: function (e) {
    app.tapPrevewPictureHandler(e);
  },
  suspensionBottom: function () {
    app.suspensionBottom();
  },
  pageScrollFunc: function (e) {
    app.pageScrollFunc(e);
  },
  goodsScrollFunc: function (e) {
    app.goodsScrollFunc(e);
  },
  franchiseeScrollFunc: function (e) {
    app.franchiseeScrollFunc(e);
  },
  seckillScrollFunc: function (e) {
    app.seckillScrollFunc(e);
  },
  changeCount: function (e) {
    app.changeCount(e);
  },
  inputChange: function (e) {
    app.inputChange(e);
  },
  bindDateChange: function (e) {
    app.bindDateChange(e);
  },
  bindTimeChange: function (e) {
    app.bindTimeChange(e);
  },
  bindSelectChange: function (e) {
    app.bindSelectChange(e);
  },
  bindScoreChange: function (e) {
    app.bindScoreChange(e);
  },
  submitForm: function (e) {
    app.submitForm(e);
  },
  udpateVideoSrc: function (e) {
    app.udpateVideoSrc(e);
  },
  tapMapDetail: function (e) {
    app.tapMapDetail(e);
  },
  uploadFormImg: function (e) {
    app.uploadFormImg(e);
  },
  deleteUploadImg: function (e) {
    app.deleteUploadImg(e);
  },
  listVesselTurnToPage: function (e) {
    app.listVesselTurnToPage(e);
  },
  userCenterTurnToPage: function (e) {
    app.userCenterTurnToPage(e);
  },
  turnToGoodsDetail: function (e) {
    app.turnToGoodsDetail(e);
  },
  turnToFranchiseeDetail: function (e) {
    app.turnToFranchiseeDetail(e);
  },
  turnToSeckillDetail: function (e) {
    app.turnToSeckillDetail(e);
  },
  sortListFunc: function (e) {
    app.sortListFunc(e);
  },
  bbsInputComment: function (e) {
    app.bbsInputComment(e);
  },
  bbsInputReply: function (e) {
    app.bbsInputReply(e);
  },
  uploadBbsCommentImage: function (e) {
    app.uploadBbsCommentImage(e);
  },
  uploadBbsReplyImage: function (e) {
    app.uploadBbsReplyImage(e);
  },
  deleteCommentImage: function (e) {
    app.deleteCommentImage(e);
  },
  deleteReplyImage: function (e) {
    app.deleteReplyImage(e);
  },
  bbsPublishComment: function (e) {
    app.bbsPublishComment(e);
  },
  clickBbsReplyBtn: function (e) {
    app.clickBbsReplyBtn(e);
  },
  bbsPublishReply: function (e) {
    app.bbsPublishReply(e);
  },
  searchList: function (e) {
    app.searchList(e);
  },
  selectLocal: function (e) {
    app.selectLocal(e);
  },
  cancelCity: function (e) {
    app.cancelCity(e);
  },
  bindCityChange: function (e) {
    app.bindCityChange(e);
  },
  submitCity: function (e) {
    app.submitCity(e);
  },
  openTakeoutLocation: function (e) {
    app.openTakeoutLocation(e);
  },
  callTakeout: function (e) {
    app.callTakeout(e);
  },
  getMoreAssess: function (e) {
    app.getMoreAssess(e);
  },
  changeEvaluate: function (e) {
    app.changeEvaluate(e)
  },
  deleteAllCarts: function (e) {
    app.deleteAllCarts(e);
  },
  clickWaimaiCategory: function (e) {
    app.clickWaimaiCategory(e);
  },
  clickWaimaiMinus: function (e) {
    app.clickWaimaiMinus(e);
  },
  clickWaimaiPlus: function (e) {
    app.clickWaimaiPlus(e);
  },
  clickTakeoutMinus: function (e) {
    app.clickTakeoutMinus(e);
  },
  clickTakeoutPlus: function (e) {
    app.clickTakeoutPlus(e);
  },
  changeAssessType: function (e) {
    app.changeAssessType(e);
  },
  showShoppingCartPop: function (e) {
    app.showShoppingCartPop(e);
  },
  hideTakeoutShoppingCart: function (e) {
    app.hideTakeoutShoppingCart(e);
  },
  showTakeoutDetail: function (e) {
    app.showTakeoutDetail(e);
  },
  hideTakeoutDetailPop: function (e) {
    app.hideTakeoutDetailPop(e);
  },
  hideTakeoutModelPop: function (e) {
    app.hideTakeoutModelPop(e);
  },
  chooseTakeoutModel: function (e) {
    app.chooseTakeoutModel(e);
  },
  sureChooseModel: function (e) {
    app.sureChooseModel(e);
  },
  clickWaimaiChooseComplete: function (e) {
    app.clickWaimaiChooseComplete(e);
  },
  tapGoodsTradeHandler: function (e) {
    app.tapGoodsTradeHandler(e);
  },
  tapInnerLinkHandler: function (e) {
    app.tapInnerLinkHandler(e);
  },
  tapPhoneCallHandler: function (e) {
    app.tapPhoneCallHandler(e);
  },
  tapRefreshListHandler: function (e) {
    app.tapRefreshListHandler(e);
  },
  tapGetCouponHandler: function (e) {
    app.tapGetCouponHandler(e);
  },
  tapCommunityHandler: function (e) {
    app.tapCommunityHandler(e);
  },
  turnToCommunityPage: function (e) {
    app.turnToCommunityPage(e);
  },
  tapToFranchiseeHandler: function (e) {
    app.tapToFranchiseeHandler(e);
  },
  tapToTransferPageHandler: function () {
    app.tapToTransferPageHandler();
  },
  tapToSeckillHandler: function (e) {
    app.tapToSeckillHandler(e);
  },
  tapToCouponReceiveListHandler: function () {
    app.tapToCouponReceiveListHandler();
  },
  tapToRechargeHandler: function () {
    app.tapToRechargeHandler();
  },
  tapToXcx: function (e) {
    app.tapToXcx(e);
  },
  tapFranchiseeLocation: function (e) {
    app.tapFranchiseeLocation(e);
  },
  showAddShoppingcart: function (e) {
    app.showAddShoppingcart(e);
  },
  hideAddShoppingcart: function () {
    app.hideAddShoppingcart();
  },
  selectGoodsSubModel: function (e) {
    app.selectGoodsSubModel(e);
  },
  resetSelectCountPrice: function () {
    app.resetSelectCountPrice();
  },
  // 电商
  clickGoodsMinusButton: function (e) {
    app.clickGoodsMinusButton();
  },
  clickGoodsPlusButton: function (e) {
    app.clickGoodsPlusButton();
  },
  sureAddToShoppingCart: function () {
    app.sureAddToShoppingCart();
  },
  sureAddToBuyNow: function () {
    app.sureAddToBuyNow();
  },
  clickTostoreMinusButton: function (e) {
    app.clickTostoreMinusButton(e);
  },
  clickTostorePlusButton: function (e) {
    app.clickTostorePlusButton(e);
  },
  readyToPay: function () {
    app.readyToTostorePay();
  },
  getValidateTostore: function () {
    app.getValidateTostore();
  },
  goToShoppingCart: function () {
    app.goToShoppingCart();
  },
  getCartList: function () {
    app.getTostoreCartList();
  },
  stopPropagation: function () {
  },
  turnToSearchPage:function (e) {
    app.turnToSearchPage(e);
  },
  previewImage: function (e) {
    var dataset = e.currentTarget.dataset;
    app.previewImage({
      current : dataset.src,
      urls: dataset.previewImgarr,
    });
  },
  scrollPageTop: function () {
    app.pageScrollTo(0);
  },
  suspensionTurnToPage: function (e) {
    app.suspensionTurnToPage(e);
  },
  tapToLuckyWheel: function (e) {
    app.tapToLuckyWheel(e);
  },
  keywordList:{},
  bindSearchTextChange: function (e) {
    this.keywordList[e.currentTarget.dataset.compid] = e.detail.value;
  },
};
Page(pageData);
