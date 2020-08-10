// pages/chart/chart.js
Page({
  data: {
    icons: [],
    bookingData: [],
    pieOption: {},
    barOption: {}
  },

  onShow() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    // 调用云函数
    wx.cloud.callFunction({
      // 云函数名
      name: 'get_data',
      success: res => {
        wx.hideLoading();
        // console.log(res.result.data);
        // 获取数据
        let bookingData = res.result.data;


        this.setData({
          bookingData,
        });

        // 获取图标数据
        this.getIconsData();
        // 获取环图数据
        this.getPieOption();

      },
      fail: err => {
        wx.hideLoading();
        console.log('err=>>>', err);
      }
    })

  },

  // 获取图标
  getIconsData() {
    // 调用云函数
    wx.cloud.callFunction({
      // 云函数名
      name: 'get_icons',
      success: res => {
        let icons = res.result.data;
        this.setData({
          icons
        })
        // 获取柱形图数据
        this.getBarOption()
      },
      fail: err => {
        wx.hideLoading();
        console.log('err=>>>', err);
      }

    })
  },

  // 设置圆环图数据
  getPieOption() {
    // 计算本月总支出与总收入
    let payTotal = 0;
    let incomeTotal = 0;
    this.data.bookingData.forEach(v => {
      // console.log(v.infos.price);
      if (v.trend.isPay) {
        payTotal += v.infos.price;
      } else {
        incomeTotal += v.infos.price;
      }
    });

    let pieOption = {
      title: {
        text: '本月支收比例',
        textStyle: {
          color: '#353535',
          fontWeight: 'lighter'
        },
        textAlign: 'center',
        left: 48 + '%'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        top: 20,
        right: 20,
        data: ['支出', '收入'],
        backgroundColor: '#eee'
      },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [{
          name: '支出',
          value: payTotal
        }, {
          name: '收入',
          value: incomeTotal
        }]
      }],
      color: [
        '#2fe03e',
        '#db3535'
      ]
    };

    this.setData({
      pieOption,
    });
  },

  // 获取柱形图数据
  getBarOption() {
    let barOption = {
      title: {
        text: '本月分类数据',
        textStyle: {
          color: '#353535',
          fontWeight: 'lighter'
        },
        textAlign: 'center',
        left: 48 + '%'
      },

      xAxis: {
        type: 'category',
        data: ['餐饮', '购物', '出行', '健康', '娱乐', '住房', '人情', '交通', '学习', '其他']

      },
      yAxis: {
        type: 'value',
        width: '200'
      },
      series: [{
        left: 200,
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(201, 201, 201, 0.8)'
        }
      }],
      color: ['#5ab1ef'],
      grid: {
        left: '1%',
        right: '1%',
        bottom: '10%',
        containLabel: true,
      },
      // type的slider和inside可以同时保留，既可以保留滚动条，也可以在内部拖动
      dataZoom: [
        //1.横向使用滚动条
        {
          type: 'slider', //有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
          show: true, //是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
          start: 0, //数据窗口范围的起始百分比0-100
          end: 70, //数据窗口范围的结束百分比0-100
          xAxisIndex: [0], // 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
          bottom: 0 //距离底部的距离
        },
        //2.在内部可以横向拖动
        {
          type: 'inside', // 内置于坐标系中
          start: 0,
          end: 0,
          xAxisIndex: [0]
        }
      ]

    };

    let typeObj = {};

    for (let i = 0; i < this.data.icons.length; i++) {
      let num = 0;
      this.data.bookingData.forEach(v => {
        if (this.data.icons[i].type === v.icon.type) {
          num += v.infos.price;
        }
      })
      typeObj[this.data.icons[i].type] = num;
    }

    let dataArr = [];
    for (let k in typeObj) {
      dataArr.push(typeObj[k]);
    }


    barOption.series[0].data = dataArr;

    this.setData({
      barOption
    })
  }
})