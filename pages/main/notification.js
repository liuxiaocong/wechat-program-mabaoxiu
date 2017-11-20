// pages/main/notification.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
const pageSize = 50;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNofications: [],
    currentPage: 0,
    isEnd: false,
    isLoading: false
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
    this.setData({
      currentPage: 0,
      isEnd: false
    })
    this.load(this.data.currentPage, pageSize, false);
  },

  load: function (page, size, isLoadMore) {
    if (this.data.isLoading) {
      return;
    }
    util.log("load:" + page + "," + size);
    let url = api.getBulletinList;
    util.log(url);
    this.setData({
      isLoading: true
    })
    let data = {
      "pageNo": page,
      "pageSize": size,
    }
    util.log(data);
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: (res) => {
        util.log("getBulletinList success");
        if (res.statusCode == 200 && res.data.code == 20000) {
          console.log(res.data.data);
          let currentNofications = [];
          if (isLoadMore) {
            currentNofications = this.data.currentNofications;
          }
          let lastDisplayData = null;
          if (res.data.data.results) {
            for (let i = 0; i < res.data.data.results.length; i++) {
              let displayDate = util.getYearMonthDisplayDate(res.data.data.results[i].ctime);
              let day = util.getDisplayMonthDate(res.data.data.results[i].ctime);
              res.data.data.results[i].displayDate = displayDate;
              res.data.data.results[i].day = day;
              if (res.data.data.results[i].subTitle) {
                res.data.data.results[i].hasSubtitle = true;
              } else {
                res.data.data.results[i].hasSubtitle = false;
              }
              if (res.data.data.results[i].detail) {
                res.data.data.results[i].hasLink = true;
              } else {
                res.data.data.results[i].hasLink = false;
              }

              switch (res.data.data.results[i].type) {
                case 1: {

                }
                  break;
                case 2: {

                }
                  break;
                default: {
                  if (i % 2 === 0) {
                    res.data.data.results[i].icon = '/pages/images/login-code.png';
                  } else {
                    res.data.data.results[i].icon = '/pages/images/warn.png';
                  }
                }
              }
              currentNofications.push(res.data.data.results[i]);
            }
          }
          let newPage = page + 1;
          let isEnd = false;
          if (res.data.data.totalRecord <= currentNofications.length) {
            isEnd = true;
          }
          this.setData({
            currentNofications: currentNofications,
            currentPage: newPage,
            isLoading: false,
            isEnd: isEnd,
          });
        } else {
          this.setData({
            isLoading: false
          })
          wx.showModal({
            title: '获取数据失败'
          })
        }
      },
      fail: function (err) {
        util.log("getBulletinList fail");
        util.log(err);
        this.setData({
          isLoading: false
        })
        wx.showModal({
          title: '获取数据失败',
          content: JSON.stringify(err),
        })
      },
    })
  },

  onTapNotification: function (e) {
    let url = encodeURI(e.currentTarget.dataset.url);
    util.log("onTapNotification url:" + url);
    wx.navigateTo({
      url: '/pages/webview?url=' + url
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
      this.load(this.data.currentPage, pageSize, true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})