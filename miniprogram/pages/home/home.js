// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 今天日期
    date: {
      current: '',
      start: '',
      end: ''
    },

    // 本月结余
    balance: 0,

    // 本月总支出
    payTotal: 0,

    // 本月总收入
    incomeTotal: 0,

    // 账单数据
    toDayBookingData: [],

    // 今日收入支出
    todayData: {
      pay: 0,
      income: 0
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNowDate();
    this.getBookingData();
  },

  // 获取账单数据
  getBookingData() {
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

        // 本月 支出和收入
        let payTotal = 0;
        let incomeTotal = 0;

        res.result.data.forEach(v => {
          if (v.trend.isPay) {
            payTotal += v.infos.price;
          } else {
            incomeTotal += v.infos.price;
          }
        });
        let balance = incomeTotal - payTotal;

        payTotal = payTotal.toFixed(2);
        incomeTotal = incomeTotal.toFixed(2);
        balance = balance.toFixed(2);


        // 获取今日账单列表
        let toDayBookingData = res.result.data.filter(v => v.infos.date === this.data.date.current);

        // 获取今日支出收入
        let {
          todayData
        } = this.data;

        todayData.pay = 0;
        todayData.income = 0;
        toDayBookingData.forEach(v => {
          if (v.trend.isPay) {
            todayData.pay += v.infos.price;
          } else {
            todayData.income += v.infos.price;
          }
        })

        this.setData({
          toDayBookingData,
          balance,
          payTotal,
          incomeTotal,
          todayData
        });


      },
      fail: err => {
        wx.hideLoading();
        console.log('err=>>>', err);
      }
    })
  },

  // 获取今天日期
  getNowDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();

    const {
      date
    } = this.data;
    date.current = `${year}-${month}-${day}`;
    date.start = `${year}-01-01`;
    date.end = `${year}-${month}-${day}`;

    this.setData({
      date
    })
  },

  // 选择日期
  selectDate(e) {
    const {
      value
    } = e.detail;

    let {
      date
    } = this.data;
    date.current = value;

    this.setData({
      date
    })

    this.getBookingData();
  }



})