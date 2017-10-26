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
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          successCallback(res);
        },
        fail: (res) => {
          failCallback(res);
        }
      })
    },
    fail: (res) => {
      failCallback(res);
    }
  })
}

module.exports = {
  formatTime: formatTime,
  log: log,
  saveImageToPhotosAlbum: saveImageToPhotosAlbum,
}
