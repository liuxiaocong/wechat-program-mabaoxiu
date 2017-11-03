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
    children: [],
    defaultAvatar: "/pages/images/baby-default.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    util.log("info onshow");
    let children = [];
    if (app.globalData.accountInfo && app.globalData.accountInfo.children) {
      children = app.globalData.accountInfo.children;
    }
    children.forEach((child) => {
      if (!child.relationType) {
        child.relationType = "未定义"
      }
      child.canAddTemplate = child.templates.length < 25;
    })
    if (app.globalData.userInfo) {
      this.setData({
        userAvatar: app.globalData.userInfo.avatarUrl,
        userName: this.getParentName(),
        hasUserInfo: true,
        children: children,
        accountInfo: JSON.stringify(app.globalData.accountInfo),
        aliyunPolicy: JSON.stringify(app.globalData.aliyunPolicy),
      })
    }
  },

  getRelationShipByType: function (relationType) {
    switch (relationType) {
      case 0: {
        return '未定义';
      }
      case 1: {
        return '母子';
      }
      case 2: {
        return '父子';
      }
      default: {
        return '未定义';
      }
    }
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

  clickEditName: function () {
    wx.navigateTo({
      url: '/pages/setName/setName'
    })
  },

  getParentName: function () {
    if (app.globalData.accountInfo) {
      return app.globalData.accountInfo.name;
    } else {
      return app.globalData.userInfo.nickName;
    }
  },

  clickEditBaby: function (e) {
    util.log(e.target.dataset.childid);
    wx.navigateTo({
      url: '/pages/setBaby/setBaby?childid=' + e.target.dataset.childid,
    })
  },

  clickAddTemplate: function (e) {
    let childId = e.target.dataset.childid;
    let aliyunPolicy = app.globalData.aliyunPolicy;
    let openId = app.globalData.openId;
    let token = app.globalData.token;
    util.log(childId);
    util.uploadTemplateToAliyun("http://www.lucid.ac.uk/media/1436/baby-pointing-cropped.jpg?width=740&height=550&mode=crop&quality=75",
      aliyunPolicy,
      openId,
      token,
      childId,
      (res) => {
        util.log("info uploadTemplateToAliyun success");
        util.log(res);
        if(res.code === 20000)
        {
          let data =res.data;
          console.log(data);
          this.setData({
            uploadCallbackInfo: data
          })
          this.refreshAccountInfo();
        }else{
          wx.showModal({
            title: '上传失败',
            content: res.message,
          })
        }
      }, (err)=> {
        this.setData({
          uploadCallbackInfo: JSON.stringify(err)
        })
        util.log("uploadTemplateToAliyun fail");
        util.log(err);
      }
    )
  },

  refreshAccountInfo: () => {
    let url = api.getParentInfo + '?openId=' + app.globalData.openId;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("refreshAccountInfo success");
        util.log(JSON.stringify(res));
        app.globalData.accountInfo = res.data.data;
        app.globalData.children = res.data.data.children;
        this.setData({
          children: app.globalData.children
        })
        
      },
      fail: function (err) {
        util.log("refreshAccountInfo fail");
        util.log(err);
      },
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