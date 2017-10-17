//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    src:'https://mp.weixin.qq.com/debug/wxadoc/gitbook/images/head_global_z_@2.png',
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    codeBtnDisable:false
  },
  //事件处理函数
  bindCountryCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goTest:function(){
    wx.navigateTo({
      url: '../test/test'
    })
  },

  getCode:function(){
    this.setData({
      codeBtnDisable: true
    })
    setTimeout(()=>{
      this.setData({
        codeBtnDisable: false
      })
    },60 * 1000);
  }, 

  goWeui:function(){
    wx.navigateTo({
      url: '/example/index'
    })
  },
  changeName:function(){
    this.setData({
      name:'Mina'
    })
  },

  doLogin:function(){
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      duration: 2000
    })
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/main/info'
      })
    }, 2000)
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
