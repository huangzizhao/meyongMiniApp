// pages/person-center/person-center.js
import { hasUnReadNotice} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        customer: null,
        amount: 0,
        hasUnreadMessage: false
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
		this.getUnreadMessage();
    },

	getUnreadMessage:function(){
		hasUnReadNotice().then(e=>{
			if (e.code === 0) {
				this.setData({
					hasUnreadMessage: e.unRead
				});
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
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
		this.getUnreadMessage();}
})