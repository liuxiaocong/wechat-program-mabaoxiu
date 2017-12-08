// pages/preview/preview.js
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prePhotos: [],
    currentIndex: 0,
    current: '',
    from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {currentIndex, from} = options
    const { prePhotos } = app.globalData
    this.setData({
      prePhotos,
      currentIndex,
      from
    })
  },
  onSwiperChange(e){
    this.setData({
      current: e.detail.current + 1
    })
  },
  onClickImg(){
    wx.navigateBack({
      delta: 1 
    })
  },
  onLoved(){
    const {current, currentIndex, prePhotos} = this.data
    const index = current? current-1 : currentIndex

    this.reqLoved({index, ...prePhotos[index]})
  },
  onDelete(){
    const {current, currentIndex, prePhotos} = this.data
    const index = current? current-1 : currentIndex
    const photoId = prePhotos[index].id

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.reqDeletePhoto({
            id: photoId
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  reqDeletePhoto(data){
    const url = api.deleteChildPhoto

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
          wx.showToast({
            title: '删除成功',
          })
          setTimeout(_=>{
            wx.navigateBack({
              delta: 1 
            })
          },2000)
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
  reqLoved: function ({id, chosen, index}) {
    const url = api.updateChosenByChildPhoto
  
    wx.request({
      url: url,
      method: chosen ? 'DELETE' : 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: { id },
      success: (res) => {
        util.log("updateChosenByChildPhoto put success");
        util.log(res);
        if (res.statusCode == 200 && res.data.code == 20000) {
          this.updatePhotoChosenStatus(index, chosen);
          wx.showToast({
            title: chosen ? '成功取消精选':'成功加入精选',
          })
        } else {
          wx.showModal({
            title: '操作失败',
            content: JSON.stringify(res.data.message),
          })
        }
      },
      fail: (err) => {
        util.log("updateChosenByChildPhoto put fail");
        util.log(err);
        wx.showModal({
          title: '操作失败',
          content: JSON.stringify(err),
        })
      },
    })
  },
  updatePhotoChosenStatus(index, chosen){
    const { prePhotos } = this.data
    prePhotos[index].chosen = !chosen
    this.setData({
      prePhotos
    })
  }
})