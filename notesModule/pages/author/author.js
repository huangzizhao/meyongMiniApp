// notesModule/pages/author/author.js
import {
	getAuthorInfo
} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        switchTab: '',
        more: '',
		authorId:'',
		articleId:'',
        authorData: {},
		idType:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
			authorId: typeof (options.authorId) != 'undefined' ? options.authorId : null,
			articleId: typeof (options.articleId) != 'undefined' ? options.articleId : null
        },()=>{
			if (this.data.authorId === ''){
				this.data.idType = 'articleId'
			}else{
				this.data.idType = 'customerId'
			}
			getAuthorInfo({
				authorId: this.data.authorId,
				articleId: this.data.articleId
			}).then(res=>{
				if(res.code === 0){
					this.setData({
						authorData:res.data
					});
				}
			})
		});
    },
    switchTabChange(e) {
        let tab = e.currentTarget.dataset.tab;
        this.setData({
            switchTab: tab
        });
    },
    focus() {
        if (authorData.attention === 0) {
            this.setData({
                [`authorData.attention`]:1
            });
        }else{
			this.setData({
				[`authorData.attention`]: 0
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
        wx.hideShareMenu();
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
		//用时间戳产生不重复的随机数
		this.setData({
			more: new Date().getTime()
		})
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
		return {
			title: this.data.name,
			path: '/notesModule/pages/author/author?articleId=' + this.data.articleId + '&authorId=' + this.data.authorId,
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