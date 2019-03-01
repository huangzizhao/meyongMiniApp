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
// var WxParse = require('../../components/wxParse/wxParse.js');
const device = wx.getSystemInfoSync();
const width = device.windowWidth;

Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        wx.hideShareMenu();
        this.data.pageUtil.articleId = options.articleId;
        this.data.articleId = options.articleId;
        getArticleById({
            articleId: options.articleId
        }).then(res => {
            if (res.code === 0) {
                let article = res.article;
                // this.getRecommend(article.articleTypeId, options.articleId);
                this.setData({
                    [`notesList[0].article`]: article
                })
                // if (content.length != 0) {
                //     content = content.replace(/&amp;/g, "&");
                //     content = content.replace(/&lt;/g, "<");
                //     content = content.replace(/&gt;/g, ">");
                //     content = content.replace(/&#39;/g, "\'");
                //     content = content.replace(/&quot;/g, "\"");
                //     content = content.replace(/&amp;nbsp;/g, ' ');
                //     content = content.replace(/&nbsp;/g, ' ');
                // }
                // if (content.indexOf('<my-v>') != -1) {
                //     let vid = content.substring(content.indexOf("<my-v>") + "<my-v>".length, content.indexOf("</my-v>"))
                //     this.getVideoInfo(vid,index = 0);
                // } else {
                //     WxParse.wxParse('articles0', 'html', content, this, 5);
                // }
                // console.log(content);
            }
        });
        this.loadMore();

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
    loadMore() {
        if (this.isLocked()) {
            return;
        }
        if (this.hasMore()) {
            this.locked();
            getSameTagArticles(this.data.pageUtil).then(res => {
                if (res.code === 0) {
                    // let content = res.data.list.content;
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
        let index = e.currentTarget.dataset.index;
        if (this.data.notesList[index].article.star != 1) {
            this.setData({
                [`notesList[${index}].article.thumb`]: this.data.notesList[index].article.thumb + 1,
                [`notesList[${index}].article.star`]: 1
            });
            upThumb({
                articleId: this.data.notesList[index].article.articleId
            }).then(res => {
                // if (res.code === 0) {
                //     let article = this.data.article;
                //     article.thumb++;
                //     article.star = 1;
                //     this.setData({
                //         article: article
                //     })
                // }
            });
        }
    },
    clickCollect(e) {
        let index = e.currentTarget.dataset.index;
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
            if (typeof(authorId) === 'undefined') {
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