//logs.js
const app = getApp()

Page({
  data: {
    userInfo: wx.getStorageSync('userWxmsg')
  },
  onLoad: function () {
		this.setData({
			userInfo: wx.getStorageSync('userWxmsg')
		})
  },
  onShow: function () {
    if (wx.getStorageSync('userWxmsg').nickName !== undefined) {
      app.dologin()
    }
  },
	previewImage(e){
		app.previewImage(e)
	},
	jump(e){
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      app.jump(e)
    }
	}
})
