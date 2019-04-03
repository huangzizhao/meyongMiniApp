// pages/promotion/promotion.js
import {
    postProductDataBuried
} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fromPage: '',
        url: '', //跳转链接
        enterDomStartTime: 0,
        partTime: 0,
		navbarData: {
			showCapsule: true,
			title: ''
		},
		navbarHeight: getApp().globalData.navbarHeight,
    },
    bindmessage(e) {
        if (e.detail.data[e.detail.data - 1].title) {
            this.setData({ //存储状态
				[`navbarData.title`]: e.detail.data[0].title
            })
        }
    },
    /**
     * 提交埋点数据信息
     */
    postDomDataInfo(nextPageTitle) {
        this.data.partTime += parseInt(new Date().getTime() / 1000) - this.data.enterDomStartTime;
        //浏览时长不大于0的视为垃圾数据
        if (this.data.partTime > 0) {
            let productData = {
                duringTime: this.data.partTime,
                page: '三八女王节活动',
                nextPage: nextPageTitle
            }

            postProductDataBuried(productData).then((e) => {
                setTimeout(() => {
                    this.data.partTime = 0;
                }, 500);
                console.log('记录成功');
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            fromPage: options.pageName,
            url: options.url
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
        // 数据埋点
        this.data.enterDomStartTime = 0;
        this.data.enterDomStartTime = parseInt(new Date().getTime() / 1000);
        console.log('enterDomStartTime：' + this.data.enterDomStartTime);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // 数据埋点
        this.data.partTime += parseInt(new Date().getTime() / 1000) - this.data.enterDomStartTime;
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        this.postDomDataInfo('首页');
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