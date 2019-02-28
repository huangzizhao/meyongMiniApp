// pages/index/home.js
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight
import {
  getBindRecommendUser,
  getObtainNearestActivityInfo,
  getPurchaseInformation
} from '../../config/getData'
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

    switchTab: '',
    more: '',
    noData: false,

    participateAvatar: '../../img/avatar.png',
    participateUserName: '',
    participateTime: 0,
    announcementList: [],
    queryPurchaseInterval: '', //查询参与活动定时器
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 700
  },

  switchTabChange(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      more: '',
      noData: false,
      switchTab: tab
    });
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
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
    var getArticle = setInterval(() => {
      var sessionId = getApp().globalData.sessionId
      if (sessionId != '') {
        this.setData({
          switchTab: 'latest'
        });
        clearInterval(getArticle);
      }
    }, 10);
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
    if (getApp().globalData.updateWaterFallFlow) {
      getApp().globalData.updateWaterFallFlow = false;
      this.setData({
        switchTab: this.data.switchTab
      });
    }
    // 获取参与活动信息
    // this.getNotices();

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
  getWaterFallFlowData(e) {
    if (e.detail.length === 0) {
      this.setData({
        noData: true
      });
    }
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
  toPromotion(e) {
    let pageName = e.currentTarget.dataset.pagename;
    wx.navigateTo({
      url: '/pages/promotion/promotion?pageName=' + pageName
    })
  },

  openActivity: function() {
    wx.navigateTo({
      url: '../pictionary/pictionary'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    console.log(this.data.switchTab);
    this.setData({
      switchTab: this.data.switchTab
    },()=>{
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    });
    // wx.showNavigationBarLoading();
    // this.setData({
    //   pageUtil: {
    //     page: 1,
    //     limit: 10,
    //     order: '',
    //     sidx: ''
    //   },
    //   totalPage: -1,
    //   enBottom: false
    // });

    // var getArticle = setInterval(() => {
    //   var sessionId = getApp().globalData.sessionId
    //   if (sessionId != '') {
    //     getWaterFallFlow(JSON.stringify(this.data.pageUtil)).then(e => {
    //       if (e.code === 0) {
    //         let view = this.selectComponent('#waterFallFlow');
    //         view.loadMore(true, e.res.list);
    //         wx.stopPullDownRefresh();
    //         wx.hideNavigationBarLoading();
    //       }
    //     });
    //     clearInterval(getArticle);
    //   }
    // }, 10);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    //用时间戳产生不重复的随机数
    this.setData({
      more: new Date().getTime()
    })
  },

  getInitQuery: function() {
    getObtainNearestActivityInfo().then(e => {
      if (e.code === 0) {
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
  intoArticlePush(e) {
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