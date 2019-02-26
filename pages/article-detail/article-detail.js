// pages/article-detail/article-detail.js
import {
  getArticleById,
  changeUrlString,
  toVideoUrls,
  upThumb,
  review,
  getReviewList
} from '../../config/getData'
var WxParse = require('../../components/wxParse/wxParse.js');
const device = wx.getSystemInfoSync();
const width = device.windowWidth;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    article: {},
    // recommend: [],
    enThumb: 0,
    width: width,
    autoplay: false,
    circular: false,
    swiperCurrent: 0,
    interval: 5000,
    duration: 400,
    custom: null,
    autoFocus: false,
    adjustPosition: true,
    showPostComment: false,
    articleId:'',
    comment: {
      articleId: '',
      commentContent: ''
    },
    commentListData: {},
    highQualityReview: [],
    pageUtil: {
      page: 1,
      limit: 12,
      order: '',
      sidx: '',
      articleId: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    this.setData({
      articleId: options.articleId,
      comment: {
        articleId: options.articleId
      },
      showLoading: true,
      pageUtil: {
        page: 1,
        limit: 12,
        order: '',
        sidx: '',
        articleId: options.articleId
      }
    });
    this.getReviewList();
    let articleId = {
      articleId: options.articleId
    }
    getArticleById(articleId).then(e => {
      if (e.code === 0) {
        let article = e.article;
        // this.getRecommend(article.articleTypeId, options.articleId);
        let content = article.content
        this.setData({
          article: article
        })
        if (content.length != 0) {
          content = content.replace(/&amp;/g, "&");
          content = content.replace(/&lt;/g, "<");
          content = content.replace(/&gt;/g, ">");
          content = content.replace(/&#39;/g, "\'");
          content = content.replace(/&quot;/g, "\"");
          content = content.replace(/&amp;nbsp;/g, ' ');
          content = content.replace(/&nbsp;/g, ' ');
        }
        if (content.indexOf('<my-v>') != -1) {
          let vid = content.substring(content.indexOf("<my-v>") + "<my-v>".length, content.indexOf("</my-v>"))
          this.getVideoInfo(vid);
        } else {
          WxParse.wxParse('thatArticle', 'html', content, this, 5);
        }
        // console.log(content);
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
    this.setData({
      showLoading: false
    });
  },
  swiperChange(e) {
    if (e.detail.source === 'touch') {
      //防止swiper控件卡死
      if (e.detail.current == 0 && this.data.swiperCurrent > 1) {
        this.setData({
          swiperCurrent: this.data.swiperCurrent
        });
      } else {
        //正常轮播时，记录正确页码索引
        this.setData({
          swiperCurrent: e.detail.current
        });
      }
    }
  },
  getVideoInfo: function(vid) {
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
        this.requestVideoUrls(part_format_id, vid, filename, 'index' + i, host);
      }
    });
  },
  requestVideoUrls: function(part_format_id, vid, fileName, index, host) {
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
        WxParse.wxParse('thatArticle', 'html', "<video  control src='" + url + "' type='video / x - ms - asf - plugin' width='550' height='400' autostart='false' loop='true' />", this, 5);
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
  openArticle: function(event) {
    var articleId = event.currentTarget.dataset.id;
    if (articleId != null) {
      wx.navigateTo({
        url: 'article-detail?articleId=' + articleId
      })
    }
  },
  cilckGood: function() {
    if (this.data.article.star != 1) {
      upThumb({
        articleId: this.data.article.articleId
      }).then(e => {
        if (e.code === 0) {
          let article = this.data.article;
          article.thumb++;
          article.star = 1;
          this.setData({
            enThumb: true,
            article: article
          })
        }
      });
    }
  },
  openPostComment(e) {
    let id = e.currentTarget.dataset.articleid;
    if (id) {
      this.setData({
        showPostComment: true,
        articleId: e.currentTarget.dataset.articleid
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
  getReviewList() {
    getReviewList(this.data.pageUtil).then(e => {
      if (e.code === 0) {
        let highQualityReview = e.data.list.slice(0, 2);
        this.setData({
          commentListData: e.data,
          highQualityReview: highQualityReview
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
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