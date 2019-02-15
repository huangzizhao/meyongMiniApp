// pages/lottery/lottery.js
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: width,
    height: height,
    animations:{
      animation0: '',
      animation1: '',
      animation2: '',
      animation3: '',
      animation4: '',
      animation5: '',
      animation6: '',
      animationWxm: ''
    },
    gifts:[],
    isClick: false,
    lotteried: false,
    hiddenBind: true,
    hidden: true,
    winGift: null,
    enShare: false,
    showContact: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: getApp().globalData.server + "activity/currentActivity",
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.activity != null) {
          that.setData({
            gifts: res.data.activity.gifts
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (getApp().globalData.customer.phone != null){
      if (this.data.winGift != null && !this.data.hiddenBind){
        this.setData({
          hiddenBind: true,
          showContact: true
        });
      }
    }
  },

  drawLucky: function () {
    var that = this;
    var gifts = that.data.gifts;
    for (var i = 0; i < gifts.length; i++){
      gifts[i].imgsUrl = "https://wx.meyoungmia.com/upload/card/beim.png";
    }
    that.setData({
      gifts: gifts,
      isClick: true
    })
    this.animation0 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animation1 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animation2 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animation3 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animation4 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animation5 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animation6 = wx.createAnimation({ duration: 300, timingFunction: 'linear', delay: 300 });
    this.animationWxm = wx.createAnimation({ duration: 3000, timingFunction: 'linear'});

    this.animation0.translate(100, 67.5).step({ duration: 300 }).translate(0, 0).step({ duration: 300})
    this.animation1.translate(0, 127.5).step({ duration: 300 }).translate(0, 0).step({ duration: 300, delay: 600 })
    this.animation2.translate(-100, 67.5).step({ duration: 300 }).translate(0, 0).step({ duration: 300, delay: 900 })
    this.animation3.translate(100, -80.5).step({ duration: 300 }).translate(0, 0).step({ duration: 300, delay: 1200 })
    this.animation4.translate(0, 0).step({ duration: 300 }).translate(0, 0).step({ duration: 300 })
    this.animation5.translate(-100, -80.5).step({ duration: 300 }).translate(0, 0).step({ duration: 300, delay: 1500 })
    this.animation6.translate(0, -127.5).step({ duration: 300 }).translate(0, 0).step({ duration: 300, delay: 1800 })
    this.animationWxm.rotate(720).step()

    this.setData({
      //输出动画
      animations:{
        animation0: this.animation0.export(),
        animation1: this.animation1.export(),
        animation2: this.animation2.export(),
        animation3: this.animation3.export(),
        animation4: this.animation4.export(),
        animation5: this.animation5.export(),
        animation6: this.animation6.export(),
        animationWxm: this.animationWxm.export()
      }        
    });
    setTimeout(function(){
      that.showResult();
    },3000)
  },

  showResult:function (event) {
      wx.showLoading();
      var that = this;
      wx.request({
        url: getApp().globalData.server + "activity/lottery?random="+Math.random(),
        header: getApp().globalData.header,
        method: 'GET',
        dataType: 'json',
        success: function(res) {
          if (res.data.code == 200){
            var imgsUrl = res.data.data.imgsUrl;
            var gifts =  that.data.gifts;
            gifts[4].imgsUrl = imgsUrl;
            that.setData({
              gifts:gifts,
              animations:null,
              winGift: res.data.data,
              hidden: false
            })
          }else {
            wx.showModal({
              // title: tip,
              content: res.data.message,
              showCancel: false,//去掉取消按钮
            })
          }
          wx.hideLoading();
        }
      })
  },

  closePacket: function () {
    this.setData({
      hidden : true
    })
    if (!this.data.enShare){
      this.cancelBind();
    }
    
  },
  //取消绑定，清除奖品
  cancelBind:function () {
    //数据库删除
    wx.request({
      url: getApp().globalData.server + "activity/giveUpGift",
      header: getApp().globalData.header,
      method: 'GET',
      dataType: 'json'
    })
    this.setData({
      hiddenBind: true
    })
  },
  //同意绑定
  agreeBind:function () {
    wx.navigateTo({
      url: '../binding-phone/binding-phone'
    })
  },
  onShareAppMessage: function () {
    var that= this;
    if (that.data.winGift == null || that.data.winGift.giftType == 2) {
      return {
        path: "/pages/index/home", 
      };
    }
    return {
      title: '抽奖赢奖品',
      path: "/pages/index/home",
      imageUrl: "../../img/logo.jpg",
      success: function (res) {
        that.setData({
          hidden: true
        });
        var customer = getApp().globalData.customer;
        if (customer.phone == null) {
          that.setData({
            hiddenBind: false
          })
        } else {
          that.setData({
            showContact: true
          })
        }
      },
      fail: function (res) {
      }
    };
  },
  cancel: function () {
    this.setData({
      showContact: false
    })
  }
})