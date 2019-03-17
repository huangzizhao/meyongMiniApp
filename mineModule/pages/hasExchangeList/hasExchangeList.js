// mineModule/pages/hasExchangeList/hasExchangeList.js
import {
  getHasExchange
} from '../../../config/getData'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    pageUtil: {
      page: 1,
      limit: 5,
      order: '',
      sidx: ''
    },
    totalPage: 2,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadMore();
  },
  init() {
    this.data.totalPage = 2;
    this.data.pageUtil.page = 1;
    this.data.goodsList = Array();
  },
  hasMore() {
    if (this.data.pageUtil.page > this.data.totalPage) {
      return false
    } else {
      return true
    }
  },
  isLocked() {
    return this.data.loading ? true : false
  },
  locked() {
    this.setData({
      loading: true
    })
  },
  unLocked() {
    this.setData({
      loading: false
    })
  },
  loadMore() {
    if (this.hasMore()) {
      this.locked();
      getHasExchange(this.data.pageUtil).then(res => {
        if (res.code === 0) {
          this.data.goodsList.push(...res.data.list);
          this.data.totalPage = res.data.totalPage;
          this.data.pageUtil.page++;
          this.unLocked();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          this.setData({
            goodsList: this.data.goodsList,
            totalPage: res.data.totalPage
          });
        }
      }, () => {
        this.unLocked();
      });
    }
  },
  onPullDownRefresh() {
    this.init();
    wx.showNavigationBarLoading();
    this.loadMore();
  },

  onReachBottom() {
    this.loadMore();
  }
})