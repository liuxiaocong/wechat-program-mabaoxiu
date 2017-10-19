//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.request({
      url: "https://apiloopstest.shabikplus.mozat.com/game/get_game_list?uid=200321&sig=bf6b13bd37ec4173b7b075dc92bf989a",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    // 登录
    wx.login({
      success: res => {
        console.log(res.code);
        this.globalData.codeToServer = res.code;
        if (this.loginSuccessCallback) {
          this.loginSuccessCallback(res.code)
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // wx.showModal({
              //   title: 'user info',
              //   content: JSON.stringify(res.userInfo),
              // })
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  getBabyById(id) {
    if (this.globalData.babys) {
      for (let i = 0; i < this.globalData.babys.length; i++) {
        if (this.globalData.babys[i].id === id) {
          return this.globalData.babys[i];
        }
      }
    }
    return null;
  },

  globalData: {
    userInfo: null,
    codeToServer: null,
    babys: [{
      id: 1,
      name: "baby1",
      age: 3,
      canAddTemplate: true,
      avatar: "/pages/images/baby-default.jpg", relation: "母子",
      templates: [
        {
          url: "/pages/images/baby-template-default.jpg"
        },
        {
          url: "/pages/images/baby-template-default.jpg"
        }, {
          url: "/pages/images/baby-template-default.jpg"
        },
        {
          url: "/pages/images/baby-template-default.jpg"
        },
        {
          url: "/pages/images/baby-template-default.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "baby2",
      age: 5,
      canAddTemplate: false,
      avatar: "/pages/images/baby-default.jpg",
      relation: "父子",
      templates: [
        {
          url: "/pages/images/baby-template-default.jpg"
        },
        {
          url: "/pages/images/baby-template-default.jpg"
        }, {
          url: "/pages/images/baby-template-default.jpg"
        },
        {
          url: "/pages/images/baby-template-default.jpg"
        },
        {
          url: "/pages/images/baby-template-default.jpg"
        }
      ]
    }],
    isDebug: false
  }
})