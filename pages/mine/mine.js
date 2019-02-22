// pages/person-center/person-center.js
import {
    hasUnReadNotice,
    getCountUnReadReview,
	readReview
} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        customer: null,
        amount: 0,
        hasUnreadMessage: false,

        switchTab: '',
        more: '',
        countUnReadReview: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var getCustomer = setInterval(() => {
            var customer = getApp().globalData.customer
            if (getApp().globalData.sessionId != null && customer != null) {
                this.setData({
                    customer: customer
                });
                clearInterval(getCustomer);
            }
        }, 100);
        var getArticle = setInterval(() => {
            var sessionId = getApp().globalData.sessionId
            if (sessionId != '') {
                this.setData({
                    switchTab: 'notes'
                });
                clearInterval(getArticle);
            }
        }, 10);
        this.getUnreadMessage();

        //获取收到的未读评论
        getCountUnReadReview().then(res => {
            if (res.code === 0) {
                this.setData({
					countUnReadReview: res.count
                });
            }
        });
    },
	toCommentCollection(e){
		let countUnReadReview = e.currentTarget.dataset.countunreadreview;
		countUnReadReview > 0 ? readReview().then() : ''
		wx.navigateTo({
			url: '/mineModule/pages/commentCollection/commentCollection?countUnReadReview=' + countUnReadReview
		})
	},

    getUnreadMessage: function() {
        hasUnReadNotice().then(e => {
            if (e.code === 0) {
                this.setData({
                    hasUnreadMessage: e.unRead
                });
            }
        });
    },
    toFunlistItem(e) {
        let tabName = e.currentTarget.dataset.tabname;
        switch (tabName) {
            case 'order':
                wx.navigateTo({
                    url: '/mineModule/pages/ordersList/ordersList',
                })
                break;
            case 'coupon':
                wx.navigateTo({
                    url: '/mineModule/pages/coupon/coupon',
                })
                break;
            case 'bookingFee':
                wx.navigateTo({
                    url: '/mineModule/pages/subscription/subscription',
                })
                break;
            case 'notices':
                wx.navigateTo({
                    url: '/mineModule/pages/systemNotification/systemNotification',
                })
                break;
            default:
                break;
        }
    },
    switchTabChange(e) {
        let tab = e.currentTarget.dataset.tab;
        this.setData({
            switchTab: tab
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
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
        this.getUnreadMessage();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        //用时间戳产生不重复的随机数
        this.setData({
            more: new Date().getTime()
        })
    }
})