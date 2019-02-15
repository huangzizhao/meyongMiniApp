/**
 * Created by sail on 2017/6/1.
 */
import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight-48

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 0,
        y: (height - width ) /3,
        width: width,
        height: width,
      }
    },
    imgUrl:'',
    enArticleType:false
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    var that = this;
    wx.showLoading({
      title: '正在识别...',
      mask: true,
    });
    this.wecropper.getCropperImage((src) => {
      if (src) {
        getApp().globalData.cutInsideImg = src;
        wx.uploadFile({
          url: getApp().globalData.server +'analysis', //仅为示例，非真实的接口地址
          filePath: src,
          name: 'uploadFile',
          dataType:'json',
          header:getApp().globalData.header,
          success: function (res) {
            wx.hideLoading();
            var data = JSON.parse(res.data);
            if (data.code != 200){
              wx.showToast({
                title: data.message,
                icon:'none',
                duration: 2000,
                mask: true
              })
            }else {
              getApp().globalData.imgData = data.data;
              if (getApp().globalData.customer.birthday == null) {
                wx.navigateTo({
                  url: '../basic-choose/basic-choose'
                })
              } else if (!that.data.enArticleType) {
                wx.navigateTo({
                  url: '../content-type/content-type'
                })
              } else {
                wx.navigateTo({
                  url: '../animation/animation'
                })
              }
            }
            //do something
          },
          fail: function (err){
            wx.showToast({
              title: '识别失败，请稍后重试！',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  cameraTap () {
    const that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        that.wecropper.pushOrign(src);
        that.setData({
          imgUrl:src
        })
      }
    })
  },
  onLoad:function (option) {
    this.enInterested();
    const { cropperOpt } = this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
    this.wecropper.pushOrign(option.src);
    this.setData({
      imgUrl: option.src
    })
  },
  enInterested:function () {
      var that = this;
      wx.request({
        url: getApp().globalData.server + "article/enHaveArticleType",
        header: getApp().globalData.header,
        method: 'GET',
        success: function(res) {
          that.setData({
            enArticleType : res.data
          })
        }
      })
  }
})
