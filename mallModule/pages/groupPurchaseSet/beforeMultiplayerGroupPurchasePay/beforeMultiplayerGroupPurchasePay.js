// pages/beforeMultiplayerGroupPurchasePay/beforeMultiplayerGroupPurchasePay.js
import {
  getActivityInfo,
  queryOrderState,
  createOrderTeam,
  fightGroup
} from '../../../../config/getData'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityData: null,
    activityCover: null,
    purChaseNum: 1,
    totalPrice: 1000,
    disabled: true,
    orders: {},
    queryOrderStateInterval: '', //查询交易订单定时器
    groupId: null,
    prizeId: null,
    orderGroup: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderGroup) {
      this.setData({
        orderGroup: options.orderGroup
      });
    }
    if (options.groupId) {
      this.setData({
        groupId: options.groupId
      });
    }
    if (options.prizeId) {
      this.setData({
        prizeId: options.prizeId
      });
    }
    getActivityInfo(options.activityId).then(e => {
      if (e.code === 0) {
        this.setData({
          activityData: e.data
        }, () => {
          let activityCover = getApp().globalData.serverImg + 'upload/qprize/cover/' + e.data.prizeId + '.png';
          this.setData({
            activityCover: activityCover
          });
        });
      }
    });
  },

  calculateNum: function(e) {
    wx.showLoading({
      title: '加载中...',
    })
    let num = Number(e.currentTarget.dataset.num),
      purChaseNum = this.data.purChaseNum;
    if (purChaseNum + num <= 1) {
      purChaseNum = 1;
      this.setData({
        disabled: true
      });
    } else if (purChaseNum + num >= 51) {
      purChaseNum = 50;
      this.setData({
        disabled: false
      });
    } else {
      purChaseNum = purChaseNum + num;
      this.setData({
        disabled: false
      });
    }
    this.setData({
      purChaseNum: purChaseNum
    }, () => {
      wx.hideLoading();
    });
  },

  queryWxPay: function() {
    // 申明定时器进行定时查询订单
    this.setData({
      queryOrderStateInterval: setInterval(() => {
        queryOrderState(this.data.orders.orderCode).then(e => {
          if (e.state) {
            clearInterval(this.data.queryOrderStateInterval);

            //支付成功
            wx.showModal({
              title: '提示',
              content: '支付成功，点击确定跳转至开团页面',
              showCancel: false,
              success: (e) => {
                if (e.confirm) {
                  wx.navigateTo({
                    url: '../multiplayerGroupPurchase/multiplayerGroupPurchase?activityId=' + this.data.activityId
                  })
                }
              }
            })
          } else {
            //支付失败
            wx.showModal({
              title: '提示',
              content: '支付失败，请重新支付',
              showCancel: false,
              success: (e) => {
                if (e.confirm) {}
              }
            })
          }
        });
      }, 500)
    });
  },

  //创建多人团
  createGroup: function() {
    if (this.data.prizeId) {
      createOrderTeam({
        prizeId: this.data.prizeId
      }).then(e => {
        if (e.code === 0) {
          // 成功下单,调起微信支付
          this.setData({
            orders: {
              orderCode: e.params.outTradeNo
            }
          });
          let order = e.params;
          wx.requestPayment({
            'timeStamp': order.timeStamp,
            'nonceStr': order.nonceStr,
            'package': order.package,
            'signType': 'MD5',
            'paySign': order.paySign,
            success: () => {
              //支付成功，处理相应订单
              this.queryWxPay()
            },
            fail: () => {}
          })
        } else if (e.code === 600) {
          // 跳转手机绑定
          wx.showModal({
            title: '尚未绑定手机',
            content: '是否立即去绑定',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../../../pages/binding-phone/binding-phone'
                })
              }
            }
          })
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '初始化中，请再重新点击',
      })
    }
  },

  //组团
  combinedIntoGroup: function() {
    console.log('prizeId:' + this.data.prizeId);
    console.log('groupId:' + this.data.groupId);
    if (this.data.prizeId && this.data.groupId) {
      fightGroup({
        prizeId: this.data.prizeId,
        groupId: this.data.groupId
      }).then(e => {
        if (e.code === 0) {
          // 成功下单,调起微信支付
          this.setData({
            orders: {
              orderCode: e.params.outTradeNo
            }
          });
          let order = e.params;
          wx.requestPayment({
            'timeStamp': order.timeStamp,
            'nonceStr': order.nonceStr,
            'package': order.package,
            'signType': 'MD5',
            'paySign': order.paySign,
            success: () => {
              //支付成功，处理相应订单
              this.queryWxPay()
            },
            fail: () => {}
          })
        } else if (e.code === 600) {
          // 跳转手机绑定
          wx.showModal({
            title: '尚未绑定手机',
            content: '是否立即去绑定',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../../../pages/binding-phone/binding-phone'
                })
              }
            }
          })
        } else if (e.code === 302) {
          wx.showModal({
            title: '提示',
            content: e.msg,
            success: (res) => {
              if (res.confirm) {
                this.createGroup();
              }
            }
          })
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '初始化中，请再重新点击',
      })
    }
  },

  toActivityDetail: function() {
    wx.navigateTo({
      url: '../groupPurchase/groupPurchase?activityId=' + this.data.activityData.activityId
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.activityData.prizeTitle,
      path: "/mallModule/pages/groupPurchaseSet/groupPurchase/groupPurchase?activityId=" + this.data.activityData.activityId,
      imageUrl: this.data.activityCover,
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