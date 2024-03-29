// customTabBar/customTabBar.js

Component({
    data: {
        selected: 0,
        tabBarShow: true,
        color: "#B8B2B1",
        selectedColor: "#f1b500",
        list: [{
                pagePath: "/pages/index/home",
                text: "首页",
                iconPath: "/img/home.png",
                selectedIconPath: "/img/homeActive.png"
            },
            {
                pagePath: "",
                text: "发布笔记",
                iconPath: "/img/notes.png",
                selectedIconPath: "/img/notesActive.png"
            },
            {
                pagePath: "/pages/integralExchange/integralExchange",
                text: "兑换区",
                iconPath: "/img/integral.png",
                selectedIconPath: "/img/integralActive.png"
            },
            {
                pagePath: "/pages/mine/mine",
                text: "我",
                iconPath: "/img/mine.png",
                selectedIconPath: "/img/mineActive.png"
            }
        ]
    },
    attached() {},
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset;
            const url = data.path;
            const userInfo = e.detail.userInfo;
            if (e.detail.userInfo) {
                var customer = getApp().globalData.customer;
                if (customer == null) {
                    wx.showLoading({
                        title: '加载中...',
                        mask: true
                    })
                    wx.login({
                        success: res => {
                            console.log(res.code, "code");
                            // 发送 res.code 到后台换取 openId, sessionKey, unionId
                            if (res.code) {
                                //发起网络请求
                                wx.request({
                                    url: getApp().globalData.server + 'customer/customerLoginByCode',
                                    data: {
                                        code: res.code
                                    },
                                    success: (res) => {
                                        this.globalData.customer = res.data.customer;
										this.globalData.sessionId = res.data.sessionId;
										this.globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId;
										this.globalData.lottieSuccessShow = res.data.isGet;
                                        wx.hideLoading();
                                        this.getGlobalUserInfo(userInfo);
                                        this.navigationJump(data, url);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    this.getGlobalUserInfo(userInfo);
                    this.navigationJump(data, url);
                }
            }
        },
        getGlobalUserInfo(userInfo) {
            wx.request({
                url: getApp().globalData.server + "customer/updateInfo",
                data: userInfo,
                header: getApp().globalData.header,
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    getApp().globalData.customer.name = userInfo.nickName;
                    getApp().globalData.customer.male = userInfo.gender;
                    getApp().globalData.customer.headImg = userInfo.avatarUrl;
                    this.setData({
                        customer: getApp().globalData.customer
                    },()=>{
						console.log('userInfo:' + JSON.stringify(userInfo));
					})
                }
            })
        },
        navigationJump(data, url) {
			if (getApp().globalData.customer.phone) {
				if (data.index === 1) {
					wx.chooseImage({
						sizeType: ['original', 'compressed'],
						sourceType: ['album', 'camera'],
						success: (res) => {
							let data = {
								tempImages: res.tempFiles,
								tempImagesPath: res.tempFilePaths,
								articleContent: '',
								articleTitle: '',
								labelList: []
							}
							wx.navigateTo({
								url: '/notesModule/pages/editPictures/editPictures?data=' + JSON.stringify(data),
							})
							// getApp().globalData.localStorages.storage.Set('tempImagesArray', data).then((res)=>{
							// 	console.log('save success');
							// }).catch((error)=>{
							// 	console.log('save fail');
							// });
						}
					})
				} else {
					// this.setData({
					//   selected: data.index
					// })
					wx.switchTab({
						url
					});
					console.log(this.data.selected);
				}
            }
			else {
				wx.showModal({
					title: '尚未绑定手机',
					content: '是否立即去绑定',
					success: function (res) {
						if (res.confirm) {
							wx.navigateTo({
								url: '/pages/binding-phone/binding-phone'
							})
						}
					}
				})
			}
        }
    }
})