var app      = getApp();

var pageData = {
  data: {"picture1":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-style:none;height:506.25rpx;width:750rpx;margin-left:auto;margin-right:auto;","content":"http:\/\/img.weiye.me\/zcimgdir\/album\/file_59913d9845061.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5"},"animations":[],"page_form":"","compId":"picture1","parentCompid":"picture1"},"form_vessel2":{"type":"form-vessel","style":"background-color:rgba(0, 0, 0, 0);margin-top:114.84375rpx;opacity:1;margin-left:auto;","content":[{"type":"input-ele","style":"margin-top:-112.5rpx;margin-left:auto;width:750rpx;height:82.03125rpx;margin-right:auto;opacity:1;","content":"","customFeature":{"placeholder":"姓名"},"animations":[],"compId":"data.content[0]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"input-ele","style":"margin-top:-2.34375rpx;margin-left:auto;width:750rpx;height:79.6875rpx;margin-right:auto;opacity:1;","content":"","customFeature":{"placeholder":"手机"},"animations":[],"compId":"data.content[1]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"input-ele","style":"margin-top:-2.34375rpx;margin-left:auto;width:750rpx;height:82.03125rpx;margin-right:auto;opacity:1;","content":"","customFeature":{"placeholder":"性别"},"animations":[],"compId":"data.content[2]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"input-ele","style":"margin-top:-2.34375rpx;margin-left:auto;width:750rpx;height:82.03125rpx;margin-right:auto;opacity:1;","content":"","customFeature":{"placeholder":"地址"},"animations":[],"compId":"data.content[3]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"input-ele","style":"margin-top:-2.34375rpx;margin-left:auto;width:750rpx;height:82.03125rpx;margin-right:auto;opacity:1;","content":"","customFeature":{"placeholder":"定制类型"},"animations":[],"compId":"data.content[4]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"select-ele","style":"background-color:rgba(0,0,0,0);margin-top:0;line-height:82.03125rpx;opacity:1;margin-left:auto;margin-right:auto;width:750rpx;color:rgb(0,0,0);font-size:32.8125rpx;","content":{"lists":["S","M","L","XL","XXL","XXXL","定做码"],"title":"所订尺码","formCompid":"form_vessel2"},"customFeature":{"lineBackgroundColor":"rgba(0,0,0)","lineBackgroundImage":"","secColor":"#ffffff","secFontSize":"13px","secLineHeight":"35px","selectAmount":1,"secFontWeight":"","secFontStyle":"","secTextDecoration":""},"animations":[],"compId":"data.content[5]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2","titleStyle":"color:#ffffff;font-size:30.46875rpx;background-color:rgba(0,0,0);line-height:82.03125rpx;margin-left:auto;"},{"type":"upload-img","style":"margin-top:35.15625rpx;margin-bottom:35.15625rpx;text-align:center;padding:35.15625rpx 0;border-top:2.34375rpx solid #c6c6c6;border-bottom:2.34375rpx solid #c6c6c6;margin-left:auto;","content":"","customFeature":[],"animations":[],"compId":"data.content[6]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"textarea-ele","style":"margin-top:-37.5rpx;opacity:1;border-radius:0;width:750rpx;height:234.375rpx;margin-left:auto;line-height:70.3125rpx;margin-right:auto;","content":"","customFeature":{"placeholder":"备注"},"animations":[],"compId":"data.content[7]","formCompid":"form_vessel2","segment_required":0,"parentCompid":"form_vessel2"},{"type":"form-button","style":"background-color:#34b6fd;border-color:rgb(34, 34, 34);border-style:none;color:rgb(255, 255, 255);font-size:32.8125rpx;height:82.03125rpx;line-height:82.03125rpx;margin-left:auto;margin-right:auto;opacity:1;text-align:center;width:750rpx;","content":"提交按钮","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5px","boxStyle":false,"boxX":"0","boxY":"0","segment":"submit-btn"},"animations":[],"compId":"data.content[8]","parentCompid":"form_vessel2"}],"customFeature":{"form":""},"animations":[],"page_form":"","compId":"form_vessel2","form":"","field_info":[],"formCompid":"form_vessel2"},"has_tabbar":0,"page_hidden":true,"page_form":""},
    need_login: false,
    page_router: 'page10007',
    page_form: 'none',
      list_compids_params: [],
      goods_compids_params: [],
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
