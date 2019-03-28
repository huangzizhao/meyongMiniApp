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
    hidden: true,
    winGift: null,
    enShare: false,
    showContact: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: getApp().globalData.server + "activity/currentActivity",
      method: 'GET',
      dataType: 'json',
      success:(res)=> {
        wx.hideLoading();
        if (res.data.activity != null) {
          this.setData({
            gifts: res.data.activity.gifts
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (getApp().globalData.customer.phone != null){
      if (this.data.winGift != null){
        this.setData({
          showContact: true
        });
      }
    }
  },

  drawLucky() {
    var gifts = this.data.gifts;
    for (var i = 0; i < gifts.length; i++){
      gifts[i].imgsUrl = "https://wx.meyoungmia.com/upload/card/beim.png";
    }
    this.setData({
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
    setTimeout(()=>{
      this.showResult();
    },3000)
  },

  showResult(event) {
      wx.showLoading();
      wx.request({
        url: getApp().globalData.server + "activity/lottery?random="+Math.random(),
        header: getApp().globalData.header,
        method: 'GET',
        dataType: 'json',
        success:(res)=> {
          if (res.data.code == 200){
            var imgsUrl = res.data.data.imgsUrl;
            var gifts =  this.data.gifts;
            gifts[4].imgsUrl = imgsUrl;
            this.setData({
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

  closePacket() {
    this.setData({
      hidden : true
    })
    if (!this.data.enShare){
      this.cancelBind();
    }
    
  },
  //取消绑定，清除奖品
  cancelBind() {
    //数据库删除
    wx.request({
      url: getApp().globalData.server + "activity/giveUpGift",
      header: getApp().globalData.header,
      method: 'GET',
      dataType: 'json'
    })
  },

  onShareAppMessage() {
    if (this.data.winGift == null || this.data.winGift.giftType == 2) {
      return {
        path: "/pages/index/home", 
      };
    }
    return {
      title: '抽奖赢奖品',
      path: "/pages/index/home",
      imageUrl: "../../img/logo.jpg",
      success: (res)=> {
        this.setData({
          hidden: true
        });
        var customer = getApp().globalData.customer;
        if (customer.phone == null) {
		  wx.showModal({
			  title:'提示',
			  content:'奖品只有绑定手机后才能领取哦 \r\n 您尚未绑定手机，请前往绑定 \r\n 注意：取消绑定将会使奖品失效',
			  success:(res)=>{
				  if(res.confirm){
					  wx.navigateTo({
						  url: '../binding-phone/binding-phone'
					  })
				  }else{
					  this.cancelBind();
				  }
			  }
		  });
        } else {
          this.setData({
            showContact: true
          })
        }
      },
      fail:(res)=> {
      }
    };
  },
  cancel() {
    this.setData({
      showContact: false
    })
  }
})