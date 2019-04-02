// components/navbar/index.js
const app = getApp();
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		navbarData:{
			type:Object,
			value:{},
			observer:function(){}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		statusBarHeight: getApp().globalData.statusBarHeight,
		navbarData:{
			showCapsule:true
		}
	},

	attached(){
		// 获取是否是通过分享进入的小程序
		this.setData({
			share:app.global.share
		});
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		_navBack(){
			wx.navigateBack();
		},
		_backHome(){
			wx.switchTab({
				url: '/pages/index/home',
			})
		}
	}
})
