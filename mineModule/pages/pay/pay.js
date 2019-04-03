// pages/pay/pay.js
import { queryOrderState, payAppointmentGold} from '../../../config/getData'
const app = getApp();
Page({
    data: { // 参与页面渲染的数据
        array: ['微信支付'],
        index: 0,
        customer: '',
        money: '',
        orders: {},
        contact: '',
        mobile: '',
        projectId: '',
        queryOrderStateInterval: '', //查询交易订单定时器
		navbarData: {
			showCapsule: true,
			title: '预约金支付'
		},
		navbarHeight: getApp().globalData.navbarHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            orders: JSON.parse(options.data),
            contact: JSON.parse(options.data).contact,
            mobile: JSON.parse(options.data).phone,
            projectId: JSON.parse(options.data).projectId
        });
    },

    bindPayMentChange: function(e) {
        this.setData({
            index: e.detail.value
        });
    },

    forMatDate: function(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
        return year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day)
    },

    formSubmit: function(e) {
        var tempMobile = e.detail.value.mobile,
            tempContact = e.detail.value.contact;
        var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (myreg.test(tempMobile) && tempContact.length > 0) {
            this.wxPay(tempMobile, tempContact);
        } else {
            wx.showToast({
                title: '手机号或联系人输入有误',
                icon: 'none',
                duration: 1000,
                mask: true,
            })
        }
    },

    //调起微信支付
    wxPay: function(tempMobile, tempContact) {
		payAppointmentGold({
			phone: tempMobile,
			contact: tempContact,
			projectId: this.data.projectId
		}).then(e=>{
			var order = e.params;
			wx.requestPayment({
				'timeStamp': order.timeStamp,
				'nonceStr': order.nonceStr,
				'package': order.package,
				'signType': 'MD5',
				'paySign': order.paySign,
				success: (res)=> {
					//支付成功，处理相应订单
					this.queryWxPay()
				}
			})
		});
    },

    queryWxPay: function() {
        // 申明定时器进行定时查询订单
        var that = this;
        this.setData({
            queryOrderStateInterval: setInterval(function() {
				queryOrderState(this.data.orders.orderCode).then(e=>{
					if (e.state === 2) {
						clearInterval(this.data.queryOrderStateInterval);
						wx.showToast({
							title: '支付成功',
							icon: 'none',
							duration: 500
						});

						let paymentResultsContent = '您可以在 “我的预约金”中查询'
						wx.navigateTo({
							url: '../../../pages/paymentResults/paymentResults?paymentResultsContent=' + paymentResultsContent + '&status=1',
						})
					}
				}).catch(e=>{
					let paymentResultsContent = '此支付操作失败，请联系客服'
					wx.navigateTo({
            url: '../../../pages/paymentResults/paymentResults?paymentResultsContent=' + paymentResultsContent + '&status=0',
					})
				});
            }, 500)
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

        // 清除查询预约金订单定时器
        clearInterval(this.data.queryOrderStateInterval);
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

    }
})