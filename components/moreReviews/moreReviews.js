// components/moreReviews/moreReviews.js
import {
    getReviewList,
	listMineReply
} from '../../config/getData.js'
import {
    paginationBev
} from '../behavior/pagination.js'
Component({
    /**
     * 组件的属性列表
     */
    behaviors: [paginationBev],
    properties: {
        type: {
            type: String,
            observer: 'setType'
        },
        articleId: {
            type: String,
            observer: 'setArticleId'
        },
        more: {
            type: String,
            observer: 'onReachBottom'
        },
        newReviews: {
            type: String,
            observer: 'setNewReviews'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        commentList: [],
        articleId: '',
		type:'',
        isPull: false,
        loading: false
    },

    // attached: function() {
    //   this.data.isPull = true;
    //   this.loadMore();
    // },

    /**
     * 组件的方法列表
     */
    methods: {
        setArticleId(newVal, oldVal) {
			this.data.articleId = newVal;
			this.data.pageUtil.articleId = this.data.articleId;
			// this.loadMore();
        },
        setNewReviews(newVal, oldVal) {
			this.data.isPull = true;
			this.loadMore();
        },
        onReachBottom(newVal, oldVal) {
            this.data.isPull = false;
            this.loadMore();
        },
        chooseReply(e) {
            let replyName = e.currentTarget.dataset.replyname,
                replyUser = e.currentTarget.dataset.replyuser;
            var replySomeone = {
                replyName: replyName,
                replyUser: replyUser
            }
            this.triggerEvent('replySomeone', replySomeone);
            // this.data.comment.replyUser = replyUser;
            // this.setData({
            //   reply: '回复 ' + replyName + ' :'
            // });
        },
        loadMore() {
            if (this.isLocked()) {
                return;
            }
            if (this.hasMore()) {
                this.locked();
                console.log(JSON.stringify(this.data.pageUtil));
                if (this.data.pageUtil.articleId) {
                    getReviewList(this.data.pageUtil).then(res => {
                        if (res.code === 0) {
                            this.data.totalPage = res.data.totalPage;
                            this.data.pageUtil.page++;
                            this.setMoreData(res.data.list, this.data.isPull);
                            this.unLocked();
                            this.setData({
                                commentList: res.data.list
                            });
                        }
                    }, () => {
                        this.unLocked();
                    });
                } else {
                    //todo 请求我收到的评论列表
					listMineReply(this.data.pageUtil).then(res=>{
						if(res.code === 0){
							this.data.totalPage = res.data.totalPage;
							this.data.pageUtil.page++;
							this.setMoreData(res.data.list, this.data.isPull);
							this.unLocked();
							this.setData({
								commentList: res.data.list
							});
						}
					},()=>{
						this.unLocked();
					});
                }
            }
        }
    }
})