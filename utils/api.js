let host = "https://kinder.mabaoxiu.cn";
let api = {
  appid: 'wxd093560aa0e2271c',
  sendSmsCaptcha: host + '/api/misc/sendSmsCaptcha',
  getParentInfo: host + '/api/parent/account/getParentInfo',
  bindOpenIdToPhoneNum: host + '/api/parent/account/bindOpenIdToPhoneNum',
  wxLogin: host + '/api/parent/account/wxLogin' ,
  updateChildInfo: host + '/parent/child/updateChildInfo',
  getAliyunPolicy: host + '/misc/getAliyunPolicy'
}
module.exports = api;
