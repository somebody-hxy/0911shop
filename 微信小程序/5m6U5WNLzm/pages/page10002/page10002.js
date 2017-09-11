var app      = getApp();

var pageData = {
  data: {"search1":{"type":"search","style":"margin-top:0;height:117.1875rpx;width:750rpx;background-color:#efeff4;margin-left:auto;","content":{"placeholder":"请输入搜索内容"},"customFeature":{"hasQuickTags":false,"ifLocation":false,"quickTags":[],"searchObject":{"subPageResponse":"inner-link","subFuntionResponse":"call","style":{"background-color":"rgb(243, 243, 243)","background-image":"","margin-top":"0px","opacity":1,"color":"rgb(102, 102, 102)","font-size":"14px"},"content":"","customFeature":{"lineBackgroundColor":"rgb(255, 255, 255)","lineBackgroundImage":"","margin":0,"lineHeight":212,"imgWidth":"140","imgHeight":"140","vesselAutoheight":1,"height":"300px","form":"goods","mode":1,"name":"商品列表","ifUseContact":true,"isIntegral":false,"isHideSales":false,"isHideStock":false,"isShoppingCart":false,"isBuyNow":false,"id":"list-129444293655","source":"104796"},"animations":[],"type":"goods-list","name":"商品列表","id":"zhichi_4675657901"}},"animations":[],"page_form":"","compId":"search1","parentCompid":"search1"},"classify2":{"type":"classify","style":"font-size:30.46875rpx;height:82.03125rpx;line-height:82.03125rpx;opacity:1;background-color:rgb(255, 255, 255);color:rgb(136, 136, 136);margin-top:11.71875rpx;margin-left:auto;","content":[{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10002"},"text":"圆领T恤","content":"","parentCompid":"classify2","style":"","itemType":null,"itemParentType":"classify","itemIndex":0,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10002\\\/page10002\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10003"},"text":"翻领Polo","content":"","parentCompid":"classify2","style":"","itemType":null,"itemParentType":"classify","itemIndex":1,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10003\\\/page10003\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10004"},"text":"卫衣长袖","content":"","parentCompid":"classify2","style":"","itemType":null,"itemParentType":"classify","itemIndex":2,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10004\\\/page10004\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10005"},"text":"风衣外套","content":"","parentCompid":"classify2","style":"","itemType":null,"itemParentType":"classify","itemIndex":3,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10005\\\/page10005\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"index_value":"","action":"inner-link","page-link":"page10006"},"text":"儿童专区","content":"","parentCompid":"classify2","style":"","itemType":null,"itemParentType":"classify","itemIndex":4,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10006\\\/page10006\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"},{"customFeature":{"action":"inner-link","page-link":"page10007"},"text":"其它定制","content":"","parentCompid":"classify2","style":"","itemType":null,"itemParentType":"classify","itemIndex":5,"eventParams":"{\"inner_page_link\":\"\\\/pages\\\/page10007\\\/page10007\",\"is_redirect\":1}","eventHandler":"tapInnerLinkHandler"}],"customFeature":{"mode":"1","selected":"0","selectedColor":"rgb(136, 136, 136)"},"animations":[],"page_form":"","compId":"classify2"},"goods_list3":{"type":"goods-list","style":"background-color:rgb(243, 243, 243);opacity:1;color:rgb(102, 102, 102);font-size:32.8125rpx;height:auto;margin-left:auto;","content":"","customFeature":{"lineBackgroundColor":"rgb(255, 255, 255)","lineBackgroundImage":"","margin":0,"lineHeight":212,"imgWidth":"140","imgHeight":"140","vesselAutoheight":1,"height":"300px","form":"goods","mode":1,"name":"商品列表","ifUseContact":true,"isIntegral":false,"isHideSales":false,"isHideStock":false,"isShoppingCart":false,"isBuyNow":false,"id":"list-129444293655","source":"104796"},"animations":[],"page_form":"","compId":"goods_list3","parentCompid":"goods_list3","list_style":"background-color:rgb(255, 255, 255);height:496.875rpx;margin-left:auto;","img_style":"width:328.125rpx;height:328.125rpx;margin-left:auto;","title_width":{"width":"398.4375rpx"},"param":"{\"id\":\"list-129444293655\",\"form\":\"goods\",\"goods_type\":0,\"page\":1,\"app_id\":\"5m6U5WNLzm\",\"is_count\":0,\"is_integral\":0,\"idx_arr\":{\"idx\":\"category\",\"idx_value\":\"104796\"}}"},"has_tabbar":1,"page_hidden":true,"page_form":""},
    need_login: false,
    page_router: 'page10002',
    page_form: 'none',
      list_compids_params: [],
      goods_compids_params: [{"compid":"goods_list3","param":{"id":"list-129444293655","form":"goods","goods_type":0,"page":1,"app_id":"5m6U5WNLzm","is_count":0,"is_integral":0,"idx_arr":{"idx":"category","idx_value":"104796"}}}],
  prevPage:0,
      carouselGroupidsParams: [],
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
