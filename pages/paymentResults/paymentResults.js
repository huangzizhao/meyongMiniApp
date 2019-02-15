// pages/paymentResults/paymentResults.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		paymentResultsContent:'',
		status:0,
		tips:{
			0:'支付失败',
			1:'支付成功'
		},
		iconState:{
			0:'warn',
			1:'success'
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			paymentResultsContent: options.paymentResultsContent,
			status: options.status
		})
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
		// wx.navigateBack({
		// 	delta: 2
		// })
		wx.redirectTo({
			url: '../../pages/ordersList/ordersList'
		})
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})