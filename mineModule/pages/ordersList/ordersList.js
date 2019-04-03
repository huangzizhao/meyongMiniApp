// pages/ordersList/ordersList.js
import { getListOrders} from '../../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        orderState: {
            0: '待支付',
            3: '支付完成'
        },
		navbarData: {
			showCapsule: true,
			title: '我的订单'
		},
		navbarHeight: getApp().globalData.navbarHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		getListOrders().then(e=>{
			if (e.code === 0) {
				e.orders.forEach((item) => {
					item.activityCover = getApp().globalData.serverImg + item.prize.coverPath;
					switch (item.status) {
						case 0:
							item.statusColor = 'red';
							break;
						case 3:
							item.statusColor = 'blue';
							break;
					}
				});
				this.setData({
					orderList: e.orders
				})
				console.log(this.data.orderList);
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
        this.onPullDownRefresh();
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
        wx.showNavigationBarLoading();
        this.getOrdersList();
    },

    getOrdersList: function() {
		getListOrders().then(e=>{
			if (e.code === 0) {
				e.orders.forEach((item) => {
					item.activityCover = getApp().globalData.serverImg + item.prize.coverPath;
					switch (item.status) {
						case 0:
							item.statusColor = 'red';
							break;
						case 3:
							item.statusColor = 'blue';
							break;
					}
				});
				this.setData({
					orderList: e.orders
				})
			}
			wx.stopPullDownRefresh();
			wx.hideNavigationBarLoading();
		});
    },
    intoOrderDetail: function(e) {
        let orderItem = e.currentTarget.dataset.orderitem;
		if (orderItem.orderCode.startsWith("T")){
			if (orderItem.status === 0){
				wx.navigateTo({
					url: '../currentOrderInfo/currentOrderInfo?orderItem=' + JSON.stringify(orderItem) + '&buyType=' + 0,
				})
			} else if (orderItem.status === 3){

				wx.navigateTo({
					url: '../../../mallModule/pages/groupPurchaseSet/multiplayerGroupPurchase/multiplayerGroupPurchase?orderId=' + orderItem.orderId,
				})
			}
		} else if (orderItem.orderCode.startsWith("Q")){
			wx.navigateTo({
				url: '../currentOrderInfo/currentOrderInfo?orderItem=' + JSON.stringify(orderItem) +'&buyType=' + 1,
			})
		}
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