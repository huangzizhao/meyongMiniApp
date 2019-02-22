// mineModule/pages/commentCollection/commentCollection.js
import {
    listMineReply
} from '../../../config/getData.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        countUnReadReview: 0,
        commentList: [],
        noneResult: false,
        loading: false,
        pageUtil: {
            page: 1,
            limit: 10,
            order: '',
            sidx: ''
        },
        totalPage: 2,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.countUnReadReview = options.countUnReadReview;
        this.loadMore();
    },

    loadMore() {
        if (this.isLocked()) {
            return;
        }
        if (this.hasMore()) {
            this.locked();
            listMineReply(JSON.stringify(this.data.pageUtil)).then(res => {
                if (res.code === 0) {
                    //todo
                }
            })
        }
    },

    setTotal(totalPage) {
        this.data.totalPage = totalPage
        if (totalPage == 0) {
            this.setData({
                noneResult: true
            })
        }
    },

    hasMore() {
        if (this.data.pageUtil.page > this.data.totalPage) {
            return false
        } else {
            return true
        }
    },

    initialize() {
        this.setData({
            dataArray: [],
            noneResult: false
        })

        this.data.totalPage = 2
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})