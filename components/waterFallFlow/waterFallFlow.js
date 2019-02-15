// components/waterFallFlow/waterFallFlow.js
// import '../../templates/goodCard/goodCard.js';
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
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    leftList: [], //左侧集合
    rightList: [], //右侧集合
  },

  attached: function() {
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 填充数据
     * **/

    fillData: function(isPull, listData) {
      if (isPull) { //是否下拉刷新，true则清除之前的数据
        leftList.length = 0;
        rightList.length = 0;
        leftHeight = 0;
        rightHeight = 0;
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

        if (leftHeight == rightHeight) {
          leftList.push(tmp);
          leftHeight = leftHeight + tmp.itemHeight;
        } else if (leftHeight < rightHeight) {
          leftList.push(tmp);
          leftHeight = leftHeight + tmp.itemHeight;
        } else {
          rightList.push(tmp);
          rightHeight = rightHeight + tmp.itemHeight;
        }
      }
      this.setData({
        leftList: leftList,
        rightList: rightList
      }, () => {

        /**可支持拓展的懒加载 */
        for (let i = 0; i < listData.length; i++) {
			this.createIntersectionObserver().relativeToViewport({ bottom: 300}).observe(`.img${listData[i].articleId}`, (res) => {
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
		console.log("???");
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
    toArticleDetail: function(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../article-detail/article-detail?articleId=' + id
      })
    }
  }
})