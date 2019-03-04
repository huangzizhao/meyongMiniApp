// mineModule/pages/ratingRule/ratingRule.js
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight
import {
	getAuthorGrade
} from '../../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
		grade:1,
        current: 0,
        navScrollLeft: 0,
		animationActive:{},
		animationNormal:{},
        navList: [{
                url: './img/1.png'
            },
            {
				url: './img/2.png'
            },
            {
				url: './img/3.png'
            },
            {
				url: './img/4.png'
            },
            {
				url: './img/5.png'
            },
            {
				url: './img/6.png'
            }
        ],
		swiperContentList:[
			{
				title:'小白虫子',
				content:'上传照片 发布笔记 笔记中添加基本表情'
			}, {
				title: '奶瓶蜂',
				content: '发布1+笔记，获得5个收藏或10个赞'
			},
			{
				title: '摇摇蜂',
				content: '发布5+笔记，获得10个收藏或50个赞'
			},
			{
				title: '文化蜂',
				content: '发布10篇笔记，均获得10个收藏或50个赞，或发布50篇笔记获得10个收藏或50个赞'
			},
			{
				title: '工蜂',
				content: '发布12+笔记均获得10个收藏或50个赞，或发布80篇笔记获得10个收藏或50个赞'
			},
			{
				title: '蜂后',
				content: '发布18+笔记均获得10个收藏或50个赞，或发布100篇笔记获得10个收藏或50个赞 送乐高拼插玩具 每周线下聚会，专车接送，聚会冷餐。'
			}
		]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		let getGrade = setInterval(() => {
			let sessionId = getApp().globalData.sessionId;
			if (sessionId != '') {
				clearInterval(getGrade);
				getAuthorGrade().then(res => {
					if (res.code === 0) {
						this.setData({
							grade: res.data
						});
					}
				});
			}
		}, 10);
		this.shrink('70%');
		this.stretch('80%');
    },

    switchNav(e) {
         var current = e.currentTarget.dataset.current;

        //每个tab的宽度
        let singleTabWidth = width / 5;
        //tab选项居中
        this.setData({
            navScrollLeft: (current - 2) * singleTabWidth
        });
        if (this.data.current == current) {
            return false;
        } else {
            this.setData({
                current: current
            });
        }
    },

    swiperChange(e) {
		console.log('current:' + e.detail.current);
		//每个tab的宽度
		var singleTabWidth = width / 5;
        if (e.detail.source === 'touch') {
            //防止swiper控件卡死
            // if (e.detail.current == 0 && this.data.current > 1) {
            //     this.setData({
            //         current: this.data.current,
			// 		navScrollLeft: (e.detail.current - 2) * singleTabWidth
            //     });
			// 	console.log('卡死轮播');
            // } else {
                //正常轮播时，记录正确页码索引
                this.setData({
                    current: e.detail.current,
					navScrollLeft: (e.detail.current - 2) * singleTabWidth
                });
				console.log('正常轮播');
            // }
			this.shrink('70%');
			this.stretch('80%');
        }
    },

	// 展开
	stretch(h) {
		var animationActive = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		})
		this.animationActive = animationActive
		animationActive.height(h).step()
		this.setData({
			animationActive: animationActive.export(),
		})
	},
	// 收缩
	shrink(h) {
		var animationNormal = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		})
		this.animationNormal = animationNormal
		animationNormal.height(h).step()
		this.setData({
			animationNormal: animationNormal.export()
		})
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