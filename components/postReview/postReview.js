// components/postComment/postComment.js
import {
  review
} from '../../config/getData.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    replyObj:{
      type:Object,
      observer:'getReply'
    },
    articleId:{
      type:String,
      observer:'getArticleId'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading:false,
    reply: '写评论...',
    replyName:'',
    comment: {
      articleId: '',
      content: '',
      replyUser: ''
    }
  },
  attached: function () {
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

  /**
   * 组件的方法列表
   */
  methods: {
    getReply(newVal,oldVal){
      this.data.comment.replyUser = newVal.replyUser;
      this.setData({
        replyName: newVal.replyName,
        reply: '回复 ' + newVal.replyName
      });
    },
    getArticleId(newVal, oldVal){
      this.data.comment.articleId = newVal;
    },
    getCommentContent(e) {
      this.data.comment.content = e.detail.value;
    },
    postComment(e) {
		// && typeof (this.data.comment.commentContent) != "undefined"
      if (this.data.comment.articleId && this.data.comment.content != '') {
        this.setData({
          loading: true
        });
        review(this.data.comment).then(res => {
          if (res.code === 0) {
            this.setData({
              autoFocus: false,
              reply: '写评论...',
              [`comment.content`]: '',
              [`comment.replyUser`]: '',
              loading: false
            })
            let refreshReviews = {
              newReviews:new Date().getTime()
            }
            this.triggerEvent('refreshReviews', refreshReviews);
          }
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '发送内容不能为空',
        })
      }
    },
  }
})
