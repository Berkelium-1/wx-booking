// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  onShow: function (options) {
    const userInfo = wx.getStorageSync('user_info');
    // console.log(userInfo);

    if (userInfo) {
      this.setData({
        isUser: true,
        userInfo
      })
    }
  },
  getUserInfo(e) {
    const userInfo = e.detail.userInfo;

    wx.setStorageSync('user_info', userInfo);

    this.setData({
      userInfo
    })

  }
})