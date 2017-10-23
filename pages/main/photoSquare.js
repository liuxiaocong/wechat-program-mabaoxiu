// pages/main/photoSquare.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhotoPreview: false,
    currentPhotoPreviewItem: {},
    currentImageItems: [],
    imageHeight: '90px'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        util.log(res);
        let height = (res.screenWidth - 18) / 3;
        this.setData({ imageHeight: height + 'px' })
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
        imageItem.url = 'https://mbx-photo.oss-cn-shenzhen.aliyuncs.com/599e3e1567e34d2c4f226a65?OSSAccessKeyId=LTAILeWv4PJuLbsV&Expires=1508635800&Signature=Jiw0no6%2Bw3PPljFkUyD%2Fjvza%2FRM%3D&x-oss-process=image%2Fresize%2Cm_fill%2Ch_150%2Cw_150%2Fquality%2CQ_50';
      } else {
        imageItem.url = 'https://mbx-photo.oss-cn-shenzhen.aliyuncs.com/599e8b5f67e34d579115fd48?OSSAccessKeyId=LTAILeWv4PJuLbsV&Expires=1508554800&Signature=adpMAl3R0uxGvPYWVyc1J0Gyqcw%3D&x-oss-process=image%2Fresize%2Cm_fill%2Ch_150%2Cw_150%2Fquality%2CQ_50';
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
    util.log(item);
    this.setData({
      showPhotoPreview: true,
      currentPhotoPreviewItem: item
    })
  },

  onTapPreivewLayout: function () {
    this.setData({
      showPhotoPreview: false,
      currentPhotoPreviewItem: {}
    })
  }
})