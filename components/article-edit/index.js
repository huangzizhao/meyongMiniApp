// components/article-edit/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pictureImagesList:{
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _pictureImagesListChange(newVal, oldVal){
      let data = JSON.parse(newVal)
      this.setData({
        tempImages: data.tempImages,
        tempImagesPath: data.tempImagesPath
      });
      console.log('进来啦');
    }
  }
})
