// pages/coupon/coupon.js
import { getLotteryList} from '../../../config/getData'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

	  getLotteryList().then(e=>{
		  if (e.lotteries.length <= 0) {
			  this.setData({
				  isEmpty: true
			  });
		  } else {
			  let lotteries = new Array();
			  for (let i = 0; i < e.lotteries.length; i++) {
				  lotteries.push(getApp().globalData.serverImg + e.lotteries[i].imgsUrl)
			  }
			  this.setData({
				  coupons: lotteries
			  });
		  }
		  wx.hideLoading();
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