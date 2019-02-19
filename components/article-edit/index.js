// components/article-edit/index.js
import {} from '/config/getData.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pictureImagesList: {
      type: 'String',
      value: '',
      observer: '_pictureImagesListChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tempImages: [], //临时图片地址
    tempImagesPath: [], //临时图片路径
    articleContent: '',
    date: ''
  },
  lifetimes:{
    detached(){
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upper() {},
    lower() {},
    scroll() {},
    _pictureImagesListChange(newVal, oldVal) {
      let data = JSON.parse(newVal);
      if (data) {
        this.setData({
          tempImages: data.tempImages,
          tempImagesPath: data.tempImagesPath
        });
      }
    },
    addNewPhoto() {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.data.tempImages.push(...res.tempFiles);
          this.data.tempImagesPath.push(...res.tempFilePaths);

          this.setData({
            tempImages: this.data.tempImages,
            tempImagesPath: this.data.tempImagesPath
          });
        }
      })
    },
    getTextareaContent(e) {
      this.data.articleContent = e.detail.value;
    },
    saveToDraft() {
      wx.showModal({
        title: '提示',
        content: '确认保存笔记至草稿箱吗？',
        success:(res)=>{
          if(res.confirm){
            let drafData = [{
              tempImages: this.data.tempImages,
              tempImagesPath: this.data.tempImagesPath,
              articleContent: this.data.articleContent,
              date: new Date()
            }];
            getApp().globalData.localStorages.storage.Set('articleDraftBox', drafData).then((res) => {
              wx.navigateBack({
                delta: 2
              })
            }).catch((error) => {
              console.log(error);
            });
          }
        }
      })
    },
    articlePush(){
      
    }
  }
})