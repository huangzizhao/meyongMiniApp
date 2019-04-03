import * as echarts from '../../../components/ec-canvas/echarts';
import { getObtainCustomerBill} from '../../../config/getData'
const app = getApp();

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    customer:'',
    earnings: 0,
	  navbarData: {
		  showCapsule: true,
		  title: '我的蜜罐'
	  },
	  navbarHeight: getApp().globalData.navbarHeight,
  },
  onShow: function () {
    this.setData({
      customer: getApp().globalData.customer
    })
  },
  onLoad: function () {

	  getObtainCustomerBill(Math.random()).then(e=>{
		  this.setData({
			  earnings: e.sum
		  })
		  var bill = e.map;
		  var seriesData = [];
		  var xAxisData = [];
		  for (var key in bill) {
			  seriesData.push(bill[key]);
			  xAxisData.push(key);
		  }
		  var option = {
			  xAxis: {
				  type: 'category',
				  boundaryGap: false,
				  data: xAxisData
			  },
			  yAxis: {
				  type: 'value'
			  },
			  // title: {
			  //   left: 'center',
			  //   text: '收益图',
			  // },
			  series: [{
				  data: seriesData,
				  type: 'line',
				  areaStyle: {}
			  }]
		  };
		  if (this.data.customer.wallet > 0) {
			  this.init(option);
		  }
	  });
  },
  init: function (option) {
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(option);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  }
})