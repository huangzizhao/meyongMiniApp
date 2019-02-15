// pages/article-list/article-list.js
import {
    getWaterFallFlow
} from '../../config/getData'
const device = wx.getSystemInfoSync()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        articles: [],
        pageUtil: {
            page: 1,
            limit: 10,
            order: '',
            sidx: ''
        },
        totalPage: -1,
        enBottom: false,
        canGetMore: true,
        showSpinner: false
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onLoad: function() {
        wx.startPullDownRefresh();
    },
    updateData: function(e) {
        console.log('通知到了');
    },
    loadData: function() {
        // var getArticle = setInterval(() => {
        //   var sessionId = getApp().globalData.sessionId
        //   if (sessionId != '') {
        getWaterFallFlow(JSON.stringify(this.data.pageUtil)).then(e => {
            if (e.code === 0) {
                this.setData({
                    showSpinner: false
                }, () => {
                    this.data.canGetMore = true
                    let view = this.selectComponent('#waterFallFlow');
                    view.fillData(false, e.res.list);
                    this.data.totalPage = e.res.totalPage;
                });
            }
        });
        //     clearInterval(getArticle);
        //   }
        // }, 10);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.pageUtil.page == this.data.totalPage) {
            this.setData({
                enBottom: true
            })
        } else {
            if (this.data.canGetMore) {
                this.setData({
                    showSpinner: true
                }, () => {
                    var pageUtil = this.data.pageUtil;
                    pageUtil.page++;
                    this.loadData();
                });
            }
        }
        this.data.canGetMore = false;
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.setData({
            pageUtil: {
                page: 1,
                limit: 10,
                order: '',
                sidx: ''
            },
            totalPage: -1,
            enBottom: false
        });

        var getArticle = setInterval(() => {
            var sessionId = getApp().globalData.sessionId
            if (sessionId != '') {
                getWaterFallFlow(JSON.stringify(this.data.pageUtil)).then(e => {
                    if (e.code === 0) {
                        let view = this.selectComponent('#waterFallFlow');
                        view.fillData(true, e.res.list);
                        wx.stopPullDownRefresh();
                        wx.hideNavigationBarLoading();
                    }
                });
                clearInterval(getArticle);
            }
        }, 10);
    },
    openDetail: function(event) {
        var articleId = event.currentTarget.dataset.id;
        if (articleId) {
            wx.navigateTo({
                url: '../article-detail/article-detail?articleId=' + articleId
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '页面正在加载中'
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})