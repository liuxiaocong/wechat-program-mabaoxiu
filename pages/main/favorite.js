// pages/main/favorite.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentImageItems: [],
    isSelectAll: false,
    showNav: false,
    children: [],
    focusChildId: null,
    currentOpenedCommentItemsId: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  load: function (childId, page, size) {
    let url = api.getChosenChildPhotoList + "?childId=" + childId + "&pageNo=0&pageSize=50";
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
        util.log("getChosenChildPhotoList success");
        if (res.statusCode == 200 && res.data.code == 20000) {
          console.log(res.data.data.results);
          if (res.data.data.results) {
            for (let i = 0; i < res.data.data.results.length; i++) {
              res.data.data.results[i].displayDate = util.getDisplayDate(res.data.data.results[i].ctime);
            }
          }
          this.setData({
            currentImageItems: res.data.data.results,
            isLoading: false
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
        util.log("getChosenChildPhotoList fail");
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let child;
    if (app.globalData.accountInfo && app.globalData.accountInfo.children) {
      let showNav = app.globalData.accountInfo.children && app.globalData.accountInfo.children.length > 1;
      child = app.globalData.accountInfo.children[0];
      this.setData({
        showNav: showNav,
        children: app.globalData.accountInfo.children,
        focusChildId: child.childId
      })
      this.load(child.childId, 0, 50);
    }
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

  bindSelectAllChange: function (e) {
    this.setData({
      isSelectAll: !!e.detail.value.length
    });
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

  removeChosenPhoto: function (imageId) {
    let targetIndex = -1;
    if (this.data.currentImageItems) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          targetIndex = i;
        }
      }
    }
    console.log(targetIndex);
    if (targetIndex > -1) {
      this.data.currentImageItems.splice(targetIndex, 1);
      this.setData({
        currentImageItems: this.data.currentImageItems
      })
    }
  },

  onTapUnFavorite: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    console.log(imageId);
    let url = api.updateChosenByChildPhoto;
    util.log(url);
    this.setData({
      isFaving: true
    })
    let data = {
      "id": imageId
    }
    wx.showLoading({
      title: '移出中..',
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
        util.log("updateChosenByChildPhoto delete success");
        util.log(res);
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.code == 20000) {
          console.log(this);
          this.removeChosenPhoto(imageId);
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
        wx.hideLoading();
        util.log("updateChosenByChildPhoto delete fail");
        util.log(err);
        wx.showModal({
          title: '移出精选失败',
          content: JSON.stringify(err),
        })
      },
    })
  },

  onTapComment: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    console.log("onTapcomment imageId " + imageId);
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          this.data.currentImageItems[i].openComment = !!(!this.data.currentImageItems[i].openComment);
        }
      }
    }
    this.setData({
      currentImageItems: this.data.currentImageItems
    });
  },

  onCommentChange: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    let value = e.detail.value;
    console.log(imageId);
    console.log(value);
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          this.data.currentImageItems[i].pendingComment = value;
        }
      }
    }
  },

  onTapSubmitComment: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    let value = null;
    console.log(imageId);
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          value = this.data.currentImageItems[i].pendingComment;
        }
      }
    }
    console.log(imageId);
    console.log(value);
    let url = api.createChildPhotoComment;
    let data = {
      "childPhotoId": imageId,
      "content": value
    }
    console.log(data);
    wx.showToast({
      title: '评论中...',
      icon: 'loading',
      duration: 200000
    });
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        util.log("createChildPhotoComment  success");
        util.log(res);
        wx.hideToast();
        if (res.statusCode == 200 && res.data.code == 20000) {
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          })
          let data = res.data.data;
          this.addCommentToPhoto(data, imageId);
        } else {
          wx.showModal({
            title: '评论失败',
            content: JSON.stringify(res.data.message),
          })
        }
      },
      fail: (err) => {
        wx.hideToast();
        util.log("createChildPhotoComment fail");
        util.log(err);
        wx.showModal({
          title: '评论失败',
          content: JSON.stringify(err),
        })
      },
    })
  },

  addCommentToPhoto: function (comment, imageId) {
    util.log("addCommentToPhoto");
    util.log(comment);
    util.log(imageId);
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          this.data.currentImageItems[i].pendingComment = '';
          if (!this.data.currentImageItems[i].comments) {
            this.data.currentImageItems[i].comments = [].push(comment);
          } else {
            this.data.currentImageItems[i].comments.push(comment);
          }
          this.setData({
            currentImageItems: this.data.currentImageItems
          })
          return;
        }
      }
    }
  },

  onTapDeleteComment: function (e) {
    let commentid = e.currentTarget.dataset.commentid;
    let imageid = e.currentTarget.dataset.imageid;
    util.log("comment id:" + commentid);
    util.log("imageid id:" + imageid);
    let url = api.deleteChildPhotoComment;
    let data = {
      "id": commentid,
    }
    console.log(data);
    wx.showToast({
      title: '删除中...',
      icon: 'loading',
      duration: 200000
    });
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        util.log("deleteChildPhotoComment  success");
        util.log(res);
        wx.hideToast();
        if (res.statusCode == 200 && res.data.code == 20000) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          this.deleteComment(imageid, commentid);
        } else {
          wx.showModal({
            title: '删除失败',
            content: JSON.stringify(res.data.message),
          })
        }
      },
      fail: (err) => {
        wx.hideToast();
        util.log("deleteChildPhotoComment fail");
        util.log(err);
        wx.showModal({
          title: '删除失败',
          content: JSON.stringify(err),
        })
      },
    })
  },
  deleteComment: function (imageId, commentid) {
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          let comments = this.data.currentImageItems[i].comments;
          if (comments) {
            let target = -1;
            for (let j = 0; j < comments.length; j++) {
              if (comments[j].id === commentid) {
                target = j;
              }
            }
            if (target > 0) {
                this.data.currentImageItems[i].comments.splice(target, 1);
            }
          }
        }
      }
      this.setData({
        currentImageItems: this.data.currentImageItems
      })
    }
  }
})