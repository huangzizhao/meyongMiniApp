// pages/bargain/bargain.js
import {
    isBargainOrder,
    getPurchaseInfoByOrderId,
    bargainOrder,
    getBargainList
} from '../../../../config/getData.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: null,
        hasBargain: false,
        ownBargainNum: 0.00,
        totalBargainNum: 0.00,
        bargainList: [],
        showBargain: false,
        originalPrice: 0.00,
        percentage: 0,
        cover: null,

        countDown: {
            targetEndDate: '',
            countDownTime: '',
            timer: null,
            flag: false,
            hours: '00',
            minutes: '00',
            seconds: '00',
        },
		navbarData: {
			showCapsule: true,
			title: '砍价详情'
		},
		navbarHeight: getApp().globalData.navbarHeight
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.orderId) {
            this.setData({
                orderId: options.orderId
            });
        }
        isBargainOrder(this.data.orderId).then(e => {
            if (e.code === 0) {
                if (e.bargainOrder) {
                    this.setData({
                        ownBargainNum: e.bargainOrder.bargainPrice,
                        hasBargain: true
                    });
                } else {
                    this.setData({
                        showBargain: true
                    });
                }
                this.setData({
                    originalPrice: e.originalPrice,
                });
                this.getBargainList();
                let activityEndDate = (new Date((e.endTime + "").replace(/-/g, '/'))).getTime();
                this.setData({
                    countDown: {
                        targetEndDate: activityEndDate
                    }
                }, () => {
                    this.getSeverTime(activityEndDate);
                });
                return options.orderId;
            }
        }).then(e => {
            getPurchaseInfoByOrderId(e).then(e => {
                if (e.code === 0) {
                    let cover = getApp().globalData.serverImg + 'upload/qprize/cover/' + e.data.qprizeEntity.prizeId + '.png';
                    this.setData({
                        cover: cover
                    });
                }
            });
        });
    },

    initiateBargain: function() {
        this.setData({
            showBargain: true
        }, () => {
            this.bargain();
        });
    },

    bargain: function() {
        bargainOrder(this.data.orderId).then(e => {
            if (e.code === 0) {
                if (e.costPrice) {
                    this.getBargainList();
                    this.setData({
                        ownBargainNum: e.costPrice,
                        hasBargain: true
                    });
                }
            } else if (e.code === 500) {
                wx.showModal({
                    title: '提示',
                    content: e.msg,
                    showCancel: false
                })
            }
        });
    },

    getBargainList: function() {
        getBargainList(this.data.orderId).then(e => {
            if (e.code === 0) {
                if (e.data) {
                    let percentage = (e.total / this.data.originalPrice) * 100
                    this.setData({
                        percentage: percentage,
                        bargainList: e.data,
                        totalBargainNum: e.total
                    });
                }
            }
        });
    },

    cancel: function() {
        this.setData({
            showBargain: false
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
                if (this.data.countDown.timer) {
                    this.clearTimer();
                }
                if (initDuration <= 0) {
                    this.setFlag(true);
                }
                if (!this.data.countDown.flag) {
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
            countDown: {
                flag: false,
                num: 0
            }
        });
    },

    /**
     * 清空计时器
     */
    clearTimer: function() {
        clearInterval(this.data.countDown.timer);
        this.setData({
            countDown: {
                timer: null
            }
        });
    },

    runCountDown: function(initDuration) {
        // 第一次给倒计时赋值
        this.countDown(initDuration)

        // 每一秒更新一次倒计时
        this.data.timer = setInterval(() => {
            if (this.data.countDown.flag) { // 倒计时结束
                clearInterval(this.data.countDown.timer)
                return;
            }

            initDuration = initDuration - 1 > 0 ? initDuration - 1 : 0;
            this.countDown(initDuration)
        }, 990)
    },

    setFlag: function(e) {
        this.setData({
            countDown: {
                flag: e
            }
        });
    },

    /**
     * 计算倒计时
     * @param {Number} duration - 秒数时间差
     * @returns {string} 倒计时的字符串
     */
    countDown: function(duration) {
        if (duration <= 0) {
            this.setFlag(true) // 将flag属性设为true
            this.setData({
                countDown: {
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                }
            })
        } else {
            this.setData({
                countDown: {
                    hours: this.format(Math.floor(duration / 3600)),
                    minutes: this.format(Math.floor(duration / 60) % 60),
                    seconds: this.format(Math.floor(duration % 60))
                }
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

    toHome() {
		wx.reLaunch({
            url: '/pages/index/home'
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
        return {
            title: '你这一刀对我特别重要，麻烦你帮帮我嘛~~',
            path: '/mallModule/pages/bargainSet/bargain/bargain?orderId=' + this.data.orderId,
            imageUrl: '../../img/bargainPic.png',
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