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
	previewImage(e){
		app.previewImage(e)
	},
	jump(e){
		app.jump(e)
	}
})
