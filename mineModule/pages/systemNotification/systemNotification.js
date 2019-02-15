// pages/systemNotification/systemNotification.js
import { getSystemNotification, singleNoticeHaveRead, allNoticeHaveRead} from '../../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        noticesList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		this.getSystemNotification();
    },

    readAll: function() {
        this.haveRead();
    },

    haveRead: function(e) {
		wx.showLoading({
			title: '加载中...',
		})
		let id, itemIndex,url = singleNoticeHaveRead({ noticeId: id });
        if (e) {
			id = e.currentTarget.dataset.noticeid;
			itemIndex = new Number(e.currentTarget.dataset.index);
        }else{
			url = allNoticeHaveRead({ noticeId: id });
		}
		url.then(e=>{
			if (itemIndex instanceof Number) {
				this.data.noticesList[itemIndex].read = 1;
			} else {
				this.data.noticesList.forEach(e => {
					e.read = 1;
				})
			}
			this.setData({
				noticesList: this.data.noticesList
			}, () => {
				wx.hideLoading()
			});
		});
    },

    setDate: function(newVal) {
        let time = (new Date().getTime() - new Date(newVal).getTime()) / 1000;
        let timeString;
        if (time < 60) {
            timeString = '一分钟前'
        } else if (time < 60 * 60) {
            timeString = parseInt(time / 60) + '分钟前'
        } else if (time > 60 * 60 && time < 60 * 60 * 24) {
            timeString = parseInt(time / 3600) + '小时前'
        } else if (time >= 60 * 60 * 24) {
            timeString = (newVal + "").split(" ")[0];
        }
        return timeString
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
		this.getSystemNotification();
    },

	getSystemNotification:function(){
		getSystemNotification().then(e=>{
			if (e.code === 0) {
				e.data.forEach((item) => {
					item.noticeDate = this.setDate(item.createTime);
				});
				this.setData({
					noticesList: e.data
				});
			}
			wx.stopPullDownRefresh();
			wx.hideNavigationBarLoading();
		});
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