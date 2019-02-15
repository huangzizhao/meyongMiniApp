// pages/future-me/future-me.js

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetFuture: '',
    star1Num:[0,1,2],
    star2Num: [0, 1],
    star3Num:[0],
    shareImgSrc: '',
    cut: {
      x: 0,
      y: 0,
      width: 300,
      height: 550,
    },
    wxAcodeUrl: '',
    hidden : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // this.drawShare();
    setTimeout(function(){
      that.setData({
        hidden : false
      })
    },1000);
  },

  drawShare: function () {
    var that = this;
    var star = [];
    var star2 = [];
    var star3 = [];
    var length = parseInt(Math.random() * 2.8 + 7);
    star.length = parseInt(length / 2);
    star3.length = length % 2 == 1 ? 1 : 0;
    star2.length = 5 - star.length - star3.length;
    this.setData({
      meetFuture: getApp().globalData.meetFuture,
      star1Num: star,
      star2Num: star2,
      star3Num: star3
    })
    // //1. 请求后端API生成小程序码
    wx.request({
      url: getApp().globalData.server + "customer/getWxAcode",
      data: {
        path: "/page/index/home"
      },
      header: getApp().globalData.header,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          wxCodePath: res.data
        })
        wx.hideLoading();
        const ctx = wx.createCanvasContext('myCanvas');
        var background = "../../img/background.png";
        var star1Img = "../../img/star-1.png";
        var star2Img = "../../img/star-2.png";
        var star3Img = "../../img/star-3.png";
        var imgPath = getApp().globalData.cutInsideImg;
        // var imgPath = "../../img/test.jpg";
        var wxCodePath = res.data;
        // var wxCodePath = "../../img/wxCode.png";
        wx.getImageInfo({
          src: wxCodePath,
          success: function (res) {
            wxCodePath = res.path;
            wx.getImageInfo({
              src: imgPath,
              success: function (res) {
                
            ctx.drawImage(background, 0, 0, 300, 400);

            ctx.setFontSize(18)
            ctx.setLineWidth(0.5)
            ctx.setFillStyle('#000')
            ctx.fillText('你好，' + getApp().globalData.customer.name, 25, 40)
            ctx.strokeText('你好，' + getApp().globalData.customer.name, 25, 40)
            //图片边三个圆
            ctx.arc(150, 180, 80, 0, 2 * Math.PI)
            ctx.setStrokeStyle('#f7bc49')
            ctx.stroke()

            ctx.beginPath();
            ctx.setLineWidth(20)
            ctx.arc(150, 180, 62, 0, 2 * Math.PI)
            ctx.setStrokeStyle('rgba(247,188,73,0.2)')
            ctx.stroke()

            ctx.beginPath();
            ctx.setLineWidth(3)
            ctx.arc(150, 180, 62, 0, 2 * Math.PI)
            ctx.setStrokeStyle('#f7bc49')
            ctx.stroke()

            ctx.setFontSize(13)
            ctx.setLineWidth(0.5)
            ctx.setFillStyle('#000')
            ctx.fillText('这是您的颜值报告~', 25, 65)

            ctx.setLineWidth(1);
            ctx.setStrokeStyle("#fff");
            that.roundRect(ctx, 0, 290, that.data.cut.width, 260, 10).stroke();

            wx.drawCanvas({
              canvasId: 'myCanvas',
              actions: ctx.getActions(),
              reserve: true
            })

            ctx.save();
            ctx.beginPath();
            ctx.arc(150, 180, 60, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(imgPath, 75, 120, 144, 162);
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(150, 180, 62, 0, 2 * Math.PI)
            ctx.setFillStyle('rgba(0,0,0,0.7)');
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.beginPath();
            ctx.arc(150, 180, 60, 0, Math.PI * 2);
            ctx.drawImage("../../img/cover.png", 105, 130, 90, 90);
            ctx.closePath();
            

            ctx.setFontSize(12)
            ctx.setLineWidth(0.5)
            ctx.setFillStyle('#BBBBBB')
            ctx.fillText('您在好友中的颜值杀伤力', 85, 330)

            //星星个数
            for (var i = 0; i < star.length;i++){
              ctx.drawImage(star1Img, 85 + i*28, 350, 18, 18);
            }
            for (var i = 0; i < star3.length; i++) {
              ctx.drawImage(star3Img, 85 + (star.length + i) * 28, 350, 18, 18);
            }
            for (var i = 0; i < star2.length; i++) {
              ctx.drawImage(star2Img, 85 + (star.length + star3.length + i) * 28, 350, 18, 18);
            }

            //颜值杀伤力 两条线
            ctx.moveTo(30, 325)
            ctx.lineTo(75, 325)
            ctx.moveTo(225, 325)
            ctx.lineTo(270, 325)
            ctx.setStrokeStyle("#BBBBBB")
            ctx.stroke()
            ctx.closePath();
            ctx.drawImage(wxCodePath, (that.data.cut.width - 130) / 2, 380, 130, 130);

            ctx.setFillStyle('#000')
            ctx.fillText('你也来测一测你的颜值战斗力吧~', 65, 525)

            ctx.setFillStyle('#BBBBBB')
            ctx.setFontSize(11)
            ctx.fillText('（长按识别图中小程序码）', 80, 540)


            wx.drawCanvas({
              canvasId: 'myCanvas',
              actions: ctx.getActions(),
              reserve: true
            })
          }
          
            })
          }
        });
      }
    })
  },
  onShare: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300 * 8,
      height: 550 * 8,
      destWidth: 300 * 8,
      destHeight: 550 * 8,
      canvasId: 'myCanvas',
      success: function (res) {
        that.setData({
          shareImgSrc: res.tempFilePath
        })
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function (res) {
      }
    })
  },
  closeCs:function() {
    this.setData({
      onShowCs: false
    })
  },
  roundRect: function (ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.setFillStyle('#fff')
    ctx.fill();
    ctx.closePath();
    return ctx;
  },
  goBack: function () {
    wx.navigateTo({
      url: '../index/home',
    })
  },
  saveImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 550,
      destWidth: 300,
      destHeight: 500,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          shareImgSrc: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImgSrc,
          success(res) {
            wx.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，去发圈噻~',
              showCancel: false,
              confirmText: '好哒',
              confirmColor: '#72B9C3',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
                that.hideShareImg()
              }
            })
          }
        })
      },
      fail: function (res) {
      }
    })
    
  },
  cancel: function() {
    this.setData({
      hidden:true
    })
  }
})