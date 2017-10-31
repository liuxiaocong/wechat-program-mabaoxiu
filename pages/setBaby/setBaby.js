// pages/setBaby/setBaby.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childid: null,
    currentName: null,
    currentRelation: null,
    relations: ["母子", "父子", "母女", "父女", "未定义"],
    relationIndex: 4,
    submitBtnDisable: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let childid = options.childid;
    console.log(childid);
    let child = app.getChildById(childid);
    util.log(child);
    let typeIndex = 4;
    if (child.relationType) {
      for (let i = 0; i < this.data.relations.length; i++) {
        if (this.data.relations[i] == child.relationType) {
          typeIndex = i;
          break;
        }
      }
    }
    let currentRelationStr = this.data.relations[typeIndex];
    this.setData({ childid: childid, relationIndex: typeIndex, currentName: child.name, currentRelation: currentRelationStr })
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

  onNameChange: function (e) {
    if (e.detail.value) {
      if (e.detail.value == this.data.currentName) {
        this.setData({
          submitBtnDisable: true
        })
      } else {
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
    let values = e.detail.value;
    let name = values.name;
    let relation = this.data.relations[this.data.relationIndex];
    let token = app.globalData.token;
    let childid = this.data.childid;
    let url = api.updateChildInfo;
    let rData = {
      "childId": childid,
      "name": name,
      "relationType": relation,
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
        util.log("updateChildInfo success");
        util.log(res);
        let code = res.data.code;
        util.log("code:" + code);
        if (code === 20000) {
          app.updateChildById(childid,
          {
            "name": name,
            "relationType": relation,
          })
          wx.showToast({
            icon: 'success',
            title: '更新成功',
            duration: 1000,
            complete: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/main/info'
                })
              }, 1000)
            }
          })
        } else {
          wx.showModal({
            title: '更新失败',
            content: res, message,
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        util.log("updateChildInfo fail");
        util.log(err)
        wx.showModal({
          title: '更新失败',
          content: JSON.stringify(err),
        })
      },
    })
  },

  bindRelationChange: function (e) {
    util.log('picker relation' + e.detail.value);
    let currentRelationStr = this.data.relations[e.detail.value];
    let submitDisable = false;
    if (currentRelationStr === this.data.currentRelation) {
      submitDisable = true;
    }
    this.setData({
      relationIndex: e.detail.value,
      submitBtnDisable: submitDisable
    })
  },
})