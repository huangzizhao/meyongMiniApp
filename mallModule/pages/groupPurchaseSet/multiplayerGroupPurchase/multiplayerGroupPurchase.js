// pages/beforeDoubleGroupPurchase/beforeDoubleGroupPurchase.js
import {
    getPurchaseInfoByOrderId,
    getPurchaseInfoByActivityId,
    getMorePrizes
} from '../../../../config/getData'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        activityData: null,
        activityCover: null,
        orderGroup: [],
        otherProjectList: [],
        stateTitle: '',
        orderIdIndex: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu();
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        if (options.orderId) {
            let url = "qpActivity/prizeDetail/" + options.orderId;
            console.log('orderId:' + options.orderId);
            this.getData(0, options.orderId);

        } else if (options.activityId) {
            let url = "qActivity/qActivityInfo/" + options.activityId;
            console.log('activityId:' + options.activityId);
            this.getData(1, options.activityId);

        }

    },
    getData: function(index, id) {
        switch (index) {
            case 0:
                var httpList = getPurchaseInfoByOrderId(id);
                break;
            case 1:
                var httpList = getPurchaseInfoByActivityId(id);
                break;
            default:
                break;
        }
        httpList.then(e => {
            if (e.code === 0) {
                for (let i = 0; i < e.data.qorderGroup.members.length; i++) {
                    if (e.data.qorderGroup.members[i].orderId === e.data.qorderGroup.currentId) {
                        this.setData({
                            orderIdIndex: i
                        });
                        break;
                    }
                }
                this.setData({
                    activityData: e.data
                });
                let activityCover = getApp().globalData.serverImg + 'upload/qprize/cover/' + e.data.qprizeEntity.prizeId + '.png';
                this.setData({
                    activityCover: activityCover
                });
                // if (e.data.data.qOrderGroup.groupNum - e.data.data.qOrderGroup.members.length > 0) {
                let orderGroup = Array(),
                    title = '';
                for (let i = 0; i < e.data.qorderGroup.groupNum; i++) {
                    if (e.data.qorderGroup.members[i]) {
                        orderGroup.push(e.data.qorderGroup.members[i]);
                    } else {
                        orderGroup.push({
                            avatar: '../../img/avatar.png'
                        });
                    }
                }
                if (e.data.qorderGroup.groupNum - e.data.qorderGroup.members.length > 0) {
                    title = '还差' + (e.data.qorderGroup.groupNum - e.data.qorderGroup.members.length) + '人即可拼团成功';
                } else if (e.data.qorderGroup.groupNum - e.data.qorderGroup.members.length === 0) {
                    title = '满员，拼团成功';
                }
                this.setData({
                    orderGroup: orderGroup,
                    stateTitle: title
                });
                // }
                return e;
            }

        }).then(e => {
            getMorePrizes(e.data.qprizeEntity.prizeId).then(e => {
                if (e.code === 0) {
                    e.data.forEach((e) => {
                        e.coverPath = getApp().globalData.serverImg + e.coverPath
                    });
                    this.setData({
                        otherProjectList: e.data
                    }, () => {
                        wx.hideLoading();
                    });
                }
            })
        });
    },
    toActivityDetail: function() {
        if (this.data.activityData.activityId) {
            wx.navigateTo({
                url: '../groupPurchase/groupPurchase?activityId=' + this.data.activityData.activityId + '&groupId=' + this.data.activityData.qorderGroup.orderGroupId
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '当前活动项目已结束',
                showCancel: false
            })
        }
    },

    toProject: function(e) {
        let projectId = e.currentTarget.dataset.id;
        if (projectId) {
            wx.navigateTo({
                url: '../groupPurchase/groupPurchase?activityId=' + projectId
            })
        } else {
            wx: wx.showModal({
                title: '温馨提示',
                content: '再试一次~',
                showCancel: false
            })
        }
    },

    intoOrder: function() {
        if (this.data.activityData.activityId) {
            wx.navigateTo({
                url: '../groupPurchase/groupPurchase?activityId=' + this.data.activityData.activityId + '&groupId=' + this.data.activityData.qorderGroup.orderGroupId
            })
        } else {
            wx: wx.showModal({
                title: '温馨提示',
                content: '当前活动项目已结束',
                showCancel: false
            })
        }
    },
    intoBargain: function() {
        wx.navigateTo({
            url: '../../../pages/bargainSet/bargain/bargain?orderId=' + this.data.activityData.qorderGroup.members[this.data.orderIdIndex].orderId
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
        wx.hideShareMenu();
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
    onShareAppMessage: function(e) {
        return {
            title: '您的好友邀你一起来拼' + e.target.dataset.prizetitle + '￥' + e.target.dataset.prize,
            path: '/mallModule/pages/notificationList/notificationList?groupId=' + this.data.activityData.qorderGroup.orderGroupId,
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