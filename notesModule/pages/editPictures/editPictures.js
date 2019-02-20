// notesModule/pages/editPictures/editPictures.js
import { getLabelList } from '../../../config/getData.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tempImages: [], //临时图片地址
        tempImagesPath: [], //临时图片路径
        interval: 4000,
        duration: 300,
        swiperCurrent: 0,
        modeList: {},
        articleTitle: '',
        articleContent: '',
        labelList: [{
                label: '美容'
            },
            {
                label: '护肤'
            },
            {
                label: '健身'
            },
            {
                label: '才艺'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let data = JSON.parse(options.data)
        this.setData({
			tempImages: data.tempImages,
			tempImagesPath: data.tempImagesPath,
			articleTitle: data.articleTitle,
			articleContent: data.articleContent,
			labelList: data.labelList
        },()=>{
			if (this.data.labelList ==''){
				this.setData({
					labelList: [{
						label: '美容'
					},
					{
						label: '护肤'
					},
					{
						label: '健身'
					},
					{
						label: '才艺'
					}]
				});
			}
		});
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
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },
    swiperChange(e) {
        if (e.detail.source === 'touch') {
            //防止swiper控件卡死
            if (e.detail.current == 0 && this.data.swiperCurrent > 1) {
                this.setData({
                    swiperCurrent: this.data.swiperCurrent
                });
            } else {
                //正常轮播时，记录正确页码索引
                this.setData({
                    swiperCurrent: e.detail.current
                });
            }
        }
    },
    setMode(e) {
        let proportion = e.detail.width / e.detail.height;
        let index = e.currentTarget.dataset.index;
        if (proportion >= 1) {
            this.data.modeList[index] = 'aspectFit';
            this.setData({
                modeList: this.data.modeList
            });
        } else {
            this.data.modeList[index] = 'aspectFill';
            this.setData({
                modeList: this.data.modeList
            });
        }
    },
    selectRep(e) {
        let index = e.currentTarget.dataset.selectindex;
        this.data.labelList[index].selected ? this.data.labelList[index].selected = false : this.data.labelList[index].selected = true;
        this.setData({
            labelList: this.data.labelList
        });
    },
    next() {
        let data = {
            tempImages: this.data.tempImages,
            tempImagesPath: this.data.tempImagesPath,
			articleTitle: this.data.articleTitle,
			articleContent: this.data.articleContent,
			labelList: this.data.labelList
        }
		wx.redirectTo({
            url: '/notesModule/pages/articlePush/articlePush?data=' + JSON.stringify(data)
        })
    }
})