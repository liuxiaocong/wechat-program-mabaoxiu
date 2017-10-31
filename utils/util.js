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
  url, aliyunPolicy, openId, token, childId, successCallback, failCallback
  ) => {
  console.log(aliyunPolicy);
  wx.chooseImage({
    success: function (res) {
      let path = res.tempFilePaths[0];
      let uuid = genUUID();
      let data = {
        'key': aliyunPolicy.directory + '/' + uuid,
        'callback': aliyunPolicy.callback,
        'policy': aliyunPolicy.policy,
        'OSSAccessKeyId': aliyunPolicy.accessid,
        'Signature': aliyunPolicy.signature,
        'x:filename': "test.jpg",
        'x:ctime': (new Date().getTime()),
        'x:openId': openId,
        'x:token': token,
        'x:childid': childId
      };
      console.log(data);
      successCallback(aliyunPolicy.host);
      wx.uploadFile({
        url: aliyunPolicy.host,
        filePath: path,
        name: 'file',
        formData: data,
        success: function (res) {
          log("util uploadFile success");
          console.log(res);
          if (res.statusCode === 200) {
            let resJson = JSON.parse(res.data);
            successCallback(resJson);
            return;
          }
          failCallback(res);
        },
        fail: function (err) {
          wx.showToast({
            title: 'ufail',
          });
          console.log(err);
          failCallback(err);
        },
      })
    },
    fail: (err) => {
      log("download success fail");
      failCallback(err);
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

module.exports = {
  formatTime: formatTime,
  log: log,
  saveImageToPhotosAlbum: saveImageToPhotosAlbum,
  uploadTemplateToAliyun: uploadTemplateToAliyun
}
