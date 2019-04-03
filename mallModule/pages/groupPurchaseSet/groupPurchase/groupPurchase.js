// pages/groupPurchase/groupPurchase.js
import {
    getActivityInfo,
    isCurrentInGroup,
    getObtainNearestActivityInfo,
    getPurchaseInformation,
    getSpliceGroupList,
    postProductDataBuried
} from '../../../../config/getData'


// const originalPage = Page;
// const _extendsPage = function (conf, method) {
// 	const _o_method = conf[method];
// 	conf[method] = function (ops) {
// 		//在此处进行数据埋点
// 		if (typeof _o_method === 'function') {
// 			_o_method.call(this, ops);
// 			console.log(method);
// 			// if (method === 'onReady') {
// 			// 	var startTime = parseInt(new Date().getTime() / 1000);
// 			// 	var hasEnter = true;
// 			// 	console.log('startTime:' + startTime);
// 			// }
// 			// if (method === 'onUnload' || method === 'onHide') {
// 			// 	if (hasEnter) {
// 			// 		var timePart = parseInt(new Date().getTime() / 1000) - startTime;

// 			// 		var hasEnter = false;
// 			// 		console.log('timePart:' + timePart);
// 			// 	}
// 			// }
// 		}
// 	}
// }
// Page = (conf) => {
// 	//定义需要增强的方法
// 	const methods = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload']
// 	methods.map(function (method) {
// 		_extendsPage(conf, method);
// 	});

// 	//另外增强扩展埋点上送方法
// 	conf.william = {
// 		addActitonData: function (ops) {
// 			console.log('addActionData');
// 		},
// 		addVisitLog: function (ops) {
// 			console.log('addVisitLog');
// 		}
// 	}
// 	return originalPage(conf);
// }

Page({

    /**
     * 页面的初始数据
     */
    data: {
		navbarData: {
			showCapsule: true,
			title: '来美哈'
		},
		navbarHeight: getApp().globalData.navbarHeight,
		
        activityId: null,
        prizeId: null,
        activityData: {},
        showShareImg: false,
        disabled: false,
        wxCodePath: null,
        shareImgSrc: null,
        imgUrls1: [],
        imgUrls2: [],
        groupPurchase: {},
        targetEndDate: '',
        countDownTime: '',
        timer: null,
        flag: false,
        hours: '00',
        minutes: '00',
        seconds: '00',

        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 100,

        showModalStatus: false,
        animationData: {},
        participateAvatar: '../../../../../img/avatar.png',
        participateUserName: '',
        participateTime: 0,
        announcementList: [],
        queryPurchaseInterval: '', //查询参与活动定时器

        isYourself: true,
        groupId: null,
        orderGroup: null,
        spliceGroupList: [], //拼单列表
        orders: {},
        queryOrderStateInterval: '', //查询交易订单定时器
        enterDomStartTime: 0,
        partTime: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.groupId) {
            this.setData({
                groupId: options.groupId
            });
        }
        getActivityInfo(options.activityId).then(e => {
            if (e.code === 0) {
                if (e.data.status === 2) {
                    wx.showModal({
                        title: '提示',
                        content: '很抱歉，这期活动已结束\n点击确定跳转至最新活动列表',
                        showCancel: false,
                        success: (e) => {
                            if (e.confirm) {
                                wx.redirectTo({
                                    url: '../../mallModule/notificationList/notificationList'
                                })
                            }
                        }
                    });
                } else {
                    this.setData({
                        activityData: e.data,
                        disabled: e.isBuy,
                        activityId: options.activityId,
                        prizeId: e.data.prizeId,
                        orderGroup: e.data.qorderGroup
                    }, () => {
                        if (this.data.groupId) {
                            isCurrentInGroup(this.data.groupId).then(e => {
                                if (e.code === 0) {
                                    this.setData({
                                        isYourself: e.contain
                                    });
                                }
                            });
                        }
                    });
                    let imgTemp1 = Array(),
                        imgTemp2 = Array();
                    let tempData = getApp().globalData.serverImg + 'upload/qprize/cover/' + e.data.prizeId + '.png';
                    imgTemp1.push(tempData);
                    for (let i = 0; i < e.data.qprizeEntity.detailPics.length; i++) {
                        let tempDetail = getApp().globalData.serverImg + e.data.qprizeEntity.detailPics[i];
                        imgTemp2.push(tempDetail);
                    }

                    let activityEndDate = (new Date((e.data.endTime + "").replace(/-/g, '/'))).getTime();
                    this.setData({
                        imgUrls1: imgTemp1,
                        imgUrls2: imgTemp2,
                        groupPurchase: e.data,
                        targetEndDate: activityEndDate
                    }, () => {
                        getObtainNearestActivityInfo().then(e => {
                            if (e.code === 0) {
                                let announcementList = Array();
                                announcementList = e.data
                                this.setData({
                                    announcementList: announcementList
                                });
                            }
                        });
                    });
                    this.getSeverTime(activityEndDate);
                    this.getSpliceGroupList();
                }
            }
        });
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

    // 获取服务器时间
    getSeverTime: function(activityEndDate) {
        //获取外联的js文件路径
        let deltaTime = 0; //得到deltaTime 之后,随时可以用 客户端时间 + deltaTime，从而得到服务器时间

        wx.request({
            url: getApp().globalData.serverImg + 'upload/plugins/time.js',
            responseType: 'text',
            success: (e) => {
                deltaTime = (new Date((e.header.Date + "").replace(/-/g, '/'))).getTime() - (new Date()).getTime();
                let initDuration = (Number(activityEndDate) - ((new Date()).getTime() + deltaTime)) / 1000;
                console.log(initDuration);
                this.init();
                if (this.data.timer) {
                    this.clearTimer();
                }
                if (initDuration <= 0) {
                    this.setFlag(true);
                }
                if (!this.data.flag) {
                    this.runCountDown(initDuration);
                }
            }
        })
    },

    /**
     * 初始化函数
     */
    init: function() {
        this.setData({
            flag: false,
            num: 0
        });
    },

    /**
     * 清空计时器
     */
    clearTimer: function() {
        clearInterval(this.data.timer);
        this.setData({
            timer: null
        });
    },

    runCountDown: function(initDuration) {
        // 第一次给倒计时赋值
        this.countDown(initDuration)

        // 每一秒更新一次倒计时
        this.data.timer = setInterval(() => {
            if (this.data.flag == true) { // 倒计时结束
                clearInterval(this.data.timer)
                return;
            }

            initDuration = initDuration - 1 > 0 ? initDuration - 1 : 0;
            this.countDown(initDuration)
        }, 990)
    },

    setFlag: function(flag) {
        this.setData({
            flag
        });
    },

    /**
     * 计算倒计时
     * @param {Number} duration - 秒数时间差
     * @returns {string} 倒计时的字符串
     */
    countDown: function(duration) {
        if (duration <= 0) {
            this.setData({
                hours: '00',
                minutes: '00',
                seconds: '00',
            })
            this.setFlag(true) // 将flag属性设为true
        } else {
            this.setData({
                hours: this.format(Math.floor(duration / 3600)),
                minutes: this.format(Math.floor(duration / 60) % 60),
                seconds: this.format(Math.floor(duration % 60)),
            })
        }
        // return timeString
    },

    /**
     * 格式化小于10的数字
     * @param {Number} time - 小于10的数字
     * @returns {string} 格式化后的字符串
     */
    format: function(time) {
        return time >= 10 ? time : `0${time}`
    },

    // 选择分享方式
    powerDrawer: function(e) {
        let currentStatus = e.currentTarget.dataset.status;
        this.util(currentStatus)
    },

    util: function(currentStatus) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        let animation = wx.createAnimation({
            duration: 200, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
        animation.translateY(240).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(() => {
            // 执行第二组动画：Y轴不偏移，停
            animation.translateY(0).step()
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭抽屉
            if (currentStatus == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }, 200)

        // 显示抽屉
        if (currentStatus == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },

    // 分享至朋友圈
    shareToMoments: function() {
        this.util('close');
        this.setData({
            showShareImg: true
        }, () => {
            this.getWxCode();
        });
    },
    closeMask: function() {
        this.setData({
            showShareImg: false
        });
    },
    getWxCode: function() {
		const ctx = wx.createCanvasContext('myCanvas');
        wx.showLoading({
            title: '绘制中...',
            mask: true
        })
        wx.request({
            url: getApp().globalData.server + 'customer/getWxAcode',
            data: {
                path: "/pages/index/home"
            },
            header: getApp().globalData.header,
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (e1) => {
                this.setData({
                    wxCodePath: e1.data
                }, () => {
                    var wxCodePath = e1.data;
                    let sharePic = getApp().globalData.serverImg + this.data.activityData.qprizeEntity.sharePath;
                    //获取用Canvas画图取自网络图片的资源，需先进行下载缓存再画，否则会画不出
                    wx.downloadFile({
                        url: sharePic,
                        success: (e2) => {
                            if (e2.statusCode === 200) {
                                var imgPath = e2.tempFilePath;
                                wx.getImageInfo({
                                    src: wxCodePath,
                                    success: (e3) => {
                                        var wxCodePathLocal = e3.path;
                                        ctx.drawImage(imgPath, 0, 0, 296, 386);
                                        ctx.drawImage(wxCodePathLocal, 200, 300, 84, 84);
										console.log(imgPath);
										console.log(wxCodePathLocal);
                                        ctx.draw(false, (() => {
                                            console.log('进来了');
                                            setTimeout(() => {
                                                wx.canvasToTempFilePath({
                                                    x: 0,
                                                    y: 0,
                                                    width: 296,
                                                    height: 386,
                                                    destWidth: 296 * 2,
                                                    destHeight: 386 * 2,
                                                    canvasId: 'myCanvas',
                                                    success: (res) => {
                                                        this.setData({
                                                            shareImgSrc: res.tempFilePath
                                                        }, () => {
                                                            wx.hideLoading();
                                                        })
                                                        console.log('1:' + this.data.shareImgSrc);
                                                    },
                                                    fail:(res)=> {
                                                        console.log(res);
                                                        wx.hideLoading();
                                                    }
                                                })
                                            }, 50);
                                        })());
                                    }
                                })
                            }
                        },
                        fail: (res) => {
                            console.log(res);
                        }
                    });
                });
            }
        })
    },
    preventScroll: function() {
        return;
    },
    saveImg: function() {
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: this.data.shareImgSrc,
            success(res) {
                that.setData({
                    showShareImg: false
                })
                wx.showToast({
                    title: '成功保存到相册',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: () => {
                wx.showToast({
                    title: '已取消保存',
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    },
    beforeSaveImg: function() {
        var that = this;
        console.log('2:' + this.data.shareImgSrc);
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

    intoGroupPurchasePay: function() {
        if (this.data.activityId !== null) {
            this.postDomDataInfo('一人秒杀付款');
            wx.navigateTo({
                url: '../../../oneYuanLottery/beforeGroupPurchasePay/beforeGroupPurchasePay?activityId=' + this.data.activityId
            })
        } else {
            wx.showToast({
                title: '再点一次，刚刚页面在加载',
                icon: 'none'
            })
        }
    },

    getSpliceGroupList: function() {
        getSpliceGroupList().then(e => {
            if (e.code === 0) {
                this.setData({
                    spliceGroupList: e.data
                });
            }
        });
    },

    catchTouchMove: function() {
        return;
    },

    //直接进入拼团页面
    intoMultiplayerGroup: function(e) {
        this.postDomDataInfo('组人拼团');
        wx.navigateTo({
            url: '../multiplayerGroupPurchase/multiplayerGroupPurchase?activityId=' + this.data.activityId
        })
    },

    //进入多人拼团付款页面
    toMultiplayerGroupPay: function(e) {
        this.postDomDataInfo('多人拼团付款');
        if (e.currentTarget.dataset.groupid && e.currentTarget.dataset.prizeid) {
            wx.navigateTo({
                url: '../beforeMultiplayerGroupPurchasePay/beforeMultiplayerGroupPurchasePay?groupId=' + e.currentTarget.dataset.groupid + '&activityId=' + this.data.activityId + '&prizeId=' + e.currentTarget.dataset.prizeid
            })
        } else if (e.currentTarget.dataset.prizeid && !e.currentTarget.dataset.groupid) {
            wx.navigateTo({
                url: '../beforeMultiplayerGroupPurchasePay/beforeMultiplayerGroupPurchasePay?prizeId=' + e.currentTarget.dataset.prizeid + '&activityId=' + this.data.activityId
            })
        } else {
            wx.navigateTo({
                url: '../beforeMultiplayerGroupPurchasePay/beforeMultiplayerGroupPurchasePay?activityId=' + this.data.activityId
            })
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
        // 数据埋点
        this.data.enterDomStartTime = 0;
        this.data.enterDomStartTime = parseInt(new Date().getTime() / 1000);
        console.log('enterDomStartTime：' + this.data.enterDomStartTime);
        this.getNotices();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // 数据埋点
        this.data.partTime += parseInt(new Date().getTime() / 1000) - this.data.enterDomStartTime;
        clearInterval(this.data.queryPurchaseInterval);
    },

    /**
     * 提交埋点数据信息
     */
    postDomDataInfo(nextPageTitle) {
        this.data.partTime += parseInt(new Date().getTime() / 1000) - this.data.enterDomStartTime;
        //浏览时长不大于0的视为垃圾数据
        if (this.data.partTime > 0) {
            let productData = {
                duringTime: this.data.partTime,
                page: this.data.activityData.prizeTitle,
                nextPage: nextPageTitle
            }
            console.log(this.data.activityData.prizeTitle);

            postProductDataBuried(productData).then((e) => {
                setTimeout(() => {
                    this.data.partTime = 0;
                }, 500);
                console.log('记录成功');
            });
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        console.log('showOnUnload');
        clearInterval(this.data.queryPurchaseInterval);

        this.postDomDataInfo('项目列表');
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
    //分享
    onShareAppMessage: function() {
        return {
            title: this.data.activityData.prizeTitle,
            path: "/mallModule/pages/groupPurchase/groupPurchase?activityId=" + this.data.activityId,
            imageUrl: this.data.imgUrls1[0],
            success: (res) => {
                this.util('close');
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