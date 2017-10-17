// pages/splash/splash.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: res => {
        console.log("getUserInfo success");
        console.log(res.userInfo);
      }
    })
    if (app.globalData.codeToServer !== null) {
      console.log(app.globalData);
      //todo login with server
      this.sumbitCodeToServer(app.globalData.codeToServer);
    } else {
      app.loginSuccessCallback = code => {
        console.log("code to server" + code);
        console.log(app.globalData);
        //todo login with server
        this.sumbitCodeToServer(code);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 
  sumbitCodeToServer: function(code){
    let time = 1000;
    if (app.globalData.isDebug)
    {
      time = 0;
    }
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/main/info'
      })
      // wx.redirectTo({
      //   url: '/pages/index/index'
      // })
    }, time);
  }
})