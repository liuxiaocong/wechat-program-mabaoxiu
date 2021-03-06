// pages/main/info.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhotoPreview: false,
    currentPhotoPreviewItem: {},
    userAvatar: '/pages/images/default-avatar.png',
    userName: '请设置昵称',
    showSign: true,
    children: [],
    defaultAvatar: "/pages/images/baby-default.jpg",
    currentPhotoPreviewItemChildId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfoReadyCallback = () => {
      console.log("userInfoReadyCallback");
      let userAvatar = '/pages/images/default-avatar.png';
      if (app.globalData.userInfo) {
        userAvatar = app.globalData.userInfo.avatarUrl;
      }
      this.setData({
        userAvatar: userAvatar,
        userName: this.getParentName(),
      })
    };
    wx.getSystemInfo({
      success: (res) => {
        util.log(res);
        let height = (res.screenWidth - 18) / 3;
        this.setData({ imageHeight: height + 'px', screenWidth: res.screenWidth, screenHeight: res.screenHeight });
      },
      fail: function (err) {

      }
    })
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
    let userAvatar = '/pages/images/default-avatar.png';
    if (app.globalData.userInfo) {
      userAvatar = app.globalData.userInfo.avatarUrl;
    }
    let showSign = true;
    if (app.globalData.accountInfo && app.globalData.accountInfo.hasSigned) {
      showSign = false;
    }
    this.setData({
      userAvatar: userAvatar,
      userName: this.getParentName(),
      hasUserInfo: true,
      children: children,
      accountInfo: JSON.stringify(app.globalData.accountInfo),
      aliyunPolicy: JSON.stringify(app.globalData.aliyunPolicy),
      showSign: showSign
    })
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
    let count = 9;
    let child = this.getChildById(childId);
    let leftCount = 25;
    if (child && child.templates) {
      leftCount = 25 - child.templates.length;
    }
    if (leftCount <= 0) {
      wx.showModal({
        title: '数量限制',
        content: '最多只能添加25个模版，请先删除旧模版',
      })
      return;
    } else if (leftCount < count) {
      count = leftCount;
    }
    console.log(child);
    util.log(childId);
    util.uploadTemplateToAliyun(
      count,
      aliyunPolicy,
      openId,
      token,
      childId,
      (res) => {
        util.log("info uploadTemplateToAliyun success");
        util.log(res);
        if (res.count > 0) {
          this.refreshAccountInfo();
        }
        wx.showModal({
          title: res.title,
          content: res.message,
          showCancel: false
        })
      }
    )
  },
  getChildById(id) {
    if (this.data.children) {
      for (let i = 0; i < this.data.children.length; i++) {
        if (this.data.children[i].childId === id) {
          return this.data.children[i];
        }
      }
    }
    return null;
  },

  refreshAccountInfo: function () {
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
      fail: (err) => {
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
    wx.showToast({
      title: '签到中',
      icon: 'loading'
    })


    wx.getLocation({
      success: (res) => {
        let lat = res.latitude;
        let lon = res.longitude;
        this.signWithLocaltion(lat, lon);
      },
      fail: () => {
        this.signWithLocaltion(null, null);
      }
    })
  },

  signWithLocaltion: function (lat, lon) {
    let url = api.signIn;
    let data = {};
    if (lat && lon) {
      data = {
        latitude: lat,
        longitude: lon
      }
    }
    util.log(data);
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("signIn success");
        util.log(res);
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.code == 20000) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1000
          })
          this.setData({
            showSign: false
          })
        } else if (res.statusCode == 200 && res.data.code == 30400) {
          wx.showModal({
            title: res.data.message,
            showCancel: false
          })
          this.setData({
            showSign: false
          })
        } else {
          wx.showModal({
            title: '签到失败',
            content: '请稍后重试',
          })
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showModal({
          title: '签到失败',
          content: '请稍后重试',
        })
      },
    })
  },

  onClickImageItem: function (e) {
    let { itemid, idx} = e.target.dataset
    const pureImgs = this.data.children[idx].templates
    
    util.navigate2PreImg(pureImgs, itemid, 'info')
  }
})