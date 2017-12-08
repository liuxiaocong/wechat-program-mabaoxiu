const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const log = msg => {
  console.log(msg);
}

const saveImageToPhotosAlbum = (url, successCallback, failCallback) => {
  wx.downloadFile({
    url: url,
    success: (res) => {
      let path = res.tempFilePath;
      log("download success path:" + path);
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          log("saveImageToPhotosAlbum success");
          log(res);
          successCallback(res);
        },
        fail: (res) => {
          log("saveImageToPhotosAlbum fail");
          failCallback(res);
        }
      })
    },
    fail: (err) => {
      log("download success fail");
      failCallback(err);
    }
  })
}

const uploadTemplateToAliyun = (
  count, aliyunPolicy, openId,
  token, childId, completeCallback
) => {
  console.log(aliyunPolicy);
  let uploadObj = {
    total: count,
    success: 0,
    fail: 0
  }
  wx.chooseImage({
    count: count,
    success: function (res) {
      uploadObj.total = res.tempFilePaths.length;
      console.log(uploadObj);
      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        wx.showToast({
          title: '上传中...',
          icon: 'loading',
          duration: 200000
        });
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          let path = res.tempFilePaths[i];
          let fileType = path.substr(path.lastIndexOf('.'));
          let fileName = childId + '' + (new Date().getTime()) + fileType;
          let uuid = genUUID();
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
            'x:childid': childId
          };
          wx.uploadFile({
            url: aliyunPolicy.host,
            filePath: path,
            name: 'file',
            formData: data,
            success: function (res) {
              if (res.statusCode === 200) {
                uploadObj.success += 1;
              } else {
                uploadObj.fail += 1;
              }
              console.log(JSON.stringify(uploadObj));
              if (uploadObj.total === (uploadObj.success + uploadObj.fail)) {
                let message = "成功上传 " + uploadObj.success + " 张照片";
                if (uploadObj.success === 0) {
                  message = "上传失败，请稍后重试";
                }
                wx.hideToast();
                completeCallback({
                  message: message,
                  count: uploadObj.success
                })
              }
            },
            fail: function (err) {
              uploadObj.fail += 1;
              console.log(JSON.stringify(uploadObj));
              if (uploadObj.total === (uploadObj.success + uploadObj.fail)) {
                let message = "成功上传 " + uploadObj.success + " 张照片";
                if (uploadObj.success === 0) {
                  message = "上传失败，请稍后重试";
                }
                wx.hideToast();
                completeCallback({
                  message: message,
                  count: uploadObj.success
                })
              }
            },
          })
        }
      }
    },
    fail: (err) => {
      log("choose image fail");

    }
  })
}
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

const genUUID = () => {
  // Generate a pseudo-GUID by concatenating random hexadecimal.
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


const getDisplayDate = time => {
  let t = new Date(time * 1000);
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let date = t.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  return year + '年' + month + '月' + date + '日';
}

const getYearMonthDisplayDate = time => {
  let t = new Date(time * 1000);
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let date = t.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  return year + '年' + month + '月';
}

const getDisplayWeekday = time => {
  let t = new Date(time * 1000);
  let day = t.getDay();
  let weekdayArray = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdayArray[day];
}

const getDisplayMonthDate = time => {
  let t = new Date(time * 1000);
  return t.getDate();
}


const downloadImageToPhotosAlbum = (urls, completeCallback) => {
  let downloadObj = {
    total: urls.length,
    success: 0,
    fail: 0
  }
  wx.showToast({
    title: '下载中...',
    icon: 'loading',
    duration: 200000
  })
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];
    wx.downloadFile({
      url: url,
      success: function (res) {
        log(res);
        if (res.statusCode === 200) {
          downloadObj.success += 1;
        } else {
          downloadObj.fail += 1;
        }
        console.log(JSON.stringify(downloadObj));
        if (downloadObj.total === (downloadObj.success + downloadObj.fail)) {
          let message = "成功下载 " + downloadObj.success + " 张照片";
          if (downloadObj.success === 0) {
            message = "下载失败，请稍后重试";
          }
          wx.hideToast();
          completeCallback({
            message: message,
            count: downloadObj.success
          })
        }
      },
      fail: function (err) {
        downloadObj.fail += 1;
        console.log(JSON.stringify(downloadObj));
        if (downloadObj.total === (downloadObj.success + downloadObj.fail)) {
          let message = "成功上传 " + downloadObj.success + " 张照片";
          if (downloadObj.success === 0) {
            message = "上传失败，请稍后重试";
          }
          wx.hideToast();
          completeCallback({
            message: message,
            count: downloadObj.success
          })
        }
      },
    })
  }
}

const insertTimeBlock = (imgList) => {
  const arr = []
  let lastDisplayData = null
  for (let i = 0; i < imgList.length; i++) {
    let displayDate = getDisplayDate(imgList[i].ctime);
    imgList[i].displayDate = displayDate;
    imgList[i].type = 0;
    if (displayDate !== lastDisplayData) {
      lastDisplayData = displayDate;
      let t = new Date(imgList[i].ctime);
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
        monthDate: getDisplayMonthDate(imgList[i].ctime),
        weekday: getDisplayWeekday(imgList[i].ctime)
      }
      arr.push(dataObject);
    }
    arr.push(imgList[i]);
  }
  return arr
}

const navigate2PreImg = (pureImgs, itemid, from) => {
  let currentIndex
  pureImgs.forEach((item, index) => {
    if(item.id === itemid){
      return currentIndex = index
    }
  })
  app.globalData.prePhotos = pureImgs
  wx.navigateTo({
    url: `/pages/preview/preview?currentIndex=${currentIndex}&from=${from}`
  })
}

module.exports = {
  formatTime,
  log,
  saveImageToPhotosAlbum,
  uploadTemplateToAliyun,
  getDisplayDate,
  getDisplayWeekday,
  getDisplayMonthDate,
  downloadImageToPhotosAlbum,
  getYearMonthDisplayDate,
  insertTimeBlock,
  navigate2PreImg,
  genUUID
}
