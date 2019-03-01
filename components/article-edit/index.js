// components/article-edit/index.js
// import {
// 	supplementAlbumById
// } from '../../config/getData.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        notesContentChange: {
            type: 'String',
            value: '',
            observer: '_notesContentChange'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tempImages: [], //临时图片地址
        tempImagesPath: [], //临时图片路径
        articleTitle: '',
        articleContent: '',
        date: '',
        labelList: [],
        loading: false
    },
    lifetimes: {
        detached() {

        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        upper() {},
        lower() {},
        scroll() {},
        _notesContentChange(newVal, oldVal) {
            let data = JSON.parse(newVal);
            if (data) {
                this.setData({
                    tempImages: data.tempImages,
                    tempImagesPath: data.tempImagesPath,
                    articleTitle: data.articleTitle,
                    articleContent: data.articleContent,
                    labelList: data.labelList
                });
            }
            console.log(this.data.labelList);
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
        getInputTitle(e) {
            this.data.articleTitle = e.detail.value;
        },
        saveToDraft() {
            wx.showModal({
                title: '提示',
                content: '确认保存笔记至草稿箱吗？',
                success: (res) => {
                    if (res.confirm) {
                        let drafData = [{
                            tempImages: this.data.tempImages,
                            tempImagesPath: this.data.tempImagesPath,
                            articleTitle: this.data.articleTitle,
                            articleContent: this.data.articleContent,
                            labelList: this.data.labelList,
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
        controlPicture(e) {
            let index = e.currentTarget.dataset.index;
            wx.showActionSheet({
                itemList: ['编辑', '删除'],
                success: (res) => {
                    switch (res.tapIndex) {
                        case 0:
                            let data = {
                                tempImages: this.data.tempImages,
                                tempImagesPath: this.data.tempImagesPath,
                                articleTitle: this.data.articleTitle,
                                articleContent: this.data.articleContent,
                                labelList: this.data.labelList
                            }
                            wx.redirectTo({
                                url: '/notesModule/pages/editPictures/editPictures?data=' + JSON.stringify(data)
                            })
                            break;
                        case 1:
                            Array.prototype.remove = function(from, to) {
                                var rest = this.slice((to || from) + 1 || this.length);
                                this.length = from < 0 ? this.length + from : from;
                                return this.push.apply(this, rest);
                            };
                            this.data.tempImages.remove(index);
                            this.data.tempImagesPath.remove(index)
                            this.setData({
                                tempImages: this.data.tempImages,
                                tempImagesPath: this.data.tempImagesPath
                            });
                            break;
                        default:
                            break;
                    }
                }
            })
        },
        articlePush() {
            if (this.data.articleTitle == '' || this.data.articleContent == '') {
                wx.showModal({
                    title: '提示',
                    content: '请完善标题或者内容再提交发布',
                })
            } else if (this.data.tempImages.length <= 0) {
                wx.showModal({
                    title: '提示',
                    content: '至少添加一张照片才能发布喔',
                })
            } else {
                // this.setData({
                // 	loading:true
                // });
                wx.showLoading({
                    title: '上传中...',
                    mask: true
                })
                let tags = this.data.labelList.filter(item => {
                    return item.selected
                });
                var tagsList = "";
                tags.forEach(e => {
                    tagsList += e.label + ',';
                });
                tagsList = tagsList.substring(0, tagsList.length - 1);
                // var formData = new FormData();
                var data = {
                    title: this.data.articleTitle,
                    content: this.data.articleContent,
                    tag: tagsList
                }
                console.log(data);
                // formData.append('title', this.data.articleTitle);
                // formData.append('content', this.data.articleContent);
                // formData.append('tags', tagsList);
                wx.uploadFile({
                    url: getApp().globalData.server + 'article/publishArticle',
                    header: getApp().globalData.header,
                    filePath: this.data.tempImagesPath[0],
                    name: 'files',
                    formData: data,
                    success: (res) => {
                        console.log(res);
                        res.data = JSON.parse(res.data);
                        if (res.data.code === 0) {
                            if (this.data.tempImagesPath.length > 1) {
                                for (let i = 1; i < this.data.tempImagesPath.length; i++) {
                                    wx.uploadFile({
                                        url: getApp().globalData.server + 'article/supplementAlbumById/' + res.data.id,
                                        header: getApp().globalData.header,
                                        filePath: this.data.tempImagesPath[i],
                                        name: 'files',
                                        success: (res) => {
                                            res.data = JSON.parse(res.data);
                                            if (res.data.code === 0) {
                                                if (i === this.data.tempImagesPath.length - 1) {
                                                    // this.setData({
                                                    // 	loading: false
                                                    // });
                                                    wx.hideLoading();
                                                    wx.showModal({
                                                        title: '提示',
                                                        content: '上传成功',
                                                        showCancel: false,
                                                        success: (res) => {
                                                            getApp().globalData.updateWaterFallFlow = true;
                                                            wx.navigateBack({
                                                                delta: 2
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        },
                                        fail: (error) => {
                                            console.log(error);
                                        }
                                    })
                                }
                            } else {
                                wx.hideLoading();
                                wx.showModal({
                                    title: '提示',
                                    content: '上传成功',
                                    showCancel: false,
                                    success: (res) => {
                                        getApp().globalData.updateWaterFallFlow = true;
                                        wx.navigateBack({
                                            delta: 2
                                        })
                                    }
                                })
                            }
                        } else if (res.data.code === 500) {
                            wx.hideLoading();
                            wx.showModal({
                                title: '提示',
                                content: res.data.msg,
                                showCancel: false
                            })
                        }
                    },
                    fail: (error) => {
                        console.log(error);
                    }
                })
            }
        }
    }
})