// pages/winnerAnnouncement/winnerAnnouncement.js
import { getObtainNearestWinDetail} from '../../config/getData'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		activityList:{}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		getObtainNearestWinDetail().then(e=>{
			if(e.code === 0){
				this.setData({
					activityList: e.data
				});
			}
		});
	}
})