// pages/setBaby/setBaby.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childid: null,
    currentName: null,
    currentRelation: null,
    relations: ["母子", "父子", "母女", "父女", "未定义"],
    relationIndex: 4,
    submitBtnDisable: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let childid = options.childid;
    console.log(childid);
    let child = app.getChildById(childid);
    util.log(child);
    let typeIndex = 4;
    if (child.relationType) {
      for (let i = 0; i < this.data.relations.length; i++) {
        if (this.data.relations[i] == child.relationType) {
          typeIndex = i;
          break;
        }
      }
    }
    let currentRelationStr = this.data.relations[typeIndex];
    let avatar = child.avatarUri ? child.avatarUri : "/pages/images/baby-default.jpg";
    this.setData({ childid: childid, relationIndex: typeIndex, currentName: child.name, currentRelation: currentRelationStr, currentAvatar: avatar })
  },

  onTapEditAvatar: function(){
    wx.chooseImage({
      count: 1,
      success: (res)=> {
        wx.showToast({
          title: '上传中...',
          icon: 'loading',
          duration: 200000
        });
        let path = res.tempFilePaths[0];
        let fileType = path.substr(path.lastIndexOf('.'));
        let fileName = this.data.childid + '' + (new Date().getTime()) + fileType;
        let uuid = util.genUUID();
        let aliyunPolicy = app.globalData.childAvatarPolicy;
        let openId = app.globalData.openId;
        let token = app.globalData.token;
        let data = {
          'key': aliyunPolicy.directory + '/' + uuid,
          'callback': aliyunPolicy.callback,
          'policy': aliyunPolicy.policy,
          'OSSAccessKeyId': aliyunPolicy.accessid,
          'Signature': aliyunPolicy.signature,
          'x:filename': fileName,
          'x:ctime': parseInt((new Date()).getTime() / 1000),
          'x:openId': openId,
          'x:token': token,
          'x:childid': this.data.childid
        };
        console.log(data);
        wx.uploadFile({
          url: aliyunPolicy.host,
          filePath: path,
          name: 'file',
          formData: data,
          success:  (res)=>{
            util.log("upload avatar");
            util.log(res);
            if (res.statusCode === 200) {
              wx.hideToast();
              wx.showToast({
                title: '上传成功',
              });
              let resData = JSON.parse(res.data);
              let url = resData.data.src;
              this.setData({
                currentAvatar:url
              });
              app.updateChildAvatarById(this.data.childid, url);
            } else {
              wx.showToast({
                title: '上传失败' + res.statusCode,
              })
            }
          },
          fail: function (err) {
            util.log(err);
            wx.hideToast();
            wx.showToast({
              title: JSON.stringify(err),
            })
          },
        })
      },
      fail: (err) => {
        log("choose image fail");
      }
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

  onNameChange: function (e) {
    if (e.detail.value) {
      if (e.detail.value == this.data.currentName) {
        this.setData({
          submitBtnDisable: true
        })
      } else {
        this.setData({
          submitBtnDisable: false
        })
      }
    } else {
      this.setData({
        submitBtnDisable: true
      })
    }
  },

  formSubmit: function (e) {
    console.log(e.detail.value);
    let values = e.detail.value;
    let name = values.name;
    let relation = this.data.relations[this.data.relationIndex];
    let token = app.globalData.token;
    let childid = this.data.childid;
    let url = api.updateChildInfo;
    let rData = {
      "childId": childid,
      "name": name,
      "relationType": relation,
    };
    console.log(rData);
    wx.showLoading({
      title: '更新中',
    })
    wx.request({
      url: url,
      data: rData,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': token
      },
      success: (res) => {
        wx.hideLoading();
        util.log("updateChildInfo success");
        util.log(res);
        let code = res.data.code;
        util.log("code:" + code);
        if (code === 20000) {
          app.updateChildById(childid,
          {
            "name": name,
            "relationType": relation,
          })
          wx.showToast({
            icon: 'success',
            title: '更新成功',
            duration: 1000,
            complete: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/main/info'
                })
              }, 1000)
            }
          })
        } else {
          wx.showModal({
            title: '更新失败',
            content: res, message,
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        util.log("updateChildInfo fail");
        util.log(err)
        wx.showModal({
          title: '更新失败',
          content: JSON.stringify(err),
        })
      },
    })
  },

  bindRelationChange: function (e) {
    util.log('picker relation' + e.detail.value);
    let currentRelationStr = this.data.relations[e.detail.value];
    let submitDisable = false;
    if (currentRelationStr === this.data.currentRelation) {
      submitDisable = true;
    }
    this.setData({
      relationIndex: e.detail.value,
      submitBtnDisable: submitDisable
    })
  },
})