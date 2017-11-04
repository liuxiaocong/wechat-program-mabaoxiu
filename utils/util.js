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

const uploadTemplateToAliyun = (count,aliyunPolicy, openId, token, childId, completeCallback
  ) => {
  console.log(aliyunPolicy);
  let uploadObj = {
    total : count,
    success: 0 ,
    fail: 0
  }
  wx.chooseImage({
    count:count,
    success: function (res) {
      uploadObj.total = res.tempFilePaths.length;
      console.log(uploadObj);
      if (res.tempFilePaths && res.tempFilePaths.length>0)
      {
        wx.showLoading({
          title: '上传中...',
        });
        for (let i = 0; i < res.tempFilePaths.length;i++)
        {
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
            'x:ctime': (new Date().getTime()),
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
              }else{
                uploadObj.fail+= 1;
              }
              console.log(JSON.stringify(uploadObj));
              if (uploadObj.total === (uploadObj.success + uploadObj.fail))
              {
                let message = "成功上传 " + uploadObj.success + " 张照片";
                if(uploadObj === 0)
                {
                  message = "上传失败，请稍后重试";
                }
                wx.hideLoading();
                completeCallback({
                  message:message,
                  count:uploadObj.success
                })
              }
            },
            fail: function (err) {
              uploadObj.fail += 1;
              console.log(JSON.stringify(uploadObj));
              if (uploadObj.total === (uploadObj.success + uploadObj.fail)) {
                let message = "成功上传 " + uploadObj.success + " 张照片";
                if (uploadObj === 0) {
                  message = "上传失败，请稍后重试";
                }
                wx.hideLoading();
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
      wx.showModal({
        title: '选取失败',
        content: '选取图片失败',
      })
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
