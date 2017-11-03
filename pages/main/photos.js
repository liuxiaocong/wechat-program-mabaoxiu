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
    showPreviewPhoto: false,
    currentImageItems: [],
    imageHeight: '90px',
    children: [],
    showNav: false,
    focusChildId: 1,
    currentPhotoPreviewItemWidth: '320px',
    currentPhotoPreviewItemHeight: '240px',
    screenWidth: null,
    screenHeight: null,
    defaultAvatar: "/pages/images/baby-default.jpg",
    isLoading:false,
  },

  onTapBaby: function (e) {
    if (this.data.isLoading)
    {
      return;
    }
    let childid = e.currentTarget.dataset.childid;
    util.log(childid);
    this.load(childid, 0, 50)
    this.setData({ focusChildId: childid });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.accountInfo) {
      let showNav = app.globalData.accountInfo.children && app.globalData.accountInfo.children.length > 1;
      this.setData({
        children: app.globalData.accountInfo.children,
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
    let child;
    if (app.globalData.accountInfo && app.globalData.accountInfo.children) {
      child = app.globalData.accountInfo.children[0];
      this.setData({
        focusChildId: child.childId
      })
      this.load(child.childId, 0, 50);
    }
  },

  load: function (childId, page, size) {
    let url = api.getChildPhotoList + "?childId=" + childId + "&pageNo=0&pageSize=50";
    util.log(url);
    this.setData({
      isLoading:true
    })
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("getChildPhotoList success");
        if (res.statusCode == 200 && res.data.code == 20000) {
          console.log(res.data.data.results);
          this.setData({ 
            currentImageItems: res.data.data.results,
            isLoading: false
            });
        } else {
          this.setData({
            isLoading: false
          })
          wx.showModal({
            title: '获取用户数据失败',
            content: JSON.stringify(err),
          })
        }
      },
      fail: function (err) {
        util.log("getChildPhotoList fail");
        util.log(err);
        this.setData({
          isLoading: false
        })
        wx.showModal({
          title: '获取用户数据失败',
          content: JSON.stringify(err),
        })
      },
    })
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
    let itemid = e.target.dataset.itemid;
    util.log(itemid);
    let item = {};
    for (let i = 0; i < this.data.currentImageItems.length;i++)
    {
      if (itemid === this.data.currentImageItems[i].id)
      {
        item = this.data.currentImageItems[i];
        break;
      }
    }
    util.log(item);
    let maxHeightPWidth = this.data.screenHeight * 2 / 3 / this.data.screenWidth;
    let targetHeight = 240;
    let targetWidth = 320;
    this.setData({
      showPhotoPreview: true,
      showPreviewPhoto: false,
      currentPhotoPreviewItem: item,
      currentPhotoPreviewItemWidth: targetWidth + 'px',
      currentPhotoPreviewItemHeight: targetHeight + 'px'
    })
  },

  onTapPreivewLayout: function () {
    this.setData({
      showPhotoPreview: false,
      currentPhotoPreviewItem: {}
    })
  },

  onTapFavorite: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    console.log(imageId);
  },

  onTapUnFavorite: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    console.log(imageId);
  },

  onPreviewImageLoad: function(e){
    util.log("onPreviewImageLoad");
    util.log(e.detail);
    let maxHeightPWidth = this.data.screenHeight * 2 / 3 / this.data.screenWidth;
    let targetHeight = 240;
    let targetWidth = 320;
    let heightPWidth = e.detail.height / e.detail.width;
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
      showPreviewPhoto:true,
      currentPhotoPreviewItemWidth: targetWidth + 'px',
      currentPhotoPreviewItemHeight: targetHeight + 'px'
    })
  },

  onTapDelete: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    console.log(imageId);
  },
})