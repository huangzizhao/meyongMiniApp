// pages/articleComment/articleComment.js
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
        showPostComment: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            articleId: options.articleId,
            newReviews: new Date().getTime()
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.setData({
            more: new Date().getTime()
        });
    }
})