let host = "https://kinder.mabaoxiu.cn";
let api = {
  appid: 'wx38e36169ec6ef1e5',
  bindOpenIdToPhoneNum: host + '/api/parent/auth/bindOpenIdToPhoneNum',
  wxLogin: host + '/api/parent/auth/wxLogin',
  sendSmsCaptcha: host + '/api/parent/auth/sendSmsCaptcha',
  getParentInfo: host + '/api/parent/account/getParentInfo',
  updateChildInfo: host + '/api/parent/child/updateChildInfo',
  getAliyunPolicy: host + '/api/oss/getUploadPhotoPolicy',
  updateParentInfo: host + '/api/parent/account/updateParentInfo',
  updateChildInfo: host + '/api/parent/account/updateChildInfo',
  getChildPhotoList: host + '/api/parent/childPhoto/getChildPhotoList',
  deleteChildPhoto: host + '/api/parent/childPhoto/deleteChildPhoto',
  updateChosenByChildPhoto: host + '/api/parent/childPhoto/updateChosenByChildPhoto',
  unvoteChildPhoto: host + '/api/parent/photo/unvoteChildPhoto',
  voteChildPhoto: host + '/api/parent/chosenPhoto/voteChildPhoto',
  getChosenChildPhotoList: host + '/api/parent/chosenPhoto/getChosenChildPhotoList',
  createChildPhotoComment: host + '/api/parent/chosenPhoto/createChildPhotoComment',
  deleteChildPhotoComment: host + '/api/parent/chosenPhoto/deleteChildPhotoComment',
  getPlazaPhotoList: host +  '/api/parent/plazaPhoto/getPlazaPhotoList',
  addPhotoToChosen: host + '/api/parent/plazaPhoto/addPhotoToChosen',
  addPhotoToChosen: host + '/api/parent/plazaPhoto/addPhotoToChosen',
  getBulletinList: host + '/api/parent/bulletin/getBulletinList',
  signIn: host + '/api/parent/account/signIn',
  downgradeTemplateChildPhoto: host + '/api/parent/account/downgradeTemplateChildPhoto'
}
module.exports = api;
