// components/article-edit/index.js
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
    },

    /**
     * 组件的方法列表
     */
    methods: {
		upper(){},
		lower(){},
		scroll(){},
        _pictureImagesListChange(newVal, oldVal) {
            let data = JSON.parse(newVal);
            this.setData({
                tempImages: data.tempImages,
                tempImagesPath: data.tempImagesPath
            });
			
        },
		addNewPhoto(){
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
					// getApp().globalData.localStorages.storage.Set('tempImagesArray', data).then((res)=>{
					// 	console.log('save success');
					// }).catch((error)=>{
					// 	console.log('save fail');
					// });
				}
			})
		}
    }
})