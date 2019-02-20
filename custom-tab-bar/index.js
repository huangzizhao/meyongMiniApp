// customTabBar/customTabBar.js

Component({
  data: {
    selected: 0,
    color:"#c2b9b7",
    selectedColor:"#000",
    list: [
      {
        pagePath: "/pages/index/home",
        text: "首页",
        iconPath: "/img/home.png",
        selectedIconPath: "/img/homeActive.png"
      },
      {
        pagePath: "/pages/articlePushTest/articlePushTest",
        text: "",
        iconPath: "/img/notesPush.png",
        selectedIconPath: "/img/notesPush.png"
      },
      {
        pagePath: "/pages/mine/mine",
        text: "我的",
        iconPath: "/img/mine.png",
        selectedIconPath: "/img/mineActive.png"
      }
    ]
  },
  attached(){},
  methods: {
    switchTab(e){
		const data = e.currentTarget.dataset
		const url = data.path
		if (data.index === 1){
			wx.chooseImage({
				sizeType:['original','compressed'],
				sourceType:['album','camera'],
				success:(res)=> {
					let data = {
						tempImages: res.tempFiles,
						tempImagesPath: res.tempFilePaths,
						articleContent: '',
						articleTitle:'',
						labelList:[]
					}
					wx.navigateTo({
						url: '/notesModule/pages/editPictures/editPictures?data=' + JSON.stringify(data),
					})
					// getApp().globalData.localStorages.storage.Set('tempImagesArray', data).then((res)=>{
					// 	console.log('save success');
					// }).catch((error)=>{
					// 	console.log('save fail');
					// });
				}
			})
		}else{
			this.setData({
				selected: data.index
			})
			wx.switchTab({ url });
			console.log(this.data.selected);
		}
    }
  }
})
