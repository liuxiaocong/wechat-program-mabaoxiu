//index.js
//获取应用实例
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const app = getApp();
Page({
  data: {
    name: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    src: 'https://mp.weixin.qq.com/debug/wxadoc/gitbook/images/head_global_z_@2.png',
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    codeBtnDisable: true,
    bindBtnDisable: true,
    phone: null,
    code: null,
  },
  //事件处理函数
  bindCountryCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goTest: function () {
    wx.navigateTo({
      url: '../test/test'
    })
  },

  getCode: function () {
    this.setData({
      codeBtnDisable: true
    });
    let token = app.globalData.token;
    let phone = this.data.phone;
    util.log("getCode token:" + token);
    wx.request({
      url: api.sendSmsCaptcha,
      data: {
        "appId": api.appid,
        "phoneNum": phone
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': token
      },
      success: function (res) {
        util.log("sendSmsCaptcha success");
        util.log(res.data);
      },
      fail: function (err) {
        util.log("sendSmsCaptcha fail");
        util.log(err)
      },
    })
    setTimeout(() => {
      this.setData({
        codeBtnDisable: false
      })
    }, 60 * 1000);
  },

  goWeui: function () {
    wx.navigateTo({
      url: '/example/index'
    })
  },
  changeName: function () {
    this.setData({
      name: 'Mina'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    let values = e.detail.value;
    let phone = values.phone;
    let code = values.code;
    let openid = app.globalData.openId;
    if (!openid) {
      wx.showModal({
        content: '授权失败，请退出重新进入小程序',
        showCancel: false,
        success: function (res) {

        }
      })
      return;
    }
    if (phone && code) {
      wx.showLoading({
        title: '登录中',
      });
      let token = app.globalData.token;
      let openId = app.globalData.openId;
      let phone = this.data.phone;
      wx.request({
        url: api.bindOpenIdToPhoneNum,
        data: {
          "appId": api.appid,
          "captcha": code,
          "openId": openId,
          "phoneNum": phone
        },
        method: 'POST',
        header: {
          'Authorization': token,
          'content-type': 'application/json' // 默认值
        },
        success: (res)=> {
          wx.hideLoading()
          util.log("bindOpenIdToPhoneNum success");
          util.log(res);
          let code = res.data.code;
          if(code === 20000)
          {
            let token = res.data.data.token;
            app.globalData.token = token;
            this.getAccountInfo();
            this.getAliyunPolicy();
          }else{
            wx.showToast({
              title: 'server error',
            })
            wx.showModal({
              content: res.data.message,
              showCancel: false,
              success: function (res) {

              }
            })
          }
        },
        fail: function (err) {
          wx.hideLoading();
          wx.showModal({
            content: JSON.stringify(err),
            showCancel: false,
            success: function (res) {

            }
          })
          util.log("bindOpenIdToPhoneNum fail");
          util.log(err)
        },
      })
    } else {
      wx.showModal({
        content: '请输入手机及验证码提示',
        showCancel: false,
        success: function (res) {

        }
      })
    }
  },
  getAliyunPolicy: () => {
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
      },
      fail: function (err) {
        util.log("getAliyunPolicy fail");
        util.log(err);
      },
    })
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
        wx.switchTab({
          url: '/pages/main/info'
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

  onPhoneChange: function (e) {
    if (e.detail.value) {
      if (this.data.code) {
        this.setData({
          phone: e.detail.value,
          bindBtnDisable: false,
          codeBtnDisable: false,
        })
      } else {
        this.setData({
          phone: e.detail.value,
          bindBtnDisable: true,
          codeBtnDisable: false,
        })
      }
    } else {
      this.setData({
        phone: null,
        bindBtnDisable: true,
        codeBtnDisable: true,
      })
    }
  },

  onCodeChange: function (e) {
    if (e.detail.value) {
      if (this.data.phone) {
        this.setData({
          code: e.detail.value,
          bindBtnDisable: false
        })
      } else {
        this.setData({
          code: e.detail.value,
          bindBtnDisable: true
        })
      }
    } else {
      this.setData({
        code: null,
        bindBtnDisable: true
      })
    }
  }
})
