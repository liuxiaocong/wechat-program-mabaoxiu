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
    showPhotoPreview: false,
    currentPhotoPreviewItem: {},
    currentImageItems: [],
    imageHeight: '90px',
    children: [],
    showNav: false,
    focusChildId: 1,
    currentPhotoPreviewItemWidth: '320px',
    currentPhotoPreviewItemHeight: '240px',
    currentPhotoPreviewItemMarginTop: '30px',
    screenWidth: null,
    screenHeight: null,
    defaultAvatar: "/pages/images/baby-default.jpg",
    isLoading: false,
    isFaving: false,
    isDeleting: false,
    currentPage: 0,
    isEnd: false,
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
    wx.getSystemInfo({
      success: (res) => {
        util.log(res);
        let height = (res.screenWidth - 18) / 3;
        this.setData({ imageHeight: height + 'px', screenWidth: res.screenWidth, screenHeight: res.screenHeight })
      },
      fail: function (err) {

      }
    })
  },

  init: function () {
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
          console.log(res.data.data.results);
          let currentImageItemsData = [];
          if (isLoadMore) {
            currentImageItemsData = this.data.currentImageItems;
          }
          let lastDisplayData = null;
          if (res.data.data.results) {
            for (let i = 0; i < res.data.data.results.length; i++) {
              let displayDate = util.getDisplayDate(res.data.data.results[i].ctime);
              res.data.data.results[i].displayDate = displayDate;
              res.data.data.results[i].type = 0;
              if (!res.data.data.results[i].childIds)
              {
                res.data.data.results[i].childIds = [];
              }
              if (displayDate !== lastDisplayData) {
                lastDisplayData = displayDate;
                let t = new Date(res.data.data.results[i].ctime);
                let year = t.getFullYear();
                let month = t.getMonth() + 1;
                if (month < 10) {
                  month = '0' + month;
                }
                let date = t.getDate();
                if (date < 10) {
                  date = '0' + date;
                }
                let dataObject = {
                  type: 1,
                  year: year,
                  month: month,
                  date: displayDate,
                  monthDate: util.getDisplayMonthDate(res.data.data.results[i].ctime),
                  weekday: util.getDisplayWeekday(res.data.data.results[i].ctime)
                }
                currentImageItemsData.push(dataObject);
              }
              currentImageItemsData.push(res.data.data.results[i]);
            }
          }
          let newPage = page + 1;
          let isEnd = false;
          if (res.data.data.totalRecord <= currentImageItemsData.length) {
            isEnd = true;
          }
          this.setData({
            currentImageItems: currentImageItemsData,
            currentPage: newPage,
            isLoading: false,
            isEnd: isEnd,
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
    let itemid = e.target.dataset.itemid;
    util.log(itemid);
    let item = {};
    for (let i = 0; i < this.data.currentImageItems.length; i++) {
      if (itemid === this.data.currentImageItems[i].id) {
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
    if (this.data.isFaving) {
      return;
    }
    let imageId = e.currentTarget.dataset.imageid;
    util.log(imageId);
    if (this.data.children.length === 1) {
      doTapFavorite(imageId, this.data.children[0].childId)
    } else {
      let names = [];
      let childIds = [];
      for (let i = 0; i < this.data.children.length; i++) {
        names.push(this.data.children[i].name);
        childIds.push(this.data.children[i].childId);
      }
      util.log(names);
      wx.showActionSheet({
        itemList: names,
        success: (res) => {
          this.doTapFavorite(imageId, childIds[res.tapIndex]);
        },
        fail: function (res) {
          util.log(res.errMsg)
        }
      })
    }
  },

  doTapFavorite: function (imageId, childId) {
    let url = api.addPhotoToChosen;
    util.log(url);
    this.setData({
      isFaving: true
    })
    let data = {
      "childId": childId,
      "photoId": imageId,
    }
    util.log(data);
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        this.setData({
          isFaving: false
        });
        util.log("addPhotoToChosen put success");
        util.log(res);
        if (res.statusCode == 200 && res.data.code == 20000) {
          this.updatePhotoChosenStatus(imageId, childId, true);
          wx.showToast({
            title: '成功加入精选',
          })
        } else {
          wx.showModal({
            title: '加入精选失败',
            content: JSON.stringify(res.data.message),
          })
        }
      },
      fail: (err) => {
        util.log("addPhotoToChosen put fail");
        util.log(err);
        this.setData({
          isFaving: false
        })
        wx.showModal({
          title: '加入精选失败',
          content: JSON.stringify(err),
        })
      },
    })
  },
  removePhotoById: function (id) {
    let index = -1;
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === id) {
          index = i;
        }
      }
    }
    if (index >= 0) {
      this.data.currentImageItems.splice(index, 1);
      this.setData({
        currentImageItems: this.data.currentImageItems
      })
    }
  },

  updatePhotoChosenStatus: function (id, childId, isChosen) {
    util.log(id);
    let item = this.data.currentPhotoPreviewItem;
    if (item && item.id === id) {
      if (!item.childIds) {
        item.childIds = [];
      }
      if (isChosen) {
        item.childIds.push(childId);
      } else {
        item.childIds = [];
      }
      this.setData({
        currentPhotoPreviewItem: item
      })
    };
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === id) {
          if (!this.data.currentImageItems[i].childIds) {
            this.data.currentImageItems[i].childIds = [];
          }
          if (isChosen) {
            this.data.currentImageItems[i].childIds.push(childId);
          } else {
            this.data.currentImageItems[i].childIds = [];
          }
          this.setData({
            currentImageItems: this.data.currentImageItems
          })
          break;
        }
      }
    }
  },

  onTapUnFavorite: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    let childId = this.data.focusChildId;
    console.log(childId);
    console.log(imageId);
    let url = api.updateChosenByChildPhoto;
    util.log(url);
    this.setData({
      isFaving: true
    })
    let data = {
      "childId": childId,
      "photoId": imageId,
      "id": imageId
    }
    wx.request({
      url: url,
      method: 'DELETE',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        this.setData({
          isFaving: false
        });
        util.log("updateChosenByChildPhoto delete success");
        util.log(res);
        if (res.statusCode == 200 && res.data.code == 20000) {
          this.updatePhotoChosenStatus(imageId, childId, false);
          wx.showToast({
            title: '成功移出精选',
          })
        } else {
          wx.showModal({
            title: '移出精选失败',
            content: JSON.stringify(res.data.message),
          })
        }
      },
      fail: (err) => {
        util.log("updateChosenByChildPhoto delete fail");
        util.log(err);
        this.setData({
          isFaving: false
        })
        wx.showModal({
          title: '移出精选失败',
          content: JSON.stringify(err),
        })
      },
    })
  },

  onPreviewImageLoad: function (e) {
    util.log("onPreviewImageLoad");
    util.log(e.detail);
    let maxHeightPWidth = this.data.screenHeight * 3 / 4 / this.data.screenWidth;
    let targetHeight = 240;
    let targetWidth = 320;
    let heightPWidth = e.detail.height / e.detail.width;
    if (heightPWidth > maxHeightPWidth) {
      //height image , cut width;
      targetHeight = this.data.screenHeight * 3 / 4;
      targetWidth = targetHeight / heightPWidth;
    } else {
      //just showfullWidth;
      targetWidth = this.data.screenWidth;
      targetHeight = this.data.screenWidth * heightPWidth;
    }
    let targetMarginTop = (this.data.screenHeight - targetHeight) / 4;

    util.log("screenWidth:" + this.data.screenWidth);
    util.log("screenHeight:" + this.data.screenHeight);
    util.log("targetWidth:" + targetWidth);
    util.log("targetHeight:" + targetHeight);
    util.log("targetMarginTop:" + targetMarginTop);
    this.setData({
      currentPhotoPreviewItemWidth: targetWidth + 'px',
      currentPhotoPreviewItemHeight: targetHeight + 'px',
      currentPhotoPreviewItemMarginTop: targetMarginTop + 'px'
    })
  },

  onTapDelete: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    let childId = this.data.focusChildId;
    console.log(childId);
    console.log(imageId);
    let url = api.deleteChildPhoto;
    util.log(url);
    this.setData({
      isFaving: true
    })
    let data = {
      "childId": childId,
      "photoId": imageId,
      "id": imageId
    }
    wx.showLoading({
      title: '删除中..',
    })
    wx.request({
      url: url,
      method: 'DELETE',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        wx.hideLoading();
        util.log("deleteChildPhoto delete success");
        util.log(res);
        if (res.statusCode == 200 && res.data.code == 20000) {
          this.removePhotoById(imageId);
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            showPhotoPreview: false
          })
        } else {
          wx.showModal({
            title: '删除失败',
            content: JSON.stringify(res.data.message),
          })
        }
      },
      fail: (err) => {
        util.log("deleteChildPhoto delete fail");
        util.log(err);
        wx.showModal({
          title: '删除失败',
          content: JSON.stringify(err),
        })
      },
    })
  },
})