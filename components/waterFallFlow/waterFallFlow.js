// components/waterFallFlow/waterFallFlow.js
// import '../../templates/goodCard/goodCard.js';
import {
    paginationBev
} from '../behavior/pagination.js'
import {
    getWaterFallFlow
} from '../../config/getData'
import {
    getByteLength
} from '../../utils/util.js'
var leftList = new Array(); //左侧集合
var rightList = new Array(); //右侧集合
var leftHeight = 0,
    rightHeight = 0,
    itemWidth = 0,
    maxHeight = 0;

Component({
    /**
     * 组件的属性列表
     */
    behaviors: [paginationBev],
    properties: {
        idType: {
            type: String,
            observer: 'setIdType'
        },
        switchTab: {
            type: String,
            observer: 'tabChange'
        },
        more: {
            type: String,
            observer: 'onReachBottom'
        },
		update:{
			type:String,
			observer:'setUpdate'
		},
        keyword: {
            type: String,
            observer: 'searchByKeyword'
        },
        authorId: {
            type: String,
            observer: 'getInfoByAuthorId'
        },
        collectionAuthorId: {
            type: String,
            observer: 'getInfoByCollectionAuthorId'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // dataStorageList: [],
        dataStorage: [], //上下级页面相同组件调用，组件污染数据分离储存区
        leftList: [], //左侧集合
        rightList: [], //右侧集合
        loading: false,
        loadingCenter: false,
        isPull: false,
        type: '',
        idType: ''
    },
    pageLifetimes: {
        hide() {
            // var newList = Object.assign({}, this.data.dataStorage);
            // this.data.dataStorageList.push(newList);
			leftList.length = 0;
			rightList.length = 0;
            console.log(this.data.dataStorage);
        },
        show() {
            // Array.prototype.remove = function(from, to) {
            //     var rest = this.slice((to || from) + 1 || this.length);
            //     this.length = from < 0 ? this.length + from : from;
            //     return this.push.apply(this, rest);
            // };
            // let len = this.data.dataStorageList.length;
            // let data = this.data.dataStorageList[len - 1];
            this.data.isPull = false;
			leftList.length = 0;
			rightList.length = 0;
			leftHeight = 0;
			rightHeight = 0;
			// let array = Object.keys(data).map(key => data[key])
			this.setWaterFallFlowData(this.data.dataStorage);
        }
    },
    attached() {
        wx.getSystemInfo({
            success: (res) => {
                // 750rpx / 屏幕宽度
                let percentage = 750 / res.windowWidth;

                //计算瀑布流间距
                let margin = 20 / percentage;

                let padding = 40 / percentage;

                //计算 瀑布流展示的宽度
                itemWidth = (res.windowWidth - margin - padding) / 2;

                //计算瀑布流的最大高度，防止长图霸屏
                maxHeight = itemWidth / 0.8;
            },
        });
        this.data.isPull = true;
        this.data.dataStorage = [];
        // this.data.type = 'latest';
        // this.setData({
        //     loading: true
        // });
    },
    detached() {
        // 在组件实例被从页面节点树移除时执行
        console.log('移除了');
        this.data.isPull = false;
		this.data.dataStorage = [];
        // this.data.type = '';
        // this.data.idType = '';
        // this.data.pageUtil = {
        //     page: 1,
        //     limit: 10,
        //     order: '',
        //     sidx: ''
        // }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 填充数据
         * **/
		setUpdate(newVal, oldVal){
			this.data.isPull = true;
			this.data.pageUtil.page = 1;
			this.loadMore();
		},
        onReachBottom(newVal, oldVal) {
            if (newVal != oldVal && newVal != '') {
                this.data.isPull = false;
				console.log('onReachBottom:' + JSON.stringify(newVal) + 'isPull:' + JSON.stringify(this.data.isPull));
                this.loadMore();
            }
        },
        setIdType(newVal, oldVal) {
            this.data.idType = newVal;
            console.log('setIdType:' + JSON.stringify(this.data.pageUtil));
        },
        tabChange(newVal, oldVal) {
			if (newVal === oldVal && getApp().globalData.updateWaterFallFlow){
				this.data.isPull = true;
				this.data.pageUtil.page = 1;
				this.loadMore();
			}
            this.data.isPull = true;
            this.data.pageUtil.page = 1;
            this.data.pageUtil.type = newVal;
            console.log('tabChange:' + JSON.stringify(this.data.pageUtil));
            var getMore = setInterval(() => {
                var sessionId = getApp().globalData.sessionId;
                console.log('sessionId:' + sessionId);
                if (sessionId != '') {
                    clearInterval(getMore);
                    this.loadMore();
                }
            }, 10);
        },
        searchByKeyword(newVal, oldVal) {
            if (newVal != '') {
                this.data.isPull = true;
                this.data.pageUtil.page = 1;
                this.data.pageUtil.keyword = newVal;
                this.loadMore();
            }
        },
        getInfoByAuthorId(newVal, oldVal) {
            this.data.isPull = true;
            this.data.pageUtil.page = 1;
            if (this.data.idType === 'authorId') {
                this.data.pageUtil.authorId = newVal;
            } else if (this.data.idType === 'articleId') {
                this.data.pageUtil.articleId = newVal;
            }
            console.log('getInfoByAuthorId:' + JSON.stringify(this.data.pageUtil));
            // this.loadMore();
        },
        getInfoByCollectionAuthorId(newVal, oldVal) {
            this.data.isPull = true;
            this.data.pageUtil.page = 1;
            if (this.data.idType === 'authorId') {
                this.data.pageUtil.collectionAuthorId = newVal;
            } else if (this.data.idType === 'articleId') {
                this.data.pageUtil.articleId = newVal;
            }
            console.log('getInfoByCollectionAuthorId:' + JSON.stringify(this.data.pageUtil));
            // this.loadMore();
        },
        loadMore: function() {
            // this.data.pageUtil.type = this.data.type;
            if (this.isLocked()) {
                return;
            }
            if (this.hasMore()) {
                this.locked();
                console.log('loadMore:' + JSON.stringify(this.data.pageUtil));
                getWaterFallFlow(this.data.pageUtil).then(res => {
                    if (res.code === 0) {
                        if (res.res.list.length === 0 && res.res.currPage === 1) {
                            let dataList = new Array();
                            this.triggerEvent('noData', dataList);
                        }
                        var listData = res.res.list
						if(this.data.isPull){
							this.data.dataStorage = Array();
						}
						this.data.dataStorage.push(...res.res.list);
                        this.data.totalPage = res.res.totalPage;
                        this.data.pageUtil.page++;
                        this.setMoreData(res.res.list, this.data.isPull);
                        this.unLocked();

                        this.setWaterFallFlowData(listData);

                    }
                }, () => {
                    this.unLocked();
                });
            }
        },
        setWaterFallFlowData(listData) {
			if (this.data.isPull) { //是否下拉刷新，true则清除之前的数据
				leftList.length = 0;
				rightList.length = 0;
				leftHeight = 0;
				rightHeight = 0;
				console.log('更新到最新，替换整个数组');
			}
            for (let i = 0; i < listData.length; i++) {
                let tmp = listData[i]; //单条数据
                tmp.coverImgWidth = parseInt(tmp.coverImgWidth); //图片宽度
                tmp.coverImgHeight = parseInt(tmp.coverImgHeight); //图片高度
                tmp.itemWidth = itemWidth; //image 宽度

                //图片高宽比
                let per = tmp.coverImgWidth / tmp.itemWidth;

                //image高度
                tmp.itemHeight = tmp.coverImgHeight / per;

                if (tmp.itemHeight > maxHeight) {
                    tmp.itemHeight = maxHeight; //image高度，不超过最大高度
                }

                if (Math.ceil(getByteLength(tmp.title) / 22) > 1) {
                    var itemHeight = 2 * 20 + 30 + 27.5 + tmp.itemHeight
                } else {
                    var itemHeight = 20 + 30 + 27.5 + tmp.itemHeight
                }
                if (leftHeight == rightHeight) {
                    leftList.push(tmp);
                    leftHeight = leftHeight + itemHeight;
                } else if (leftHeight < rightHeight) {
                    leftList.push(tmp);
                    leftHeight = leftHeight + itemHeight;
                } else {
                    rightList.push(tmp);
                    rightHeight = rightHeight + itemHeight;
                }
            }
            this.setData({
                leftList: leftList,
                rightList: rightList
            }, () => {

                /**可支持拓展的懒加载 */
                for (let i = 0; i < listData.length; i++) {
                    this.createIntersectionObserver().relativeToViewport({
                        bottom: 300
                    }).observe(`.img${listData[i].articleId}`, (res) => {
                        // console.log(res)
                        if (res.intersectionRatio > 0) {
                            //如果图片进入可视区，将其设置为 show

                            let leftItemIndex = this.data.leftList.findIndex((value) => {
                                return value.articleId == listData[i].articleId;
                            });
                            let rightItemIndex = this.data.rightList.findIndex((value) => {
                                return value.articleId == listData[i].articleId;
                            });
                            if (leftItemIndex >= 0) {
                                this.setData({
                                    [`leftList[${leftItemIndex}].showItem`]: true,
                                })
                            }
                            if (rightItemIndex >= 0) {
                                this.setData({
                                    [`rightList[${rightItemIndex}].showItem`]: true,
                                })
                            }
                        }
                    })
                }
            });
        },
        likeIt: function(e) {
            // let articleData = e.currentTarget.dataset.record;
            // if (articleData.star != 1){
            //   wx.request({
            //     url: getApp().globalData.server + "article/upThumb",
            //     data: {
            //       articleId: articleData.articleId
            //     },
            //     header: getApp().globalData.header,
            //     method: 'GET',
            //     dataType: 'json',
            //     success: (res) => {
            //       articleData.thumb++;
            //       articleData.star = 1;
            //       this.triggerEvent('myevent');
            //     }
            //   })
            // }
        },
        toArticleDetail(e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/article-detail/article-detail?articleId=' + id
            })
        },
        toAuthor(e) {
            let authorId = e.currentTarget.dataset.authorid,
                articleId = e.currentTarget.dataset.articleid;
            // if (authorId === null){
            //   authorId = 'undefined'
            // } else if (articleId === null){
            //   articleId = 'undefined'
            // }
            wx.navigateTo({
                url: '/notesModule/pages/author/author?authorId=' + authorId + '&articleId=' + articleId
            })
        }
    }
})