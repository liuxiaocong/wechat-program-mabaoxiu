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
    isDeleting: false
  },

  onTapBaby: function (e) {
    if (this.data.isLoading) {
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
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        this.setData({
          isFaving: false
        });
        util.log("updateChosenByChildPhoto put success");
        util.log(res);
        if (res.statusCode == 200 && res.data.code == 20000) {
          this.updatePhotoChosenStatus(imageId, true);
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
        util.log("updateChosenByChildPhoto put fail");
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

  updatePhotoChosenStatus: function (id, isChosen) {
    util.log(id);
    let item = this.data.currentPhotoPreviewItem;
    if (item && item.id === id) {
      item.chosen = isChosen;
      this.setData({
        currentPhotoPreviewItem: item
      })
    };
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === id) {
          this.data.currentImageItems[i].chosen = isChosen;
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
          this.updatePhotoChosenStatus(imageId, false);
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