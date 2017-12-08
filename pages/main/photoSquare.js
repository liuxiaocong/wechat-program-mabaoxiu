// pages/main/photos.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
const pageSize = 50;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentImageItems: [],
    children: [],
    showNav: false,
    focusChildId: 1,
    defaultAvatar: "/pages/images/baby-default.jpg",
    isLoading: false,
    currentPage: 0,
    isEnd: false,
    pureImgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.accountInfo) {
      this.setData({
        children: app.globalData.accountInfo.children
      })
    }
  },

  init: function () {
    this.setData({
      currentPage:0
    })
    this.load(this.data.currentPage, pageSize, false);
  },

  load: function (page, size, isLoadMore) {
    let url = api.getPlazaPhotoList + "?pageNo=" + page + "&pageSize=" + pageSize;
    util.log(url);
    this.setData({
      isLoading: true
    })
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("getPlazaPhotoList success");
        if (res.statusCode == 200 && res.data.code == 20000) {
          let currentImageItemsData = [];
          if (isLoadMore) {
            currentImageItemsData = this.data.currentImageItems;
          }
          const { results, totalRecord } = res.data.data
          if ( results ) {
            currentImageItemsData = util.insertTimeBlock(results)
          }
          let newPage = page + 1;
          let isEnd = false;
          if (totalRecord <= currentImageItemsData.length) {
            isEnd = true;
          }
          this.setData({
            currentImageItems: currentImageItemsData,
            currentPage: newPage,
            isLoading: false,
            isEnd: isEnd,
            pureImgs: results
          });
        } else {
          this.setData({
            isLoading: false
          })
          wx.showModal({
            title: '获取广场数据失败',
            content: '',
          })
        }
      },
      fail: function (err) {
        util.log("getPlazaPhotoList fail");
        util.log(err);
        this.setData({
          isLoading: false
        })
        wx.showModal({
          title: '获取广场数据失败',
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
    this.init();
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
    util.log("onReachBottom:" + this.data.isEnd);
    if (!this.data.isEnd) {
      this.load(this.data.currentPage, pageSize, true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onClickImageItem: function (e) {
    let { itemid } = e.target.dataset
    const { pureImgs } = this.data
    
    util.navigate2PreImg(pureImgs, itemid, 'photoSquare')
  }
})