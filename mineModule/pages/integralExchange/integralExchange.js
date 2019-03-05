// mineModule/pages/integralExchange/integralExchange.js
import {
    getListIntegralPrize,
    getCurrentIntegral,
	exchange
} from '../../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        customer: null,
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
		showCustomizeModal:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		this.getCurrentIntegral();
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
	preventTouchMove(){},
    getCurrentIntegral() {
        getCurrentIntegral().then(res => {
            if (res.code === 0) {
                this.setData({
                    integral: res.data
                });
            }
        });
    },
	customizeModalShow(){
		this.setData({
			showCustomizeModal: false
		});
	},
	toContact(e){
		this.setData({
			showCustomizeModal:false
		});
	},
	integralExchange(e){
		var integralExchangeId = e.currentTarget.dataset.integralexchangeid;
		exchange({
			integralExchangeId: integralExchangeId
		}).then(res=>{
			this.getCurrentIntegral();
			this.setData({
				showCustomizeModal:true
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