// pages/content-type/content-type.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleTypes:[]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.server + "article/getArticleTypes",
      method: 'GET',
      success: function(res) {
        that.setData({
          articleTypes:res.data
        })
      }
    })
  },
  over: function () {
    wx.navigateTo({
      url: '../animation/animation'
    })
  },
  next: function () {
    var that = this;
    var articleTypes = [];
    for (var i = 0; i < that.data.articleTypes.length ; i++){
      if (that.data.articleTypes[i].enChoose){
        articleTypes.push(that.data.articleTypes[i]);
      }
    }
    if(articleTypes.length >0){
      wx.request({
        url: getApp().globalData.server + "article/addCustomerArticleTypes",
        data: JSON.stringify(articleTypes),
        header: getApp().globalData.header,
        method: 'POST',
        success: function (res) {
          wx.navigateTo({
            url: '../animation/animation'
          })
        }
      })
    }
  },
  chooseType: function(event) {
      var index = event.target.dataset.index;
      if (index != null){
        this.data.articleTypes[index].enChoose = !this.data.articleTypes[index].enChoose;
        this.setData({
          articleTypes: this.data.articleTypes
        })
      }
  }
})