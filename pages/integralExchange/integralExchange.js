// mineModule/pages/integralExchange/integralExchange.js
import {
    getListIntegralPrize,
    getCurrentIntegral,
    exchange,
    getAuthorGrade,
    postProductDataBuried
} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navbarData: {
            showCapsule: false,
            title: '兑换商品列表'
        },
        navbarHeight: getApp().globalData.navbarHeight,
        customer: null,
        grade: 0,
        integral: 0,
        integralBgUrl: getApp().globalData.serverImg + 'upload/integralBg.jpg',
        goodsList: [],
        pageUtil: {
            page: 1,
            limit: 5,
            order: '',
            sidx: ''
        },
        totalPage: 2,
        loading: false,
        showCustomizeModal: false,
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
        this.loadMore();
        var getCustomer = setInterval(() => {
            var customer = getApp().globalData.customer
            if (getApp().globalData.sessionId != null && customer != null) {
                this.setData({
                    customer: customer
                });
                clearInterval(getCustomer);
            }
        }, 100);
    },
	toExchangeGoodDetail(e){
		let content = e.currentTarget.dataset.content,name = e.currentTarget.dataset.name;
		if(content){
			content = content.replace(/section/g, "div");
			content = content.replace(/header/g, "div");
			content = content.replace(/&amp;/g, "&");
			content = content.replace(/&lt;/g, "<");
			content = content.replace(/&gt;/g, ">");
			content = content.replace(/&#39;/g, "\'");
			content = content.replace(/&quot;/g, "\"");
			content = content.replace(/&amp;nbsp;/g, ' ');
			content = content.replace(/&nbsp;/g, ' ');
			wx.navigateTo({
				url: '/mineModule/pages/exchangeGoodDetail/exchangeGoodDetail?content=' + content + '&name=' + name
			})
		}
	},
    toRatingRule() {
        wx.navigateTo({
            url: '/mineModule/pages/ratingRule/ratingRule'
        })
    },
    toContact() {
        postProductDataBuried({
            page: '客服'
        }).then();
    },
    preventTouchMove() {},
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
    customizeModalShow() {
        this.setData({
            showCustomizeModal: false
        });
    },
    toContact(e) {
        this.setData({
            showCustomizeModal: false
        }, () => {
            postProductDataBuried({
                duringTime: 0,
                page: '客服'
            }).then();
        });
    },
    integralExchange(e) {
        var integralExchangeId = e.currentTarget.dataset.integralexchangeid,
            index = e.currentTarget.dataset.index,
            formId = e.detail.formId;
        console.log('formId:' + formId);
        this.setData({
            [`goodsList[${index}].showExchangeBtnLoaing`]: true
        }, () => {
            exchange({
                integralExchangeId: integralExchangeId,
                formId: formId
            }).then(res => {
                if (res.code === 0) {
                    this.getCurrentIntegral();
                    this.setData({
                        [`goodsList[${index}].showExchangeBtnLoaing`]: false,
                        showCustomizeModal: true
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false,
                        success: (res) => {
                            if (res.confirm) {
                                this.setData({
                                    [`goodsList[${index}].showExchangeBtnLoaing`]: false
                                });
                            }
                        }
                    })
                }
            });
        });
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
            getListIntegralPrize(this.data.pageUtil).then(res => {
                if (res.code === 0) {
                    res.data.list.showExchangeBtnLoaing = false;
                    this.data.goodsList.push(...res.data.list);
                    this.data.totalPage = res.data.totalPage;
                    this.data.pageUtil.page++;
                    this.unLocked();
                    this.setData({
                        goodsList: this.data.goodsList,
                        totalPage: res.data.totalPage
                    }, () => {
                        for (let i = 0; i < this.data.goodsList.length; i++) {
                            this.createIntersectionObserver().relativeToViewport({
                                bottom: 0
                            }).observe(`.goods${i}`, (res) => {
                                if (res.intersectionRatio > 0 && (i % 5) === 0) {
                                    this.loadMore();
                                }
                            });
                        }
                    });
                }
            }, () => {
                this.unLocked();
            });
        }
    },

    toHasExchange() {
        wx.navigateTo({
            url: '/mineModule/pages/hasExchangeList/hasExchangeList',
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
    onShow() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
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