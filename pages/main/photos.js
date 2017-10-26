// pages/main/photos.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhotoPreview: false,
    currentPhotoPreviewItem: {},
    currentImageItems: [],
    imageHeight: '90px',
    babys: [],
    showNav: false,
    focusBabyId: 1,
    currentPhotoPreviewItemWidth: '320px',
    currentPhotoPreviewItemHeight: '240px',
    screenWidth: null,
    screenHeight: null,
  },

  onTapBaby: function (e) {
    let babyId = e.currentTarget.dataset.babyid;
    util.log(babyId);
    this.setData({ focusBabyId: babyId });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      let showNav = app.globalData.babys && app.globalData.babys.length > 1;
      this.setData({
        babys: app.globalData.babys,
        showNav: showNav,
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        util.log(res);
        let height = (res.screenWidth - 18) / 3;
        this.setData({ imageHeight: height + 'px', screenWidth: res.screenWidth, screenHeight: res.screenHeight })
        this.init();
      },
      fail: function (err) {

      }
    })
  },

  init: function () {
    let imageItems = [];
    for (let i = 0; i < 20; i++) {
      let imageItem = {};
      imageItem.id = i;
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

  },

  onClickImageItem: function (e) {
    let item = e.target.dataset.item;
    let maxHeightPWidth = this.data.screenHeight * 2 / 3 / this.data.screenWidth;
    let targetHeight = 240;
    let targetWidth = 320;
    this.setData({
      showPhotoPreview: true,
    })
    util.log("get item:" + item.url);
    wx.getImageInfo({
      src: item.url,
      success: (res) => {
        util.log(res.width);
        util.log(res.height);
        let heightPWidth = res.height / res.width;
        if (heightPWidth > maxHeightPWidth) {
          //height image , cut width;
          targetHeight = this.data.screenHeight * 2 / 3;
          targetWidth = targetHeight / heightPWidth;
        } else {
          //just showfullWidth;
          targetWidth = this.data.screenWidth;
          targetHeight = this.data.screenWidth * heightPWidth;
        }
        util.log("targetWidth:" + targetWidth);
        util.log("targetHeight:" + targetHeight);
        this.setData({
          currentPhotoPreviewItem: item,
          currentPhotoPreviewItemWidth: targetWidth + 'px',
          currentPhotoPreviewItemHeight: targetHeight + 'px'
        })
      },
      fail: function (err) {
        util.log(err)
      },
      complete: function () {
        util.log("complete")
      }
    });
  },

  onTapPreivewLayout: function () {
    this.setData({
      showPhotoPreview: false,
      currentPhotoPreviewItem: {}
    })
  }
})