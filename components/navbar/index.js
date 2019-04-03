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
			observer: '_navbarData'
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		highLight:false, //图标是否为白色高亮，默认为黑色
		statusBarHeight: getApp().globalData.statusBarHeight,
		navbarData:{
			showCapsule:true,
			navigationBarBackgroundColor: '#fff',
			navigationBarTextStyle: '#000',
		}
	},

	attached(){
		// 获取是否是通过分享进入的小程序
		this.setData({
			share: getApp().globalData.share
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
			getApp().globalData.share = false
			wx.switchTab({
				url: '/pages/index/home',
			})
		},
		_navbarData(newVal, oldVal){
			this.setData({
				navbarData: newVal
			});
			if (newVal.navigationBarBackgroundColor) {
				let navbarColor = newVal.navigationBarBackgroundColor;
				navbarColor = navbarColor.substring(navbarColor.indexOf('(') + 1, navbarColor.lastIndexOf(','))
				let colorList = navbarColor.split(',');
				if (colorList[0] * 0.299 + colorList[1] * 0.578 + colorList[2] * 0.114 >= 192) {
					// 浅色背景		

				} else {
					// 深色背景
					this.setData({
						highLight: true
					});
				}
			}
		}
	}
})
