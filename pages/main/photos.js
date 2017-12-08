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
    pureImgs: [],
    showNav: false,
    focusChildId: 1,
    defaultAvatar: "/pages/images/baby-default.jpg",
    isLoading: false,
    currentPage: 0,
    isEnd: false,
  },

  onTapBaby: function (e) {
    // 点击宝贝头像切换宝贝
    if (this.data.isLoading) {
      return;
    }
    let childid = e.currentTarget.dataset.childid;
    util.log(childid);
    this.setData({ focusChildId: childid, currentPage: 0, currentImageItems:[],isLoading:true });
    this.load(childid, this.data.currentPage, pageSize, false)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { accountInfo } = app.globalData
    const { children } = accountInfo
    if (accountInfo) {
      let showNav = children && children.length > 1;
      this.setData({
        children,
        showNav
      })
    }
    this.init()
  },

  init: function () {
    const { accountInfo } = app.globalData
    
    if (accountInfo && accountInfo.children) {
      const { childId } = accountInfo.children[0];
      this.setData({
        focusChildId: childId,
        currentPage: 0
      })
    }
  },



  load: function (childId, page, size, isLoadMore) {
    util.log("load:" + page + "," + size);
    let url = api.getChildPhotoList + "?childId=" + childId + "&pageNo=" + page + "&pageSize=" + pageSize;
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
        if (res.statusCode == 200 && res.data.code == 20000) {
    
          let currentImageItemsData = [];
          if (isLoadMore) {
            currentImageItemsData = this.data.currentImageItems;
          }
          const { results, totalRecord } = res.data.data
      
          if (results) {
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
            pureImgs: results,
            isLoading: false,
            isEnd: isEnd,
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
    const { focusChildId, currentPage } = this.data
    this.load(focusChildId, 0, pageSize, false)
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
      this.load(this.data.focusChildId, this.data.currentPage, pageSize, true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onClickImageItem: function (e) {
    const {itemid} = e.target.dataset
    const { pureImgs } = this.data

    util.navigate2PreImg(pureImgs, itemid, 'photos')
    
  }
})