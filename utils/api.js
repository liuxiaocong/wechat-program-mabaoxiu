let host = "https://kinder.mabaoxiu.cn";
let api = {
  appid: 'wxd093560aa0e2271c',
  sendSmsCaptcha: host + '/api/misc/sendSmsCaptcha',
  getParent: host + '/api/parent/getParent',
  bindOpenIdToPhoneNum: host + '/api/parent/bindOpenIdToPhoneNum',
  wxLogin: host + '/api/parent/wxLogin' 
}
module.exports = api;
