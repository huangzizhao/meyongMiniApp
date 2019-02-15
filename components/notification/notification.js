// components/notification/notification.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        userAvatar: {
            type: 'String',
            value: '',
            observer: '_userAvatarChange'
        },
        userName: {
            type: 'String',
            value: '',
            observer: '_userNameChange'
        },
        time: {
            type: 'String',
            value: '',
            observer: '_timeChange'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        userAvatarData: '',
        userNameData: '',
        timeData: '',
        showUp: true,
		activityList:[]
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function() {
		wx.request({
			url: getApp().globalData.server + 'qActivity/listQActivities',
			header: getApp().globalData.header,
			method: 'GET',
			success: (e) => {
				if (e.data.code === 0) {
					this.setData({
						activityList:e.data.data
					});
				}
			}
		})
	},
    attached: function() {},
    ready: function() {


    },
    moved: function() {},
    detached: function() {},

    /**
     * 组件的方法列表
     */
    methods: {

        //用户头像改变时
        _userAvatarChange: function(newVal, oldVal) {
            this.setData({
                userAvatarData: newVal
            });
        },
        _userNameChange: function(newVal, oldVal) {
            this.setData({
                userNameData: newVal
            });
        },
        _timeChange: function(newVal, oldVal) {
            let time = newVal / 1000;
            let timeString;
            if (time < 60) {
                timeString = '一分钟'
                this.setData({
                    timeData: timeString
                });
            } else if (time < 60 * 60) {
                timeString = parseInt(time / 60) + '分钟'
                this.setData({
                    timeData: timeString
                });
            } else if (time > 60 * 60) {
                timeString = parseInt(time / 3600) + '小时'
                this.setData({
                    timeData: timeString
                });
            }
			if (this.data.activityList.length > 0){
				if (newVal !== 0) {
					this.setData({
						showUp: false
					}, () => {
						setTimeout(() => {
							this.setData({
								showUp: true
							});
						}, 9000);
					});
				}
			}
        }
    }
})