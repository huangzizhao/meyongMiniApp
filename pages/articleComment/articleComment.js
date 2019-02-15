// pages/articleComment/articleComment.js
import {
    review,
    getReviewList
} from '../../config/getData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLoading: true,
        customer: {},
        reply: '写评论...',
        pageUtil: {
            page: 1,
            limit: 12,
            order: '',
            sidx: '',
            articleId: ''
        },
        commentList: [],
        totalPage: -1,
        enBottom: false,
        comment: {
            articleId: '',
            content: '',
            replyUser: ''
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            pageUtil: {
                page: 1,
                limit: 12,
                order: '',
                sidx: '',
                articleId: options.articleId
            },
            comment: {
                articleId: options.articleId,
                content: '',
                replyUser: ''
            }
        });
        let getCustomer = setInterval(() => {
            let customer = getApp().globalData.customer
            if (getApp().globalData.sessionId != null && customer != null) {
                this.setData({
                    customer: customer
                });
                clearInterval(getCustomer);
            }
        }, 100);
        this.getReviewListData(true);
    },

    chooseReply(e) {
        let replyName = e.currentTarget.dataset.replyname,
            replyUser = e.currentTarget.dataset.replyuser,
            comment = this.data.comment;
        comment.replyUser = replyUser;
        this.setData({
            reply: '回复 ' + replyName + ' :'
            // comment: comment
        });
    },

    getCommentContent(e) {
        this.data.comment.content = e.detail.value;
        // this.setData({
        // 	comment: {
        // 		content: e.detail.value
        // 	}
        // });
    },
    getReviewListData(e) {
        if (e) {
            var pageUtil = this.data.pageUtil;
            this.data.totalPage = -1;
            this.setData({
                // pageUtil: pageUtil,
                // totalPage: -1,
                enBottom: false
            });
        } else {
            if (this.data.pageUtil.page == this.data.totalPage) {
                this.setData({
                    enBottom: true
                })
                return;
            } else {
                var pageUtil = this.data.pageUtil,
                    articleId = this.data.pageUtil.articleId;
                pageUtil.page++;
            }
            // this.setData({
            // 	pageUtil: pageUtil
            // });
        }
        getReviewList(pageUtil).then(e => {
            if (e.code === 0) {
                this.data.totalPage = e.data.totalPage;
                this.setData({
                    commentList: e.data.list,
                    showLoading: false
                });
                console.log(this.data.pageUtil);
            }
        });
    },
    postComment(e) {
		if (this.data.comment.articleId && this.data.comment.content != '' && typeof (this.data.comment.commentContent) != "undefined") {
            this.setData({
                showLoading: true
            });
            review(this.data.comment).then(e => {
                if (e.code === 0) {
                    this.setData({
                        autoFocus: false,
						reply:'写评论...',
						[`comment.content`]: '',
						[`comment.replyUser`]:'',
                        showLoading: false
                    })
					this.getReviewListData(true);
                }
            });
		} else {
			wx.showToast({
				icon: 'none',
				title: '发送内容不能为空',
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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.getReviewListData(false);
    },
})