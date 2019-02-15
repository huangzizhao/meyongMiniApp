// pages/promotion/promotion.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	beforeSaveImg: function () {
		var that = this;
		wx.showLoading({
			title: '加载中...',
		});
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: (e) => {
							wx.hideLoading();
							that.saveImg();
						},
						fail: (e) => {
							wx.showModal({
								title: '提示',
								content: '无权限保存，点击确定去设置',
								success: (e) => {
									wx.hideLoading();
									if (e.confirm) {
										wx.openSetting({
											success(res) {
												console.log(res.authSetting)
											}
										})
									}
								}
							})
						}
					})
				} else {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: (e) => {
							wx.hideLoading();
							that.saveImg();
						},
						fail: (e) => {
							console.log(e);
						}
					})
				}
			},
			fail: (res) => {
				console.log(res);
				wx.hideLoading();
			}
		})
	},
	saveImg(){
		var that = this;
		// wx.downloadFile({
		// 	url: 'http://wap.mymia.top/luckyMoney/img/luckyMoney.jpg',
		// 	success: (e) => {
		// 		if (e.statusCode === 200) {
		// 			that.setData({
		// 				imgPath: e.tempFilePath
		// 			},()=>{
						wx.saveImageToPhotosAlbum({
							filePath: 'img/promotion.png',
							success(e) {
								wx.showToast({
									title: '成功保存到相册',
									icon: 'success',
									duration: 2000
								})
							},
							fail: (e) => {
								console.log(e);
								wx.showToast({
									title: '已取消保存',
									icon: 'error',
									duration: 2000
								})
							}
						})
		// 			});
		// 		}
		// 	},
		// 	fail: (res) => {
		// 		console.log(res);
		// 	}
		// });
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})