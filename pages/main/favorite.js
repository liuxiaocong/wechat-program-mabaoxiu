// pages/main/favorite.js
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
    isSelectAll: false,
    showNav: true,
    children: [],
    focusChildId: null,
    currentOpenedCommentItemsId: [],
    isEnd: false,
    currentPage: 0,
    currentSelectImageIds: [],
    downloadReady: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  load: function (childId, page, size, isLoadMore) {
    let url = api.getChosenChildPhotoList + "?childId=" + childId + "&pageNo=" + page + "&pageSize=" + pageSize;
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
          let currentImageItemsData = [];
          if (isLoadMore) {
            currentImageItemsData = this.data.currentImageItems;
          }
          if (res.data.data.results) {
            for (let i = 0; i < res.data.data.results.length; i++) {
              res.data.data.results[i].displayDate = util.getDisplayDate(res.data.data.results[i].ctime);
              currentImageItemsData.push(res.data.data.results[i]);
            }
          }
          let isEnd = false;
          if (res.data.data.totalRecord <= currentImageItemsData.length) {
            isEnd = true;
          }
          let newPage = page + 1;
          this.setData({
            currentImageItems: currentImageItemsData,
            isLoading: false,
            isEnd: isEnd,
            currentPage: newPage,
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
    if (app.globalData.accountInfo && app.globalData.accountInfo.children && app.globalData.accountInfo.children.length > 0) {
      let showNav = app.globalData.accountInfo.children && app.globalData.accountInfo.children.length > 1;
      child = app.globalData.accountInfo.children[0];
      this.setData({
        children: app.globalData.accountInfo.children,
        focusChildId: child.childId,
        currentPage: 0,
      })
      this.load(child.childId, this.data.currentPage, pageSize, false);
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

  bindSelectChange: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    console.log(imageId);
    if (this.data.currentSelectImageIds.indexOf(imageId) >= 0)
    {
      let index = -1;
      if (this.data.currentSelectImageIds && this.data.currentSelectImageIds.length > 0) {
        for (let i = 0; i < this.data.currentSelectImageIds.length; i++) {
          if (this.data.currentSelectImageIds[i] === imageId) {
            index = i;
          }
        }
      }
      if (index >= 0) {
        this.data.currentSelectImageIds.splice(index, 1);
      }
    }else{
      this.data.currentSelectImageIds.push(imageId);
    }
    let isSelectAll = false;
    if (this.data.currentSelectImageIds.length === this.data.currentImageItems.length)
    {
      isSelectAll = true;
    }
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        let id = this.data.currentImageItems[i].id;
        if (this.data.currentSelectImageIds.indexOf(id) >= 0)
        {
          this.data.currentImageItems[i].isSelect = true;
        }else{
          this.data.currentImageItems[i].isSelect = false;
        }
      }
    }
    this.setData({
      isSelectAll: isSelectAll,
      currentSelectImageIds: this.data.currentSelectImageIds,
      currentImageItems: this.data.currentImageItems
    });
  },

  bindSelectAllChange: function (e) {
    if (this.data.isSelectAll)
    {
      let selectAll = false;
      this.data.currentSelectImageIds = [];
      if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
        for (let i = 0; i < this.data.currentImageItems.length; i++) {
          let id = this.data.currentImageItems[i].id;
          if (this.data.currentSelectImageIds.indexOf(id) >= 0) {
            this.data.currentImageItems[i].isSelect = true;
          } else {
            this.data.currentImageItems[i].isSelect = false;
          }
        }
      }
      this.setData({
        isSelectAll: selectAll,
        currentSelectImageIds: this.data.currentSelectImageIds,
        currentImageItems: this.data.currentImageItems
      });
    }else{
      let selectAll = true;
      this.data.currentSelectImageIds = [];
      if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
        for (let i = 0; i < this.data.currentImageItems.length; i++) {
          let id = this.data.currentImageItems[i].id;
          this.data.currentImageItems[i].isSelect = true;
          this.data.currentSelectImageIds.push(id);
        }
      }
      this.setData({
        isSelectAll: selectAll,
        currentSelectImageIds: this.data.currentSelectImageIds,
        currentImageItems: this.data.currentImageItems
      });
    }
  },

  onTapBaby: function (e) {
    if (this.data.isLoading) {
      return;
    }
    let childid = e.currentTarget.dataset.childid;
    util.log(childid);
    this.setData({ focusChildId: childid, currentPage: 0,  currentImageItems: [], isLoading: true });
    this.load(childid, this.data.currentPage, pageSize, false)

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
  onTapVote: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    let childId = this.data.focusChildId;
    console.log("onTapVote imageId " + imageId);
    let url = api.voteChildPhoto;
    let data = {
      "id": imageId
    }
    
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: data,
      success: (res) => {
        util.log("voteChildPhoto  success");
        util.log(res);
        if (res.statusCode == 200 && res.data.code == 20000) {
          let data = res.data.data;
          this.addVoteToPhoto(imageId, childId);
        } else {
          wx.showModal({
            title: '点赞失败',
            content: '请检测网络',
          })
        }
      },
      fail: (err) => {
        util.log("voteChildPhoto fail");
        util.log(err);
        wx.showModal({
          title: '点赞失败',
          content: '请检测网络',
        })
      },
    })
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

  addVoteToPhoto: function(imageId,childId)
  {
    util.log("addVoteToPhoto");
    util.log(imageId);
    util.log(childId);
    let voteObj = {};
    if (app.globalData.accountInfo)
    {
      voteObj.id = app.globalData.accountInfo.id;
      voteObj.name = app.globalData.accountInfo.name;
      voteObj.avatar = app.globalData.accountInfo.avatarUri;
    }
    if (this.data.currentImageItems && this.data.currentImageItems.length > 0) {
      for (let i = 0; i < this.data.currentImageItems.length; i++) {
        if (this.data.currentImageItems[i].id === imageId) {
          if (!this.data.currentImageItems[i].votes)
          {
            this.data.currentImageItems[i].votes = [];
          }
          this.data.currentImageItems[i].votes.push(voteObj);
          this.setData({
            currentImageItems: this.data.currentImageItems
          })
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
  },
  onClickImageItem: function (e) {
    let imageId = e.currentTarget.dataset.imageid;
    let urls = [];
    let current = null;
    for (let i = 0; i < this.data.currentImageItems.length; i++) {
      urls.push(this.data.currentImageItems[i].src)
      if (imageId === this.data.currentImageItems[i].id) {
        current = this.data.currentImageItems[i].src;
      }
    }
    if (urls.length > 0 && current != null) {
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    }
  },

  onTapDownload:function(e)
  {
    if (this.data.currentSelectImageIds && this.data.currentSelectImageIds.length > 0 
    && this.data.currentImageItems && this.data.currentImageItems.length > 0)
    {
      let downloadUrls = [];
      for (let i = 0; i < this.data.currentImageItems.length ; i++)
      {
        let id = this.data.currentImageItems[i].id;
        if (this.data.currentSelectImageIds.indexOf(id)>=0)
        {
          downloadUrls.push(this.data.currentImageItems[i].src);
        }
      }
      util.log("onTapDownload");
      util.log(downloadUrls);
      util.downloadImageToPhotosAlbum(downloadUrls, (res) => {
        util.log("downloadImageToPhotosAlbum success");
        util.log(res);
        wx.showToast({
          title: res.message,
        })
      });
    }
  }
})