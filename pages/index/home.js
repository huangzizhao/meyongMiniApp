// pages/index/home.js
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight
import { getBindRecommendUser, getWaterFallFlow, getObtainNearestActivityInfo, getPurchaseInformation} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: width,
        height: height,
        customer: '',
        enShowHomeImg: false,
        translate: '',
        mark: 0,
        newmark: 0,
        startmark: 0,
        endmark: 0,
        windowHeight: wx.getSystemInfoSync().windowHeight,

		articles: [],
		pageUtil: {
			page: 1,
			limit: 10,
			order: '',
			sidx: ''
		},
		totalPage: -1,
		enBottom: false,
		canGetMore: true,
		showSpinner: false,

        participateAvatar: '../../img/avatar.png',
        participateUserName: '',
        participateTime: 0,
        announcementList: [],
        queryPurchaseInterval: '', //查询参与活动定时器
		indicatorDots: false,
		autoplay: true,
		circular: true,
		interval: 4000,
		duration: 700,
		waterFallFlowData:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getInitQuery();
        if (getApp().globalData.enShowHomeImg) {
            this.setData({
                enShowHomeImg: getApp().globalData.enShowHomeImg
            })
            getApp().globalData.enShowHomeImg = false
        }
        var getCustomer = setInterval(() => {
            var customer = getApp().globalData.customer;
            if (getApp().globalData.sessionId != null && customer != null) {
                this.setData({
                    customer: customer
                });
                var scene = decodeURIComponent(options.scene);
                if (scene != "undefined" && customer.recommendId == null) {
					// let data = {
					// 	recommendId: scene
					// }
					// getBindRecommendUser(data).then((e)=>{
					// 	if(e.code === 0){
					// 		getApp().globalData.customer.recommendId = scene;
					// 	}
					// });
                    wx.request({
                        url: getApp().globalData.server + "customer/bindRecommendUser",
                        data: {
                            recommendId: scene
                        },
                        header: getApp().globalData.header,
                        method: 'GET',
                        dataType: 'json',
                        success: function(res) {
                            getApp().globalData.customer.recommendId = scene;
                        }
                    })
                }
                clearInterval(getCustomer);
            }
        }, 100);
        this.loadData();
        // wx.startPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
        this.getNotices();
		// if(this.data.waterFallFlowData){
		// 	let view = this.selectComponent('#waterFallFlow');
		// 	view.fillData(true, this.data.waterFallFlowData);
		// }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        clearInterval(this.data.queryPurchaseInterval);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(this.data.queryPurchaseInterval);
    },
    openCamera: function() {
        const that = this;
        this.setData({
            enShowHomeImg: false
        })
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                // //  获取裁剪图片资源后，给data添加src属性及其值
                // that.wecropper.pushOrign(src);
                wx.showLoading({
                    title: '加载中...',
                })
                wx.request({
                    url: getApp().globalData.server + 'meetFuture',
                    header: getApp().globalData.header,
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: function(res) {
                        if (res.data.res != null) {
                            getApp().globalData.meetFuture = res.data.res;
                            wx.hideLoading();
                            wx.navigateTo({
                                url: '../cutInside/cutInside?src=' + src
                            });
                        }
                    }
                })
            }
        })
    },
    // openArticle: function() {
    //     wx.navigateTo({
    //         url: '../article-list/article-list'
    //     })
    // },
    openMine: function() {
        var customer = getApp().globalData.customer;
        if (customer.phone != null) {
            wx.navigateTo({
				url: '../mine/mine'
            })
        } else {
            wx.showModal({
                title: '尚未绑定手机',
                content: '是否立即去绑定',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../binding-phone/binding-phone'
                        })
                    }
                }
            })
        }
    },

    getNotices: function() {
        this.setData({
            queryPurchaseInterval: setInterval(() => {
              getPurchaseInformation().then(e => {
                if (e.code === 0) {
                  if (e.data.avatar === null) {
                    this.setData({
                      participateUserName: e.data.name,
                      participateTime: e.data.offset
                    });
                  } else {
                    this.setData({
                      participateUserName: e.data.name,
                      participateTime: e.data.offset,
                      participateAvatar: e.data.avatar
                    });
                  }
                }
              });
            }, 18000)
        });
    },

    getUserInfo: function(e) {
        //用户按了允许授权按钮
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
                                success: res => {
                                    getApp().globalData.customer = res.data.customer;
                                    getApp().globalData.sessionId = res.data.sessionId;
                                    getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId;
                                    wx.hideLoading();
                                }
                            });
                        }
                    }
                });
            }
            wx.request({
                url: getApp().globalData.server + "customer/updateInfo",
                data: e.detail.userInfo,
                header: getApp().globalData.header,
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    getApp().globalData.customer.name = e.detail.userInfo.nickName;
                    getApp().globalData.customer.male = e.detail.userInfo.gender;
                    getApp().globalData.customer.headImg = e.detail.userInfo.avatarUrl;
                    this.setData({
                        customer: getApp().globalData.customer
                    })
                }
            })
        }
    },

    bindGetUserInfo: function(e) {
        this.getUserInfo(e);
        this.openPreson();
    },
    openShare: function() {
        wx.navigateTo({
            url: '../share/share'
        })
    },
    //取消事件
    cancel() {
        this.setData({
            enShowHomeImg: false
        })
    },

	//跳转至内嵌网页活动页面  
    toPromotion() {
        wx.navigateTo({
            url: '../promotion/promotion',
        })
    },

    openActivity: function() {
        wx.navigateTo({
            url: '../pictionary/pictionary'
        })
    },

    loadData: function() {
		getWaterFallFlow(JSON.stringify(this.data.pageUtil)).then(e => {
			if (e.code === 0) {
				this.setData({
					showSpinner: false
				}, () => {
					this.data.canGetMore = true
					let view = this.selectComponent('#waterFallFlow');
					view.fillData(false, e.res.list);
					this.data.totalPage = e.res.totalPage;
				});
			}
		});
    },

    /**
     * 页面上拉触底事件的处理函数
     */
	onReachBottom: function () {
		if (this.data.pageUtil.page == this.data.totalPage) {
			this.setData({
				enBottom: true
			})
		} else {
			if (this.data.canGetMore) {
				this.setData({
					showSpinner: true
				}, () => {
					var pageUtil = this.data.pageUtil;
					pageUtil.page++;
					this.loadData();
				});
			}
		}
		this.data.canGetMore = false;
	},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading();
		this.setData({
			pageUtil: {
				page: 1,
				limit: 10,
				order: '',
				sidx: ''
			},
			totalPage: -1,
			enBottom: false
		});

		var getArticle = setInterval(() => {
			var sessionId = getApp().globalData.sessionId
			if (sessionId != '') {
				getWaterFallFlow(JSON.stringify(this.data.pageUtil)).then(e => {
					if (e.code === 0) {
						let view = this.selectComponent('#waterFallFlow');
						view.fillData(true, e.res.list);
						wx.stopPullDownRefresh();
						wx.hideNavigationBarLoading();
					}
				});
				clearInterval(getArticle);
			}
		}, 10);
	},

    getInitQuery: function() {
		getObtainNearestActivityInfo().then(e=>{
			if(e.code === 0){
				let announcementList = Array();
				announcementList = e.data
				this.setData({
					announcementList: announcementList
				});
			}
		});
        // wx.request({
        //     url: getApp().globalData.server + 'qActivity/obtainNearestActivityInfo',
        //     header: getApp().globalData.header,
        //     method: 'GET',
        //     success: (e1) => {
        //         if (e1.data.code === 0) {
        //             let announcementList = Array();
        //             announcementList = e1.data.data
        //             this.setData({
        //                 announcementList: announcementList
        //             });
        //         }
        //     },
        //     fail: (res) => {},
        // });
    },
    toActivityList: function(e) {
        this.getUserInfo(e);
        this.openActivityList();
    },
    openActivityList: function() {
        var customer = getApp().globalData.customer;
        if (customer.phone != null) {
            wx.navigateTo({
              url: '/mallModule/pages/notificationList/notificationList'
            })
        } else {
            wx.showModal({
                title: '尚未绑定手机',
                content: '是否立即去绑定',
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../binding-phone/binding-phone'
                        })
                    }
                }
            })
        }
    },

	//保存图片前校验用户是否有权限保存
	beforeSaveImg: function () {
		var that = this;
		wx.showLoading({
			title: '加载中...',
		});
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: (e) => {
							wx.hideLoading();
							that.saveImg();
						},
						fail: (e) => {
							wx.showModal({
								title: '提示',
								content: '无权限保存，点击确定去设置',
								success: (e) => {
									wx.hideLoading();
									if (e.confirm) {
										wx.openSetting({
											success(res) {
												console.log(res.authSetting)
											}
										})
									}
								}
							})
						}
					})
				} else {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: (e) => {
							wx.hideLoading();
							that.saveImg();
						},
						fail: (e) => {
							console.log(e);
						}
					})
				}
			},
			fail: (res) => {
				console.log(res);
				wx.hideLoading();
			}
		})
	},
	saveImg() {
		var that = this;
		wx.saveImageToPhotosAlbum({
			filePath: 'img/promotion.png',
			success(e) {
				wx.showToast({
					title: '成功保存到相册',
					icon: 'success',
					duration: 2000
				})
			},
			fail: (e) => {
				console.log(e);
				wx.showToast({
					title: '已取消保存',
					icon: 'error',
					duration: 2000
				})
			}
		})
	},
	intoArticlePush(e){
		this.getUserInfo(e);
		wx.navigateTo({
			url: '../articlePushTest/articlePushTest'
		})
	},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
    // tap_ch: function (e) {
    //   this.setData({
    //     translate: 'transform:translateY(0vh)'
    //   });
    // },

    // tap_start: function (e) {
    //   this.data.mark = this.data.newmark = e.touches[0].pageY;
    //   this.data.startmark = e.touches[0].pageY;
    // },

    // tap_drag: function (e) {
    //   /*
    //    * 手指从下向上移动
    //    * @newmark是指移动的最新点的y轴坐标 ， @mark是指原点y轴坐标
    //    */
    //   this.data.newmark = e.touches[0].pageY;
    //   if (this.data.startmark > this.data.newmark) {
    //     if (this.data.windowHeight > Math.abs(this.data.newmark - this.data.startmark)) {
    //       this.setData({
    //         translate: 'transform: translateY(' + (this.data.newmark - this.data.startmark) * 0.6 + 'px)'
    //       });
    //     }
    //   }
    //   this.data.mark = this.data.newmark;
    // },

    // tap_end: function (e) {
    //   if (this.data.startmark > this.data.newmark) {
    //     if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowHeight * 0.2)) {
    //       this.setData({
    //         translate: 'transform: translateY(0vh)'
    //       });
    //     } else {
    //       this.setData({
    //         translate: 'transform: translateY(-100vh)'
    //       });
    //     }
    //   }
    //   this.data.mark = 0;
    //   this.data.newmark = 0;
    // }

})