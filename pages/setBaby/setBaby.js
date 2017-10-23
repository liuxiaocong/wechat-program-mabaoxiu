// pages/setBaby/setBaby.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    currentName: null,
    currentRelation:null,
    relations: ["母子", "父子", "母女","父女","其他"],
    relationIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = parseInt(options.id);
    let baby = app.getBabyById(id);
    util.log(baby);
    this.setData({ id: id, currentName: baby.name, currentRelation: baby.relation })
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
  },

  bindRelationChange: function (e) {
    util.log('picker relation' + e.detail.value);
    this.setData({
      relationIndex: e.detail.value
    })
  },
})