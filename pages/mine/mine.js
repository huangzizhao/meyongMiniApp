// pages/person-center/person-center.js
import {
    hasUnReadNotice,
    getCountUnReadReview,
    readReview,
    getFansAndAttentionCount,
	getAuthorGrade,
	getCurrentIntegral
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
        update: '',
        countUnReadReview: 0,
        attention: 0,
        fans: 0,
        noData: false,
		grade: 0,
		integral: 0,
        gradeImgList: [{
                url: '/img/1.png'
            },
            {
                url: '/img/2.png'
            },
            {
                url: '/img/3.png'
            },
            {
                url: '/img/4.png'
            },
            {
                url: '/img/5.png'
            },
            {
                url: '/img/6.png'
            }
        ],
        gradeNameList: [{
                title: '宝宝蜂'
            }, {
                title: '奶瓶蜂'
            },
            {
                title: '摇摇蜂'
            },
            {
                title: '文化蜂'
            },
            {
                title: '工蜂'
            },
            {
                title: '蜂后'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		this.getCurrentIntegral();
		this.getAuthorGrade();
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
                let data = {
                    idType: 'authorId',
                    id: 'mine',
                    tabType: 'notes'
                }
                this.selectComponent('#mineData').getInfoByType(data)
                clearInterval(getArticle);
            }
        }, 10);

        //获取收到的未读评论

        getCountUnReadReview().then(res => {
            if (res.code === 0) {
                this.setData({
                    countUnReadReview: res.count
                });
            }
        });
        getFansAndAttentionCount().then(res => {
            if (res.code === 0) {
                this.setData({
                    fans: res.fansCount,
                    attention: res.attentionCount
                });
            }
        });
    },
	getAuthorGrade() {
		getAuthorGrade().then(res => {
			if (res.code === 0) {
				this.setData({
					grade: res.data
				});
			}
		});
	},
	getCurrentIntegral() {
		getCurrentIntegral().then(res => {
			if (res.code === 0) {
				this.setData({
					integral: res.data
				});
			}
		});
	},
    getWaterFallFlowData(e) {
        if (e.detail.length === 0) {
            this.setData({
                noData: true
            });
        }
    },
    toCommentCollection(e) {
        let countUnReadReview = e.currentTarget.dataset.countunreadreview;
        if (countUnReadReview > 0) {
            this.setData({
                countUnReadReview: 0
            });
            readReview().then()
        }
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
            // more: '',
            noData: false,
            switchTab: tab
        });
        let data = {
            idType: 'authorId',
            id: 'mine',
            tabType: tab
        }
        this.selectComponent('#mineData').getInfoByType(data)
    },
    toAttention() {
        if (this.data.attention > 0) {
            wx.navigateTo({
                url: '/mineModule/pages/attention/attention?customerId=mine'
            })
        }
    },
    toFollow() {
        if (this.data.fans > 0) {
            wx.navigateTo({
                url: '/mineModule/pages/follower/follower?customerId=mine'
            })
        }
    },
    toRatingRule() {
        wx.navigateTo({
            url: '/mineModule/pages/ratingRule/ratingRule'
        })
    },

	/**暂时去除导航到兑换区的路由 */
    // toIntegralExchange() {
    //     wx.navigateTo({
    //         url: '/mineModule/pages/integralExchange/integralExchange'
    //     })
    // },
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
                selected: 3
            })
        }
        if (getApp().globalData.updateWaterFallFlow) {
            getApp().globalData.updateWaterFallFlow = false;
            this.selectComponent('#mineData').setUpdate()
            // this.setData({
            //   update: new Date().getTime()
            // });
        }
        this.getUnreadMessage();
		this.getCurrentIntegral();
		this.getAuthorGrade();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.selectComponent('#mineData').onReachBottom()
        //用时间戳产生不重复的随机数
        // this.setData({
        //   more: new Date().getTime()
        // })
    }
})