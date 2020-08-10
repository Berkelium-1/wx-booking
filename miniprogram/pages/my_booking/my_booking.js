// pages/my_booking/my_booking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingData: []
  },

  onShow() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getBookingData();
  },

  // 获取账单数据
  getBookingData() {
    // wx.getUserInfo({
    //   success: (result) => {
    //     console.log(result);

    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });


    // 调用云函数
    wx.cloud.callFunction({
      // 云函数名
      name: 'get_data',
      success: res => {
        // console.log(res);

        let {
          bookingData
        } = this.data;

        bookingData = res.result.data;

        this.setData({
          bookingData

        });

        wx.hideLoading();
      },
      fail: err => {
        wx.hideLoading();
        console.log('err=>>>', err);
      }
    })
  },

  delItem(e) {
    // console.log(e);
    const {
      key
    } = e.currentTarget.dataset;

    wx.showModal({
      title: '删除此记账',
      showCancel: true,
      cancelText: '取消',
      confirmText: '删除',
      success: (result) => {
        if (result.confirm) {

          wx.showLoading({
            title: '删除中',
            mask: true
          });

          // 调用云函数
          wx.cloud.callFunction({
            // 云函数名
            name: 'del_data',
            // 参数
            data: {
              _id: key
            },
            success: res => {

              console.log('res=>', res);
              // 提示框关闭加载提示框
              wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 1500,
                mask: false,
                success: () => {
                  // 重新获取数据
                  this.getBookingData();
                }
              });
            },
            fail: err => {
              wx.hideLoading();
              console.log('err=>>>', err);
            }
          });
        }
      }
    });

  }
})