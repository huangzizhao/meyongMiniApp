// mineModule/pages/commentCollection/commentCollection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more: '',
    customer: {},
    newReviews: '',
    articleId: '',
    replyObj: {},
    showPostComment: false,
	  navbarData: {
		  showCapsule: true,
		  title: '我的评论'
	  },
	  navbarHeight: getApp().globalData.navbarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   articleId: options.articleId
    // });
	this.setData({
		more:new Date().getTime()
	});
    let getCustomer = setInterval(() => {
      let customer = getApp().globalData.customer
      if (getApp().globalData.sessionId != null && customer != null) {
        this.setData({
          customer: customer
        });
        clearInterval(getCustomer);
      }
    }, 100);
  },
  pageTouchmove(e) {
    if (this.data.showPostComment) {
      this.setData({
        showPostComment: false,
      });
    }
  },

  setReplyData(e) {
    if (this.data.showPostComment) {
      this.setData({
        replyObj: e.detail
      });
    } else {
      this.setData({
        showPostComment: true,
        replyObj: e.detail
      });
    }
  },

  refreshReviews(e) {
    this.setData({
      newReviews: e.detail.newReviews
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      more: new Date().getTime()
    });
  }
})