// pages/setName/setName.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentName:'',
    submitBtnDisable: true,
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
    let name = "";
    if (app.globalData.accountInfo)
    {
      name = app.globalData.accountInfo.name;
    } else if (app.globalData.userInfo){
      name = app.globalData.userInfo.nickName;
    }
    this.setData({
      currentName: name
    })
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

  onNameChange:function(e){
    if (e.detail.value) {
      if(e.detail.value == this.data.currentName)
      {
        this.setData({
          submitBtnDisable: true
        })
      }else{
        this.setData({
          submitBtnDisable: false
        })
      }
    } else {
      this.setData({
        submitBtnDisable: true
      })
    }
  },

  formSubmit: function (e) {
    console.log(e.detail.value);
    let token = app.globalData.token;
    let phone = app.globalData.accountInfo.phoneNum;
    let url = api.updateParentInfo
    let values = e.detail.value;
    let name = values.name;
    let rData = {
      "phoneNum": phone,
      "name": name
    };
    console.log(rData);
    wx.showLoading({
      title: '更新中',
    })
    wx.request({
      url: url,
      data: rData,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': token
      },
      success: (res) => {
        wx.hideLoading();
        util.log("updateParentInfo success");
        util.log(res);
        let code = res.data.code;
        util.log("code:" + code);
        if (code === 20000) {
          app.globalData.accountInfo.name = name;
          wx.showToast({
            icon: 'success',
            title: '更新成功',
            duration: 1000,
            complete:()=>{
              setTimeout(()=>{
                wx.switchTab({
                  url: '/pages/main/info'
                })
              },1000)
            }
          })
        } else {
          wx.showModal({
            title: '更新失败',
            content: res,message,
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        util.log("updateParentInfo fail");
        util.log(err)
        wx.showModal({
          title: '更新失败',
          content: JSON.stringify(err),
        })
      },
    })
  }
})