// pages/animation-test/animation-test.js
const imgSize = wx.getSystemInfoSync().windowWidth
Page({
  data: {
    animation: '',
    img:'',
    width: imgSize,
    height: imgSize,
    // height: imgSize*1.125,
    showAanimation: true,
    timeOutList: [],
    shan: 4,
    isAdd: false,
    shot:''
  },
  onLoad: function (options) {
    this.setData({
      img: getApp().globalData.cutInsideImg
    });
  },
  onReady: function () {
    // 页面渲染完成
    //实例化一个动画
    this.animation = wx.createAnimation({
      duration: 17200,
      timingFunction: 'linear',
      delay: 500,
      success: function (res) {
        console.log(res)
      }
    });
    var that = this;
    var faceData = getApp().globalData.imgData;
    console.log(faceData);
    this.animation.scale(3).step({ duration: 800, transformOrigin: faceData.eyeCenter.x * 100 + "%" + ' ' + faceData.eyeCenter.y  * 100 + "%"}).
      scale(1).step({ duration: 800, delay: 4000, transformOrigin: faceData.eyeCenter.x * 100 + "%" + ' ' + faceData.eyeCenter.y  * 100 + "%"}).
      scale(3).step({ duration: 800, transformOrigin: faceData.mouseCenter.x  * 100 + "%" + ' ' + faceData.mouseCenter.y  * 100 + "%" }).
      scale(1).step({ duration: 800, delay: 4000, transformOrigin: faceData.mouseCenter.x  * 100 + "%" + ' ' + faceData.mouseCenter.y  * 100 + "%" }).
      scale(3).step({ duration: 800, transformOrigin: faceData.noseCenter.x  * 100 + "%" + ' ' + faceData.noseCenter.y  * 100 + "%" }).
      scale(1).step({ duration: 800, delay: 4000, transformOrigin: faceData.noseCenter.x  * 100 + "%" + ' ' + faceData.noseCenter.y  * 100 + "%" }).
      scale(3).step({ duration: 800, transformOrigin: faceData.eyeBlowCenter.x * 100 + "%" + ' ' + faceData.eyeBlowCenter.y  * 100 + "%" }).
      scale(1).step({ duration: 800, delay: 4000, transformOrigin: faceData.eyeBlowCenter.x * 100 + "%" + ' ' + faceData.eyeBlowCenter.y  * 100 + "%" })
    this.startLine();
    this.setData({
      //输出动画
      animation: this.animation.export()
    });
    
  },
  startLine: function () {
    var that = this;
    var faceData = getApp().globalData.imgData;
    that.setData({
      showAanimation:true
    })
    var timeOut1 = setTimeout(function () {
      that.drawLine(faceData.eyeCenter.x * that.data.width, (faceData.eyeCenter.y) * that.data.width, faceData.eyeTypeSuggest);
    }, 1400);
    var timeOut2 =setTimeout(function () {
      that.clearDraw();
    }, 5300); 
    var timeOut3 =setTimeout(function () {
      that.drawLine(faceData.mouseCenter.x * that.data.width, (faceData.mouseCenter.y) * that.data.width,faceData.mouseTypeSuggest);
    }, 6000+1900);
    var timeOut4 =setTimeout(function () {
      that.clearDraw();
    }, 5300 + 1900 + 4000); 
    var timeOut5 =setTimeout(function () {
      that.drawLine(faceData.noseCenter.x * that.data.width, (faceData.noseCenter.y) * that.data.width,faceData.noseTypeSuggest);
    }, 6000 + 1900 * 2 + 4000);
    var timeOut6 =setTimeout(function () {
      that.clearDraw();
    }, 5300 + 1900 * 2 + 4000 * 2); 
    var timeOut7 =setTimeout(function () {
      that.drawLine(faceData.eyeBlowCenter.x * that.data.width, (faceData.eyeBlowCenter.y + 0.06) * that.data.width,faceData.eyeBlowTypeSuggest);
    }, 6000 + 1900 * 3 + 4000 * 2);
    var timeOut8 =setTimeout(function () {
      that.clearDraw();
    }, 5300 + 1900 * 3 + 4000 * 3); 
    var timeOut9 = setTimeout(function () {that.setData({showAanimation: false})}, 7000 + 1900 * 3 + 4000 * 3);
    that.setData({
      timeOutList: [timeOut1, timeOut2, timeOut3, timeOut4, timeOut5, timeOut6, timeOut7, timeOut8, timeOut9]
    }) 
  },
  onShow: function () {
    // 页面显示
    //this.drawLine(217.5, 82.5,"眉毛工整，眉形眉毛工整，眉形眉毛工整，眉形眉")
  },
  drawLine: function (startX, startY, content) {
    var that = this;
    var cxt_arc = wx.createContext();
    cxt_arc.setLineWidth(2);
    //偏转值
    var deviationX;
    var deviationY;
    if (startX > this.data.width / 2){
      deviationX = -40;
    }else {
      deviationX = 40 ;
    }
    if (startY > this.data.height / 2) {
      deviationY = -20;
    } else {
      deviationY = 20;
    }
    var endX = startX + deviationX;
    var endY = startY + deviationY;
    var edStartX = startX;
    var edStartY = startY;
    //开始点的位置
    this.drawStart(deviationX > 0 ? startX - 2 : startX + 2, startY);
    that.drawText(edStartX, edStartY, content, deviationX > 0);
  },

  clearDraw: function() {
    var shot = this.data.shot;
    var cxt_arc = wx.createContext();
    wx.drawCanvas({
          canvasId: 'canvas',
          actions: cxt_arc.getActions()
        })
    clearInterval(shot);
    wx.drawCanvas({
      canvasId: 'canvas-shan',
      actions: cxt_arc.getActions()
    })
  },
  drawStart:function(x,y){
    // var cxt_arc = wx.createContext();
    // cxt_arc.beginPath()
    // cxt_arc.arc(x, y, 5, 0, 2 * Math.PI)
    // cxt_arc.setFillStyle('#fff')
    // cxt_arc.fill();
    // wx.drawCanvas({
    //   canvasId: 'canvas',
    //   actions: cxt_arc.getActions(),
    //   reserve: true
    // })
    var that = this;
    var cxt_arc = wx.createContext();
    var shot = setInterval(function () {
      var isAdd = that.data.isAdd;
      cxt_arc.clearActions();
      if (that.data.shan >= 2.5 && that.data.shan <= 4.3) {
        that.setData({
          shan: that.data.shan + (isAdd ? 0.1 : -0.1)
        })
      } else {
        that.setData({
          isAdd: !isAdd,
          shan: that.data.shan + (!isAdd ? 0.1 : - 0.1)
        })
      }
      cxt_arc.beginPath()
      cxt_arc.arc(x, y, that.data.shan, 0, 2 * Math.PI)
      cxt_arc.setFillStyle('rgba(255, 255, 255, ' + 0.3 * that.data.shan + ')')
      cxt_arc.fill();
      wx.drawCanvas({
        canvasId: 'canvas-shan',
        actions: cxt_arc.getActions(),
        reserve: false
      })
    }, 30);
    that.setData({
      shot: shot
    })
  },
  /**
   * direction:线跟字方向 true为向右 false为向左
   */
  drawText: function (x, y, content, direction) {
    var reg = new RegExp("[\\u4E00-\\u9FFF]+$", "g");
    var content_split = content.split("");
    var cxt_arc = wx.createContext();
    cxt_arc.setStrokeStyle('#fff');
    cxt_arc.setFillStyle('#fff')
    var line = parseInt(content_split.length / 13);
    var deviationY = 13+line*7;
    var deviationText = -3 + line * 7;
    var devLineX = direction ? 177 : -170;
    var deviationX = direction ? 25 : -25;
    var arc_line = direction ? 6 : -6;
    //画线
    cxt_arc.setLineWidth(2);
    cxt_arc.moveTo(x, y);
    cxt_arc.arc(x + deviationX, y - deviationY + 6, 6, (direction ? 1.4 : 1.6) * Math.PI, 1.4 * Math.PI, !direction);
    cxt_arc.arc(x + devLineX - arc_line, y - deviationY + 6, 6, 1.5 * Math.PI, (direction ? 0 : 1) * Math.PI, !direction);
    cxt_arc.lineTo(x + devLineX, y + deviationY - 6);
    cxt_arc.arc(x + devLineX - arc_line, y + deviationY - 6, 6, (direction ? 0 : 1) * Math.PI, 0.5 * Math.PI, !direction);
    cxt_arc.lineTo(x + deviationX + arc_line, y + deviationY);
    cxt_arc.arc(x + deviationX, y + deviationY - 6, 6, 0.6 * Math.PI, (direction ? 0.8 : 0.3) * Math.PI, !direction);
    cxt_arc.lineTo(x, y);
    cxt_arc.setFillStyle('rgba(255,255,255,0.2)');
    cxt_arc.fill();
    cxt_arc.setFontSize(11);
    cxt_arc.setFillStyle('#fff');

    //字换行
    if (content_split.length > 12){
      var count = 0;
      var text = '';
      var position = 0 ;
      for (var i = 0; i<content_split.length;i++){
        text += content_split [i];
        count ++ ;
        if (i == content_split.length - 1 || count > 11 && (reg.test(content_split[i + 1]))){
          cxt_arc.fillText(text, direction ? x + 26 : x - 160, y - deviationText + 14 * position);
          position ++;
          count = 0;
          text = '';
        }
      }
    }else{
      cxt_arc.fillText(content, direction ? x + 26 : x - 160, y - deviationText);
    }
    // cxt_arc.draw()
    cxt_arc.stroke();
    wx.drawCanvas({
      canvasId: 'canvas',
      actions: cxt_arc.getActions(),
      reserve: true
    });
  },
  again: function () {
    if (!this.data.showAanimation){
      this.onReady();
    }
  },
  futureMe: function () {
     if (!this.data.showAanimation) {
       var customer = getApp().globalData.customer;
       if (customer != null && customer.phone != null) {
         wx.navigateTo({
           url: '../future-me/future-me'
         })
       } else {
         wx.navigateTo({
           url: '../binding-phone/binding-phone?onBack=false'
         })
       }
     } else {
       //  wx.showToast({
      //    title: '动画尚未播放完',
      //    icon: 'none',
      //    duration: 500,
      //    mask: true
      //  })
     }
  },
  againTest:function() {
    if (!this.data.showAanimation) {
      wx.navigateTo({
        url: '../index/home'
      })
    }
  }
})