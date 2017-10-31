// pages/main/favorite.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentImageItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imageItems = [];
    for (let i = 0; i < 20; i++) {
      let imageItem = {};
      imageItem.id = i;
      imageItem.comment = [];
      if (i % 2 == 0) {
        imageItem.url = 'https://www.colourbox.com/preview/2536639-bright-picture-of-adorable-baby-boy-over-white.jpg';
        imageItem.isFavoritesd = true;
      } else {
        imageItem.url = 'http://img0.utuku.china.com/640x0/news/20170622/9270ae73-5e70-4cc8-8b67-e8e50790e770.jpg';
        imageItem.isFavoritesd = false;
      }
      imageItems.push(imageItem);
    }
    util.log(imageItems);
    this.setData({ currentImageItems: imageItems });
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
  
  }
})