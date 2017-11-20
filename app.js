//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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

  getChildById(id) {
    if (this.globalData.children) {
      for (let i = 0; i < this.globalData.children.length; i++) {
        if (this.globalData.children[i].childId === id) {
          return this.globalData.children[i];
        }
      }
    }
    return null;
  },

  globalData: {
    userInfo: null,
    accountInfo: null,
    codeToServer: null,
    token: null,
    openId: null,
    aliyunPolicy: null,
    children: [],
    isDebug: false,
  },

  updateChildById(id,obj) {
    if (this.globalData.children) {
      for (let i = 0; i < this.globalData.children.length; i++) {
        if (this.globalData.children[i].childId === id) {
          this.globalData.children[i] = Object.assign(this.globalData.children[i],obj);
          console.log(this.globalData.children[i]);
        }
      }
    }
  },
})