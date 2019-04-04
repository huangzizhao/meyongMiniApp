//app.js
import {
    LocalStorage
} from "/config/localStorage.js"
// import { saveFileRule } from '/config/storageOptimization.js'
App({
    globalData: {
        customer: null,
        server: 'https://wx.meyoungmia.com/api/',
        serverImg: 'https://wx.meyoungmia.com/',
        // server: 'https://wx.mymia.top/api/',
        // serverImg: 'https://wx.mymia.top/',
        // server: 'http://192.168.0.162:7099/api/',
        // serverImg: 'http://192.168.0.162:7099/',
        sessionId: '',
        articles: [],
        header: {
            'content-type': 'application/json;charset=utf-8',
            'Cookie': 'JSESSIONID=' + ''
        },
        cutInsideImg: '',
        imgData: null,
        meetFuture: {},
        enShowHomeImg: true, //首次进小程序弹窗
        localStorages: new LocalStorage(), //创建本地储存对象
        updateWaterFallFlow: false, //更新瀑布流数据至最新
        lottieSuccessShow: false,
        statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] * 2,
        navbarHeight: wx.getSystemInfoSync()['statusBarHeight'] * 2 + 90,
        share: false
    },

    data: {

    },
    onLaunch: function(option) {
        //判断是否由分享进入小程序
        this.globalData.share = (option.scene == 1007 || option.scene == 1008);

        //初始化全局本地缓存

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res, "已授权");
                            // 可以将 res 发送给后台解码出 unionId
                            // this.globalData.customer = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })

        //版本强制更新
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate((res) => {
                console.log('有新版本更新吗？', res.hasUpdate);
                //请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(() => {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启小程序?',
                            success: (res) => {
                                if (res.confirm) {
                                    //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate();
                                }
                            }
                        })
                    })

                    updateManager.onUpdateFailed(() => {
                        //新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~~',
                            content: '新版本已经上线啦~请您删除当前小程序，重新搜索打开',
                        })
                    })
                }
            })
        } else {
            //如果希望用户在最新版本的客户端上体验您的小程序，可以这样提示
            wx.showModal({
                title: '提示',
                content: '当前的微信版本过低，无法使用更新功能，请升级到最新微信版本后重试',
            })
        }
    },
	onShow(options) {
        // let option = wx.getLaunchOptionsSync();
		console.log('scene：' + options.scene);
		if (options.scene && (options.scene == 1007 || options.scene == 1008)) {
            this.globalData.share = true
        } else {
            this.globalData.share = false
        }
        // console.log(this.globalData.recommend,"customer");
        // wx.showLoading({
        //   title: '加载中...',
        // })
        // 登录
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
                            console.log(res, "登陆");
                            this.globalData.customer = res.data.customer;
                            this.globalData.sessionId = res.data.sessionId;
                            this.globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId;
                            this.globalData.lottieSuccessShow = res.data.isGet
                            // wx.hideLoading();
                        },
                        fail: (res) => {

                        }
                    });
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
    onHide() {

    }
})