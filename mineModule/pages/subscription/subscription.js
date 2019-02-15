// pages/subscription/subscription.js
import { getProjects} from '../../../config/getData'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projects:[],
    isEmpty:false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getProjects();
    this.turnUpRefresh();
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
  turnUpRefresh:function(){
    wx.startPullDownRefresh();
  },
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading();
    this.getProjects();
  },
  getProjects: function () {
	  getProjects().then(e=>{
		  if (e.length <= 0) {
			  this.setData({
				  isEmpty: true
			  })
		  }
		  else {
			  this.setData({
				  projects: e,
				  isEmpty: false
			  });
		  }
		  wx.stopPullDownRefresh();
		  wx.hideNavigationBarLoading();
	  });
  },
  pay:function(e){
    var targetIndex = e.currentTarget.dataset.index;
    if (this.data.projects[targetIndex].orderState == '0'){
      var tempArray = Array();
      tempArray = this.data.projects[targetIndex];
      console.log(tempArray);
      wx.navigateTo({
        url: '../pay/pay?data=' + JSON.stringify(tempArray)
      })
    }
    else{
      wx.showToast({
        icon: 'none',
        title: '当前订单已锁定，不能修改',
        duration: 1000
      })
    }
  }
})