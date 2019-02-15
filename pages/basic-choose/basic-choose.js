// pages/basic-choose/basic-choose.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2018-01-01",
    sex: 1
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var date = this.formatTime(new Date());
    this.setData({
      date: date
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  over: function () {
    wx.navigateTo({
      url: '../content-type/content-type'
    })
  },
  next: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.server + "customer/setBasic",
      data: { 
        sex:1,
        birthday: that.data.date
      },
      header: getApp().globalData.header,
      method: 'GET'
    })
    wx.navigateTo({
      url: '../content-type/content-type'
    })
  },
  formatTime: function (date) {
     var year = date.getFullYear()
     var month = date.getMonth() + 1
     var day = date.getDate()
     return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
  },
  chooseSex: function(event) {
    this.setData({
      sex: event.target.dataset.sex
    })
  }
})