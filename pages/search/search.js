// pages/search/search.js

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		keyword:'',
		showResult:false,
		more:'',
		navbarData: {
			showCapsule: true,
			title: '搜索'
		},
		navbarHeight: getApp().globalData.navbarHeight,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	recordeKeyword(e){
		this.data.keyword = e.detail.value
	},
	onConfirm(){
		if (this.data.keyword != ''){
      // console.log('上一个关键字：' + this.data.keyword);
      // this.setData({
      //   showResult: true
      // },()=>{
        
      // });
      this.selectComponent('#searchData').searchByKeyword(this.data.keyword);
      // console.log('现在关键字：' + this.data.keyword);
		}else{
			wx.showToast({
				title: '搜索值不能为空',
				icon:'none',
				duration:500
			})
		}
	},
	onDelete(){
		this.setData({
			keyword: ''
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		//用时间戳产生不重复的随机数
    this.selectComponent('#searchData').onReachBottom()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})