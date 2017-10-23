// pages/main/info.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar: '/pages/images/default-avatar.png',
    userName: '请设置昵称',
    showSign: true,
    babys:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userAvatar: app.globalData.userInfo.avatarUrl,
        userName: app.globalData.userInfo.nickName,
        hasUserInfo: true,
        babys: app.globalData.babys
      })
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

  clickEditName: function() {
    wx.navigateTo({
      url: '/pages/setName/setName'
    })
  },

  clickEditBaby: function(e){
    util.log(e.target.dataset.id);
    wx.navigateTo({
      url: '/pages/setBaby/setBaby?id=' + e.target.dataset.id,
    })
  },

  goWeui: function () {
    wx.navigateTo({
      url: '/example/index'
    })
  },

  doSign: function () {
    wx.showLoading({
      title: '签到中',
    })
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '签到成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        showSign: false
      })
    }, 1000)
  }
})