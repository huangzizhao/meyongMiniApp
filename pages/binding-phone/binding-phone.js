// pages/binding-phone/bingding-phone.js
import {
  sendVerificationCode,
  bindMobile
} from '../../config/getData'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onBack: true,
    vaCode: '',
    mobile: '',
    codeText: '获取验证码',
    enGetCode: true,
    abledClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.onBack, "onBack");
    if (options.onBack != null) {
      this.setData({
        onBack: false
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

  },
  phoneVerification: function(mobile) {
    let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    return myreg.test(mobile)
  },
  getCode: function() {
    if (this.data.enGetCode) {
      this.setData({
        enGetCode: false
      })
      let mobile = this.data.mobile;
      if (this.phoneVerification(mobile)) {
        sendVerificationCode({
          mobile: mobile
        }).then(e => {
          if (e.code != 500) {
            let codeNum = 59;
            this.setData({
              vaCode: e.code,
              codeText: "60s后重试"
            })
            let codeInterval = setInterval(() => {
              if (codeNum != 0) {
                this.setData({
                  codeText: codeNum + "s后重试"
                })
                codeNum--;
              } else {
                clearInterval(codeInterval);
                this.setData({
                  codeText: "获取验证码",
                  enGetCode: true,
                })
              }
            }, 1000);
            wx.showToast({
              title: '发送成功！',
              icon: 'success',
              duration: 1000,
              mask: true,
            })
          }else{
            wx.showToast({
              title: e.msg,
              icon: 'none',
              duration: 1000
            });
            this.setData({
              enGetCode: true
            })
          }
        });
      } else {
        wx.showToast({
          title: '手机号输入有误',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        this.setData({
          enGetCode: true
        })
      }
    }
  },
  formSubmit: function(e) {
    let mobile = e.detail.value.mobile;
    let code = e.detail.value.code;
    if (this.phoneVerification(mobile)) {
      if (mobile == this.data.mobile) {
        if (code == this.data.vaCode && code.length > 0) {
          bindMobile({
            mobile: mobile
          }).then(e => {
            if (e.code === 0) {
              getApp().globalData.customer.phone = mobile;
              if (this.data.onBack) {
                wx.navigateBack({
                  delta: 1,
                })
              } else {
                wx.navigateTo({
                  url: '../future-me/future-me'
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: '验证码输入错误',
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      } else {
        wx.showToast({
          title: '手机号与发送短信的不一致',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    } else {
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
  },
  realnameConfirm: function(e) {
    if (this.phoneVerification(e.detail.value)) {
      this.setData({
        abledClick: true,
        mobile: e.detail.value
      });
    } else {
      this.setData({
        abledClick: false,
        mobile: e.detail.value
      });
    }
  }
})