// pages/notificationList/notificationList.js
import {
  getObtainNearestActivityInfo,
  getListQActivities,
  getPurchaseInformation
} from '../../../config/getData.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    activityList: [],
    participateAvatar: '../../img/avatar.png',
    participateUserName: '',
    participateTime: 0,
    announcementList: [],
    queryPurchaseInterval: '', //查询参与活动定时器
    nextIssueNotice: '当前还没有活动呢，下拉刷新试试~',
	  navbarData: {
		  showCapsule: true,
		  title: '来美哈'
	  },
	  navbarHeight: getApp().globalData.statusBarHeight + 45,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.groupId) {
    //   this.setData({
    //     groupId: options.groupId
    //   });
		this.data.groupId = options.groupId;
    }
    getListQActivities().then(e=>{
      if(e.code === 0){
        this.setData({
          activityList: e.data
        });
      } else if (e.code === 500){
        this.setData({
          nextIssueNotice: e.msg
        });
      }
    });
    getObtainNearestActivityInfo().then(e=>{
      if(e.code === 0){
        let announcementList = Array();
        announcementList = e.data
        this.setData({
          announcementList: announcementList
        });
      }
    });
  },
  getNotices: function() {
    this.setData({
      queryPurchaseInterval: setInterval(() => {
        getPurchaseInformation().then(e=>{
          if(e.code === 0){
            if (e.data.avatar === null) {
              this.setData({
                participateUserName: e.data.name,
                participateTime: e.data.offset
              });
            } else {
              this.setData({
                participateUserName: e.data.name,
                participateTime: e.data.offset,
                participateAvatar: e.data.avatar
              });
            }
          }
        });
      }, 18000)
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
    this.onPullDownRefresh();
    this.getNotices();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.queryPurchaseInterval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.queryPurchaseInterval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.getNotificationList();
  },

  getNotificationList: function() {
    getListQActivities().then(e=>{
      if(e.code === 0){
        this.setData({
          activityList: e.data
        });
      } else if (e.code === 500) {
        this.setData({
          nextIssueNotice: e.msg
        });
      }
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    });
  },
  intoGroupPurchase: function(e) {
    let activityId = e.currentTarget.dataset.activityid;
    wx.navigateTo({
		url: '/mallModule/pages/groupPurchaseSet/groupPurchase/groupPurchase?activityId=' + activityId + '&groupId=' + this.data.groupId,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})