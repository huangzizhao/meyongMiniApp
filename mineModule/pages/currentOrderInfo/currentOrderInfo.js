// pages/currentOrderInfo/currentOrderInfo.js
import {
    payQGOrder,
    payQPOrder,
    queryOrderState,
    getActivityIdByPrize
} from '../../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buyType: '',
        orderItem: {},
        queryOrderStateInterval: '', //查询交易订单定时器
        orderState: {
            0: '待支付',
            3: '支付完成'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            buyType: options.buyType,
            orderItem: JSON.parse(options.orderItem)
        });
        console.log(this.data.orderItem);
    },

    oderPay: function() {
        switch (Number(this.data.buyType)) {
            case 0:
                /**多人拼团需要发 orderCode**/
                var httpList = payQPOrder({
                    orderCode: this.data.orderItem.orderCode
                });
                break;
            case 1:
                /**抢购活动需要发 orderId**/
                var httpList = payQGOrder({
                    orderId: this.data.orderItem.orderId
                });
                break;
            default:
                break;
        }
        httpList.then(e => {
            if (e.code === 0) {
                // 成功下单,调起微信支付
                // this.setData({
                //     orders: {
                //         orderCode: e.orders.orderCode
                //     }
                // });
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
                    fail: () => {}
                })
            } else if (e.code === 600) {
                // 跳转手机绑定
                wx.showModal({
                    title: '尚未绑定手机',
                    content: '是否立即去绑定',
                    success: (res) => {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../../../pages/binding-phone/binding-phone'
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
                queryOrderState(this.data.orderItem.orderCode).then(e => {
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
                            url: '../../../pages/paymentResults/paymentResults?paymentResultsContent=' + paymentResultsContent + '&status=1',
                        })
                    }
                }).catch(e => {
                    let paymentResultsContent = '此支付操作失败，请联系客服'
                    wx.navigateTo({
                        url: '../../../pages/paymentResults/paymentResults?paymentResultsContent=' + paymentResultsContent + '&status=0',
                    })
                });
            }, 500)
        });
    },

    toActivityDetail: function() {
        getActivityIdByPrize(this.data.orderItem.prizeId).then(e => {
            if (e.code === 0) {
                wx.navigateTo({
                  url: '../../../mallModule/pages/groupPurchaseSet/groupPurchase/groupPurchase?activityId=' + e.data
                })
            }
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