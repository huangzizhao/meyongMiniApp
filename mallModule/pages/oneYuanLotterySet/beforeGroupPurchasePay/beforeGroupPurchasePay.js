// pages/beforeGroupPurchasePay/beforeGroupPurchasePay.js
import { getActivityInfo, queryOrderState, payQGOrder} from '../../../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityData: null,
        activityCover: null,
        purChaseNum: 1,
        totalPrice: 1,
        disabled: true,
        orders: {},
        queryOrderStateInterval: '' //查询交易订单定时器
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		getActivityInfo(options.activityId).then(e=>{
			if (e.code === 0) {
				this.setData({
					activityData: e.data
				});
				let activityCover = getApp().globalData.serverImg + 'upload/qprize/cover/' + e.data.prizeId + '.png';
				this.setData({
					activityCover: activityCover
				});
			}
		});
    },

    calculateNum: function(e) {
        wx.showLoading({
            title: '加载中...',
        })
        let num = Number(e.currentTarget.dataset.num),
            purChaseNum = this.data.purChaseNum;
        if (purChaseNum + num <= 1) {
            purChaseNum = 1;
            this.setData({
                disabled: true
            });
		} else if (purChaseNum + num >= 51){
			purChaseNum = 50;
			this.setData({
				disabled: false
			});
		} else {
            purChaseNum = purChaseNum + num;
            this.setData({
                disabled: false
            });
        }
        this.setData({
            purChaseNum: purChaseNum
        }, () => {
            wx.hideLoading();
        });
    },
    groupPurchaseNow: function() {
		payQGOrder({
			activityId: this.data.activityData.activityId,
			buyCount: this.data.purChaseNum
		}).then(e=>{
			if (e.code === 0) {
				// 成功下单,调起微信支付
				this.setData({
					orders: {
						orderCode: e.orders.orderCode
					}
				});
				let order = e.params;
				wx.requestPayment({
					'timeStamp': order.timeStamp,
					'nonceStr': order.nonceStr,
					'package': order.package,
					'signType': 'MD5',
					'paySign': order.paySign,
					success: () => {
						//支付成功，处理相应订单
						this.queryWxPay()
					},
					fail: () => { }
				})
			} else if (e.code === 600) {
				// 跳转手机绑定
				wx.showModal({
					title: '尚未绑定手机',
					content: '是否立即去绑定',
					success: (res) => {
						if (res.confirm) {
							wx.navigateTo({
                url: '../../../../pages/binding-phone/binding-phone'
							})
						}
					}
				})
			} else {
				// 普通提示
				if (e.count) {
					wx.showModal({
						title: '提示',
						content: e.msg,
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.setData({
									purChaseNum: e.count
								});
							}
						}
					});
				} else {
					wx.showModal({
						title: '提示',
						content: e.msg,
						showCancel: false
					});
				}
			}
		});
    },

    queryWxPay: function() {
        // 申明定时器进行定时查询订单
        this.setData({
            queryOrderStateInterval: setInterval(() => {
				queryOrderState(this.data.orders.orderCode).then(e=>{
					if (e.state === 3) {
						clearInterval(this.data.queryOrderStateInterval);
						wx.showToast({
							title: '支付成功',
							icon: 'none',
							duration: 1500
						});

						//跳转至支付成功
						let paymentResultsContent = '您可以在 “我的订单”中查询'
						wx.navigateTo({
              url: '../../../../pages/paymentResults/paymentResults?paymentResultsContent=' + paymentResultsContent + '&status=1',
						})
					}
				}).catch(e=>{
					let paymentResultsContent = '此支付操作失败，请联系客服'
					wx.navigateTo({
            url: '../../../../pages/paymentResults/paymentResults?paymentResultsContent=' + paymentResultsContent + '&status=0',
					})
				});
            }, 500)
        });
    },

    toActivityDetail: function() {
        wx.navigateTo({
            url: '../groupPurchase/groupPurchase?activityId=' + this.data.activityData.activityId
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: this.data.activityData.prizeTitle,
            path: "/mallModule/pages/groupPurchase/groupPurchase?activityId=" + this.data.activityData.activityId,
            imageUrl: this.data.activityCover,
            success: (res) => {
                wx.showToast({
                    title: '分享成功，(゜-゜)つロ干杯',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (res) => {
                wx.showToast({
                    title: '已取消分享',
                    duration: 1500
                })
            }
        }
    }
})