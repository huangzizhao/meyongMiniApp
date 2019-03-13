// components/followList/index.js
import {
  getFollowList,
  getAttentionList,
  follow,
  cancelFollow
} from '../../config/getData.js'
import {
  paginationBev
} from '../behavior/pagination.js'
Component({
  behaviors: [paginationBev],
  /**
   * 组件的属性列表
   */
  properties: {
    more: {
      type: String,
      observer: 'onReachBottom'
    },
    type: {
      type: String,
      observer: 'setType'
    },
    customerId: {
      type: String,
      observer: 'setCustomerId'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arrayList: [],
    isPull: false,
    loading: false,
    type: '',
    customerId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCustomerId(newVal, oldVal) {
      this.setData({
        customerId: newVal
      });
      this.loadMore();
    },
    setType(newVal, oldVal) {
      this.setData({
        type: newVal
      });
    },
    onReachBottom(newVal, oldVal) {
      this.data.isPull = false;
      this.loadMore();
    },
    loadMore() {
      //请求关注列表
      if (this.data.type === 'follower') {
        //todo 传递特殊值获取关注列表
        this.data.pageUtil.customerId = this.data.customerId;
        if (this.isLocked()) {
          return;
        }
        if (this.hasMore()) {
          this.locked();
          getAttentionList(this.data.pageUtil).then(res => {
            if (res.code === 0) {
              this.data.totalPage = res.data.totalPage;
              this.data.pageUtil.page++;
              this.setMoreData(res.data.list, this.data.isPull);
              this.unLocked();
              this.setData({
                arrayList: res.data.list
              });
            }
          }, () => {
            this.unLocked();
          });
        }
      } else if (this.data.type === 'attention') {
        //todo 传递特殊值获取粉丝列表
        this.data.pageUtil.customerId = this.data.customerId;
        if (this.isLocked()) {
          return;
        }
        if (this.hasMore()) {
          this.locked();
          getFollowList(this.data.pageUtil).then(res => {
            if (res.code === 0) {
              this.data.totalPage = res.data.totalPage;
              this.data.pageUtil.page++;
              this.setMoreData(res.data.list, this.data.isPull);
              this.unLocked();
              this.setData({
                arrayList: res.data.list
              });
            }
          }, () => {
            this.unLocked();
          });
        }
      }
    },
    onReachBottom(newVal, oldVal) {
      this.data.isPull = false;
      this.loadMore();
    },
    follow(e) {
      let index = e.currentTarget.dataset.index;
      if (e.currentTarget.dataset.attention === 0) {
        //todo
        this.setData({
			[`arrayList[${index}].attention`]: 1
        });
        follow({
          customerId: this.data.customerId,
          attentionId: e.currentTarget.dataset.attentionid
        }).then(res => {
          if (res.code != 0) {
            console.log(res.msg);
          }
        });
      } else if (e.currentTarget.dataset.attention === 1) {
        //todo
        this.setData({
			[`arrayList[${index}].attention`]: 0
        });
        cancelFollow({
          customerId: this.data.customerId,
          attentionId: e.currentTarget.dataset.attentionid
        }).then(res => {
          if (res.code != 0) {
            console.log(res.msg);
          }
        });
      }
    },
    toAuthor(e) {
      let authorId = e.currentTarget.dataset.authorid;
      wx.navigateTo({
        url: '/notesModule/pages/author/author?authorId=' + authorId
      })
    }
  }
})