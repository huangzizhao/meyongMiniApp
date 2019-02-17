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
      
      this.setData({
        selected:data.index
      })
      wx.switchTab({ url });
      console.log(this.data.selected);
    }
  }
})
