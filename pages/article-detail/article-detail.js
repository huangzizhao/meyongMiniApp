// pages/article-detail/article-detail.js
import {
    getArticleById,
    getSameTagArticles,
    changeUrlString,
    toVideoUrls,
    upThumb,
    review,
    getReviewList,
    follow,
    cancelFollow,
    collectionArticle,
    cancelCollectionArticle
} from '../../config/getData'
var lotties = require('../../utils/lotties/lotties.js');
// var WxParse = require('../../components/wxParse/wxParse.js');
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lottieLikeData: null,
        // 触摸开始时间
        touchStartTime: 0,
        // 触摸结束时间
        touchEndTime: 0,
        // 最后一次单击事件点击发生时间
        lastTapTime: 0,
        // 单击事件点击后要触发的函数
        lastTapTimeoutFunc: null,

        uploadReviewIndex: null,
        pointerSubscript: 0,
        articleId: '',
        loading: false,
        // recommend: [],

        width: width,
        autoplay: false,
        circular: false,
        interval: 5000,
        duration: 400,
        custom: null,
        autoFocus: false,
        adjustPosition: true,
        showPostComment: false,
        commentArticleId: '',

        notesList: [{
            article: {},
            swiperCurrent: 0,
            articleId: '',
            commentListData: {},
            highQualityReview: [],
            reviewPageUtil: {
                page: 1,
                limit: 10,
                order: '',
                sidx: '',
                articleId: ''
            }
        }],
        pageUtil: {
            page: 1,
            limit: 1,
            order: '',
            sidx: '',
            articleId: ''
        },
        noneResult: false,
        totalPage: 2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.setData({
        //     lottieLikeData: lotties.lottieLikeData
        // });
        wx.hideShareMenu();
        this.data.pageUtil.articleId = options.articleId;
        this.data.articleId = options.articleId;
        getArticleById({
            articleId: options.articleId
        }).then(res => {
            if (res.code === 0) {
                if (res.article.lowLevel) {
                    res.article.lowLevel.forEach(e => {
                        if (e.length > 0) {
                            res.article.album.push(...e);
                        }
                    });
                }
                if (res.article.highLevel) {
                    res.article.highLevel.forEach(e => {
                        if (e.length > 0) {
                            res.article.album.push(...e);
                        }
                    });
                }
                let article = res.article;
                // this.getRecommend(article.articleTypeId, options.articleId);
                this.setData({
                    [`notesList[0].article`]: article
                }, () => {
                    this.loadMore();
                });
            }
        });

        var getCustomer = setInterval(() => {
            var customer = getApp().globalData.customer
            if (getApp().globalData.sessionId != null && customer != null) {
                this.setData({
                    customer: customer
                });
                clearInterval(getCustomer);
            }
        }, 100);
    },
    touchStart(e) {
        this.setData({
            touchStartTime: e.timeStamp
        })
    },
    touchEnd(e) {
        this.setData({
            touchEndTime: e.timeStamp
        })
    },
    likeByDoubleClick(e) {
        var index = e.currentTarget.dataset.index;
        // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
        if (this.data.touchEndTime - this.data.touchStartTime < 350) {
            //当前点击时间

            var currentTime = e.timeStamp;
            var lastTapTime = this.data.lastTapTime;
            //更新最后一次点击时间
            this.setData({
                lastTapTime: currentTime
            });

            //如果两次点击事件时间在300毫秒内，则认为是点击事件
			console.log('currentTime:' + currentTime + ',' + 'lastTapTime:' + lastTapTime);
            if (currentTime - lastTapTime < 300) {
                console.log('双击');
                //成功触发双击事件时，取消单击事件的执行
                clearTimeout(this.lastTapTimeoutFunc);

                let list = [];
				list = list.concat(this.data.notesList[index].article.favIcon);

                let listIndex = list.length;
                list.push({
                    left: 0,
                    top: 0,
                    likeIcon: false
                })

				list[listIndex].left = e.touches[0].clientX - 15;
				list[listIndex].top = e.touches[0].clientY - 15;
				list[listIndex].likeIcon = true;

                this.setData({
					[`notesList[${index}].article.favIcon`]: list
                })
                if (this.data.notesList[index].article.star === 0) {
                    this.cilckGood(e);
                }
				setTimeout(()=>{
					wx.getUserInfo({
						success:(res)=>{
							const userInfo = res.userInfo;
							const customer = getApp().globalData.customer;

							if (this.data.notesList[index].article.star != 1) {
								if (userInfo) {
									if (customer == null) {
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
															this.checkBindingPhoneBeforeLikeIt(customer, userInfo, index);
														}
													});
												}
											}
										});
									} else {
										this.checkBindingPhoneBeforeLikeIt(customer, userInfo, index);
									}
								}
							}
						},
						fail:(res)=>{
							wx.showModal({
								title: '提示',
								content: '1、可能点击过于频繁，请稍后再试\r\n2、如未授权请点击下方的喜欢按钮，进行授权登陆',
								showCancel:false
							})
						}
					})
				},0);

                setTimeout(() => {
                    list = [];
                    this.setData({
                        favIcon: list
                    })
                }, 1000);

                // this.setData({
                // 	[`notesList[${index}].article.likeAnimation`]: false
                // }, () => {
                // 	this.setData({
                // 		[`notesList[${index}].article.likeAnimation`]: true
                // 	}, () => {
                // 		setTimeout(() => {
                // 			this.setData({
                // 				[`notesList[${index}].article.likeAnimation`]: false
                // 			})

                // 			if (this.data.notesList[index].article.star === 0) {
                // 				this.cilckGood(e);
                // 			}
                // 		}, 3000);
                // 	})
                // });
            }
        }
    },
    ellipsis(e) {
        var ellipsisIndex;
        if (typeof(e) === 'number') {
            ellipsisIndex = e;
            console.log(ellipsisIndex);
        } else {
            ellipsisIndex = e.currentTarget.dataset.ellipsisindex;
        }
        var query = wx.createSelectorQuery();
        query.select('#notesText' + ellipsisIndex).boundingClientRect((rect) => {
            console.log('高度：' + rect.height);
            if (rect.height < 90 && !this.data.notesList[ellipsisIndex].article.showEllipsis) {
                this.setData({
                    [`notesList[${ellipsisIndex}].article.ellipsis`]: false,
                    [`notesList[${ellipsisIndex}].article.showEllipsis`]: false
                });
            } else {
                var ellipsis = !this.data.notesList[ellipsisIndex].article.ellipsis;
                this.setData({
                    [`notesList[${ellipsisIndex}].article.ellipsis`]: ellipsis,
                    [`notesList[${ellipsisIndex}].article.showEllipsis`]: true
                });
            }
        }).exec();
    },
    loadMore() {
        if (this.isLocked()) {
            return;
        }
        if (this.hasMore()) {
            this.locked();
            getSameTagArticles(this.data.pageUtil).then(res => {
                if (res.code === 0) {
                    // let content = res.data.list.content;
                    if (res.data.list.lowLevel) {
                        res.data.list.lowLevel.forEach(e => {
                            if (e.length > 0) {
                                res.data.list.album.push(...e);
                            }
                        });
                    }
                    if (res.data.list.highLevel) {
                        res.data.list.highLevel.forEach(e => {
                            if (e.length > 0) {
                                res.data.list.album.push(...e);
                            }
                        });
                    }
                    this.data.totalPage = res.data.totalPage;
                    this.data.pageUtil.page++;
                    this.unLocked();
                    var newList = res.data.list.map(e => {
                        var convert = {
                            article: e
                        };
                        return convert;
                    });
                    this.data.notesList.push(...newList);
                    // this.data.pointerSubscript = this.data.notesList.length;

                    for (let i = this.data.pointerSubscript; i < this.data.notesList.length; i++) {
                        let content = this.data.notesList[i].article.content;

						this.data.notesList[i].article.left= 0;
						this.data.notesList[i].article.top= 0;
						this.data.notesList[i].article.likeIcon= false;
						this.data.notesList[i].article.favIcon=[];

                        this.data.notesList[i].article.ellipsis = false;
                        this.data.notesList[i].article.showEllipsis = false;
                        this.data.notesList[i].swiperCurrent = 0;
                        this.data.notesList[i].reviewPageUtil = {
                            page: 1,
                            limit: 10,
                            order: '',
                            sidx: '',
                            articleId: this.data.notesList[i].article.articleId
                        }
                        this.getReviewList(i);
                        if (content.length != 0) {
                            content = content.replace(/section/g, "div");
                            content = content.replace(/header/g, "div");
                            content = content.replace(/&amp;/g, "&");
                            content = content.replace(/&lt;/g, "<");
                            content = content.replace(/&gt;/g, ">");
                            content = content.replace(/&#39;/g, "\'");
                            content = content.replace(/&quot;/g, "\"");
                            content = content.replace(/&amp;nbsp;/g, ' ');
                            content = content.replace(/&nbsp;/g, ' ');
                            this.data.notesList[i].article.content = content;
                        }
                        if (content.indexOf('<my-v>') != -1) {
                            let vid = content.substring(content.indexOf("<my-v>") + "<my-v>".length, content.indexOf("</my-v>"));
                            this.getVideoInfo(vid, i);
                        } else {
                            this.setData({
                                notesList: this.data.notesList
                            }, () => {
                                this.ellipsis(i);
                            })
                            // WxParse.wxParse('articles' + i, 'html', content, this, 5);
                        }
                    }
                    this.data.pointerSubscript = this.data.notesList.length;
                }
            }, () => {
                this.unLocked();
            });
        }
    },
    swiperChange(e) {
        let index = e.currentTarget.dataset.index;
        if (e.detail.source === 'touch') {
            //防止swiper控件卡死
            if (e.detail.current == 0 && this.data.notesList[index].swiperCurrent > 1) {
                this.setData({
                    [`notesList[${index}].swiperCurrent`]: this.data.notesList[index].swiperCurrent
                });
            } else {
                //正常轮播时，记录正确页码索引
                this.setData({
                    [`notesList[${index}].swiperCurrent`]: e.detail.current
                });
            }
        }
    },
    getVideoInfo(vid, index) {
        let urlString = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;

        changeUrlString({
            url: urlString
        }).then(e => {
            let dataJson = e.data.replace(/QZOutputJson=/, '') + "qwe";
            let dataJson1 = dataJson.replace(/;qwe/, '');
            let data = JSON.parse(dataJson1);
            let fn_pre = data.vl.vi[0].lnk;
            let host = data['vl']['vi'][0]['ul']['ui'][0]['url'];
            let streams = data['fl']['fi'];
            let seg_cnt = data['vl']['vi'][0]['cl']['fc'];
            if (parseInt(seg_cnt) === 0) {
                seg_cnt = 1
            }
            let best_quality = streams[streams.length - 1]['name'];
            // console.log(best_quality);
            let part_format_id = streams[streams.length - 1]['id'];

            for (let i = 1; i < (seg_cnt + 1); i++) {
                let filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
                // console.log(filename);
                // pageArr.push(i);
                // this.requestVideoUrls(part_format_id, vid, filename, 'index' + i, host);
                this.requestVideoUrls(part_format_id, vid, filename, index, host);
            }
        });
    },
    requestVideoUrls(part_format_id, vid, fileName, index, host) {
        let keyApi = "https://vv.video.qq.com/getkey?otype=json&platform=11&format=" + part_format_id + "&vid=" + vid + "&filename=" + fileName + "&appver=3.2.19.333";
        toVideoUrls({
            url: keyApi
        }).then(e => {
            let dataJson = e.data.replace(/QZOutputJson=/, '') + "qwe";
            let dataJson1 = dataJson.replace(/;qwe/, '');
            let data = JSON.parse(dataJson1);
            if (data.key !== undefined) {
                let vkey = data['key'];
                let url = host + fileName + '?vkey=' + vkey;
                this.data.notesList[index].article.content = "<video  control src='" + url + "' type='video / x - ms - asf - plugin' width='550' height='400' autostart='false' loop='true' />";
                this.setData({
                    notesList: this.data.notesList
                })
                // WxParse.wxParse('articles' + index, 'html', "<video  control src='" + url + "' type='video / x - ms - asf - plugin' width='550' height='400' autostart='false' loop='true' />", this, 5);
            }
        });
    },
    //   getRecommend: function(typeId, articleId) {
    //     wx.request({
    //       url: getApp().globalData.server + "article/getDetailRecommend",
    //       header: getApp().globalData.header,
    //       data: {
    //         typeId: typeId,
    //         articleId: articleId
    //       },
    //       method: 'GET',
    //       success: (res) => {
    //         if (res.data.res != null) {
    //           this.setData({
    //             recommend: res.data.res
    //           })
    //         }
    //       },
    //     })
    //   },
    // openArticle: function(event) {
    //     var articleId = event.currentTarget.dataset.id;
    //     if (articleId != null) {
    //         wx.navigateTo({
    //             url: 'article-detail?articleId=' + articleId
    //         })
    //     }
    // },
    cilckGood(e) {
        const index = e.currentTarget.dataset.index;
        const userInfo = e.detail.userInfo;
        const customer = getApp().globalData.customer;

        if (this.data.notesList[index].article.star != 1) {
            if (userInfo) {
                if (customer == null) {
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
                                        this.checkBindingPhoneBeforeLikeIt(customer, userInfo, index);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    this.checkBindingPhoneBeforeLikeIt(customer, userInfo, index);
                }
            }
        }
    },
    checkBindingPhoneBeforeLikeIt(customer, userInfo, index) {
        if (customer.phone) {
            this.getGlobalUserInfo(userInfo);
            this.likeIt(index);
        } else {
            wx.showModal({
                title: '尚未绑定手机',
                content: '是否立即去绑定',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/binding-phone/binding-phone'
                        })
                    }
                }
            })
        }
    },
    likeIt(index) {
        this.setData({
            [`notesList[${index}].article.thumb`]: this.data.notesList[index].article.thumb + 1,
            [`notesList[${index}].article.star`]: 1
        });
        upThumb({
            articleId: this.data.notesList[index].article.articleId
        }).then();
    },
    getGlobalUserInfo(userInfo) {
        wx.request({
            url: getApp().globalData.server + "customer/updateInfo",
            data: userInfo,
            header: getApp().globalData.header,
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
                getApp().globalData.customer.name = userInfo.nickName;
                getApp().globalData.customer.male = userInfo.gender;
                getApp().globalData.customer.headImg = userInfo.avatarUrl;
                this.setData({
                    customer: getApp().globalData.customer
                })
            }
        })
    },
    clickCollect(e) {
        const index = e.currentTarget.dataset.index;
        const userInfo = e.detail.userInfo;
        const customer = getApp().globalData.customer;
        if (userInfo) {
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
                                    this.checkBindingPhoneBeforeCollectIt(customer, userInfo, index);
                                }
                            });
                        }
                    }
                });
            } else {
                this.checkBindingPhoneBeforeCollectIt(customer, userInfo, index);
            }
        }
    },
    checkBindingPhoneBeforeCollectIt(customer, userInfo, index) {
        if (customer.phone) {
            this.getGlobalUserInfo(userInfo);
            this.collectIt(index);
        } else {
            wx.showModal({
                title: '尚未绑定手机',
                content: '是否立即去绑定',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/binding-phone/binding-phone'
                        })
                    }
                }
            })
        }
    },
    collectIt(index) {
        if (this.data.notesList[index].article.collect == 0) {
            this.setData({
                [`notesList[${index}].article.collect`]: 1
            });
            collectionArticle({
                articleId: this.data.notesList[index].article.articleId
            }).then();
        } else if (this.data.notesList[index].article.collect == 1) {
            this.setData({
                [`notesList[${index}].article.collect`]: 0
            });
            cancelCollectionArticle({
                articleId: this.data.notesList[index].article.articleId
            }).then();
        }
    },
    refreshReviews(e) {
        if (e.detail.newReviews) {
            this.getReviewList(this.data.uploadReviewIndex);
        }
    },
    openPostComment(e) {
        let articleid = e.currentTarget.dataset.articleid,
            index = e.currentTarget.dataset.index;
        if (articleid) {
            this.setData({
                showPostComment: true,
                commentArticleId: e.currentTarget.dataset.articleid,
                uploadReviewIndex: index
            });
        }
    },
    pageTouchend(e) {
        if (this.data.showPostComment) {
            this.setData({
                showPostComment: false,
            });
        }
    },
    getReviewList(index) {
        getReviewList(this.data.notesList[index].reviewPageUtil).then(res => {
            if (res.code === 0) {
                let highQualityReview = res.data.list.slice(0, 2);
                this.setData({
                    [`notesList[${index}].commentListData`]: res.data,
                    [`notesList[${index}].highQualityReview`]: highQualityReview
                });
            }
        });
    },
    toArticleComment(e) {
        let articleId = e.currentTarget.dataset.articleid;
        wx.navigateTo({
            url: '../articleComment/articleComment?articleId=' + articleId
        })
    },
    focus(e) {
        let authorId = e.currentTarget.dataset.authorid,
            articleId = e.currentTarget.dataset.articleid,
            index = e.currentTarget.dataset.index;
        console.log('authorId:' + authorId + ',' + 'articleId:' + articleId + ',' + 'index' + index);
        if (this.data.notesList[index].article.attention === 0) {
            this.setData({
                [`notesList[${index}].article.attention`]: 1
            });
            if (authorId === null) {
                follow({
                    articleId: articleId
                }).then(res => {
                    if (res.code === 0) {
                        this.setData({
                            [`notesList[${index}].article.customerId`]: res.authorId
                        });
                    }
                });
            } else {
                follow({
                    attentionId: authorId
                }).then(res => {
                    if (res.code === 0) {
                        this.setData({
                            [`notesList[${index}].article.customerId`]: res.authorId
                        });
                    }
                });
            }
        } else {
            this.setData({
                [`notesList[${index}].article.attention`]: 0
            });
            cancelFollow({
                attentionId: authorId
            }).then();
        }
    },
    toAuthor(e) {
        let index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '/notesModule/pages/author/author?authorId=' + this.data.notesList[index].article.customerId + '&articleId=' + this.data.notesList[index].article.articleId
        })
    },



    setTotal(totalPage) {
        this.data.totalPage = totalPage
        if (totalPage == 0) {
            this.setData({
                noneResult: true
            })
        }
    },

    hasMore() {
        if (this.data.pageUtil.page > this.data.totalPage) {
            return false
        } else {
            return true
        }
    },

    initialize() {
        this.setData({
            dataArray: [],
            noneResult: false
        })

        this.data.totalPage = 2
    },
    isLocked() {
        return this.data.loading ? true : false
    },

    locked() {
        this.setData({
            loading: true
        })
    },

    unLocked() {
        this.setData({
            loading: false
        })
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        //用时间戳产生不重复的随机数
        this.loadMore();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(e) {
        return {
            title: e.target.dataset.articletitle,
            path: 'pages/article-detail/article-detail?articleId=' + this.data.articleId,
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