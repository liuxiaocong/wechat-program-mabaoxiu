// pages/splash/splash.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
const defaultUrl = '/pages/main/notification';
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
        app.globalData.userInfo = res.userInfo;
        console.log(res.userInfo);
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
      fail: err=>{
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
      }
    })
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

  getAccountInfo: () => {
    let url = api.getParentInfo + '?openId=' + app.globalData.openId;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("getAccountInfo success");
        util.log(JSON.stringify(res));
        app.globalData.accountInfo = res.data.data;
        app.globalData.children = res.data.data.children;
        // wx.switchTab({
        //   url: '/pages/main/info'
        // })
        wx.switchTab({
          url: defaultUrl
        })
      },
      fail: function (err) {
        util.log("getParentInfo fail");
        util.log(err);
        wx.showModal({
          title: '获取用户数据失败，请退出重进',
          content: JSON.stringify(err),
        })
      },
    })
  },

  getAliyunPolicy: ()=> {
    let url = api.getAliyunPolicy;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("getAliyunPolicy success");
        util.log(res);
        app.globalData.aliyunPolicy = res.data.data;
        // wx.switchTab({
        //   url: '/pages/main/info'
        // })
        wx.switchTab({
          url: defaultUrl
        })
      },
      fail: function (err) {
        util.log("getAliyunPolicy fail");
        util.log(err);
      },
    })
  },

  sumbitCodeToServer: function (code) {
    let url = api.wxLogin;
    util.log("start wxlogin:" + code);
    wx.request({
      url: url,
      data: {
        "appId": api.appid,
        "jsCode": code
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        util.log("wxLogin success");
        util.log(res);
        let code = res.data.code;
        util.log("code:" + code);
        if (code === 40101 || code === 20000) {
          let token = res.data.data.token;
          let openId = res.data.data.openId;
          util.log("token:" + token);
          util.log("openId:" + openId);
          app.globalData.token = token;
          app.globalData.openId = openId;
        }
        if (code === 20000) {
          this.getAccountInfo();
          this.getAliyunPolicy();
        } else {
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      },
      fail: function (err) {
        util.log("wxLogin fail");
        util.log(err)
        wx.showModal({
          title: '授权失败',
          content: '请退出小程序重新进入',
        })
      },
    })
  }
})