// pages/booking/booking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 选项卡标题
    tabs: [{
        title: '收入',
        isActive: true,
        isPay: 0
      },
      {
        title: '支付',
        isActive: false,
        isPay: 1
      }
    ],

    // 图标
    icons: [],

    // 账户
    accounts: [{
        title: '支付宝',
        isActive: true
      },
      {
        title: '微信',
        isActive: false
      },
      {
        title: '现金',
        isActive: false
      },
      {
        title: '储蓄卡',
        isActive: false
      },
      {
        title: '信用卡',
        isActive: false
      },
    ],

    // 开始日期
    startDate: '',

    // 结束日期
    endDate: '',

    userInfo: null,

    // 信息
    infos: {
      date: '',
      price: null,
      note: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('user_info');

    if (userInfo) {
      this.setData({
        userInfo
      })
    }

    this.getIconsData();
    this.setDate();
  },

  // 切换标签
  toggleTag(e) {
    const {
      active
    } = e.currentTarget.dataset;

    if (active) {
      return;
    }

    let tabs = this.data.tabs;

    tabs.forEach(v => {
      v.isActive = !v.isActive
    });

    this.setData({
      tabs
    })
  },

  // 获取图标
  getIconsData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    // 调用云函数
    wx.cloud.callFunction({
      // 云函数名
      name: 'get_icons',
      success: res => {
        wx.hideLoading();

        let icons = res.result.data;

        icons.forEach(v => {
          v.isActive = false;
        })

        this.setData({
          icons
        })
      },
      fail: err => {
        wx.hideLoading();
        console.log('err=>>>', err);
      }

    })
  },

  // 设置选择日期
  setDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    const startDate = `${year}-01-01`;
    const endDate = `${year}-${month}-${day}`;

    // console.log(startDate);
    // console.log(endDate);

    this.setData({
      startDate,
      endDate
    })
  },

  // 选择图标
  selectIcon(e) {
    const {
      index
    } = e.currentTarget.dataset;

    let icons = this.data.icons;

    icons.forEach((v, i) => {
      v.isActive = index === i;
    })

    this.setData({
      icons
    })


  },

  // 选择账户
  selectAccount(e) {
    const {
      index
    } = e.currentTarget.dataset;

    let accounts = this.data.accounts;

    accounts.forEach((v, i) => {
      v.isActive = index === i;
    })

    this.setData({
      accounts
    })

  },

  // 选择日期
  selectDate(e) {

    const {
      value
    } = e.detail;

    let {
      infos
    } = this.data;
    infos.date = value;

    this.setData({
      infos
    })
  },

  // 输入金额
  inputPrice(e) {
    const {
      value
    } = e.detail;

    let {
      infos
    } = this.data;

    infos.price = value;

    this.setData({
      infos
    })

  },

  // 输入备注
  inputNote(e) {
    const {
      value
    } = e.detail;

    let {
      infos
    } = this.data;

    infos.note = value;

    this.setData({
      infos
    })
  },

  // 保存
  save() {
    const {

      tabs,
      icons,
      accounts,
      infos
    } = this.data;


    // 获取是否支付收入信息
    let trend = null;
    tabs.forEach(v => {
      if (v.isActive) {
        trend = {
          title: v.title,
          isPay: v.isPay
        };
      }
    });



    // 获取类别
    let icon = null;
    icons.forEach(v => {
      if (v.isActive) {
        icon = {
          title: v.title,
          type: v.type,
          url: v.url
        };
      }
    });

    if (!icon) {
      wx.showToast({
        title: '未选择消费类型',
        icon: 'none',
        duration: 1500,
        mask: false
      });

      return;
    }

    // 获取账户
    let account = '';
    accounts.forEach(v => {
      if (v.isActive) {
        account = v.title;
      }
    })


    // 判断信息是否规范
    if (!infos.date) {
      wx.showToast({
        title: '未选择日期',
        icon: 'none',
        duration: 1500,
        mask: false
      });

      return;
    }

    if (!infos.price) {
      wx.showToast({
        title: '未输入金额',
        icon: 'none',
        duration: 1500,
        mask: false
      });

      return;
    }

    // 获取小数长度
    let isSpot_index = (infos.price + '').indexOf(".");
    let decimalLength = isSpot_index === -1 ? 1 : infos.price.substring(isSpot_index, infos.price.length).length - 1;
    if (isNaN(infos.price) || infos.price == 0 || decimalLength > 2) {
      wx.showToast({
        title: '请输入正确金额，且不能超过2位小数',
        icon: 'none',
        duration: 1500,
        mask: false
      });

      return;
    }
    infos.price = parseFloat(infos.price);


    const data = {
      trend,
      icon,
      account,
      infos
    }

    this.addDbData(data)

  },

  // 获取用户信息
  getUserInfo(e) {
    // console.log(e.detail.userInfo);
    const userInfo = e.detail.userInfo;

    wx.setStorageSync('user_info', userInfo);

    this.setData({
      userInfo
    })

  },

  // 添加数据进入数据库
  addDbData(data) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    // 调用云函数
    wx.cloud.callFunction({
      // 云函数名
      name: 'add_data',
      // 参数
      data,
      success: res => {
        // 提示框关闭加载提示框
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      },
      fail: err => {
        wx.hideLoading();
        console.log('err=>>>', err);
      }

    })
  }

})