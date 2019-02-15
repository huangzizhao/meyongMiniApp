// components/announcement/announcement.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        announcementList: {
            type: 'Array',
            value: [],
            observer: '_announcementData'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        announcement: [],
        showNotice: false
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function() {},
    attached: function() {},
    ready: function() {
		if (this.data.announcement.length <= 0) {
			this.setData({
				showNotice: false
			});
		}
    },
    moved: function() {},
    detached: function() {},

    /**
     * 组件的方法列表
     */
    methods: {
        _announcementData: function(newVal, oldVal) {
			if (newVal.length > 0){
				this.setData({
					announcement: newVal,
					showNotice: true
				});
			}
        },
        closeNotice: function() {
            this.setData({
                showNotice: false
            });
        },
		toWinnerAnnouncement:function(){
			wx.navigateTo({
				url: '../../pages/winnerAnnouncement/winnerAnnouncement'
			})
		},
		catchTouchMove:function(){
			return;
		}
    }
})