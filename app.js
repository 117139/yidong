//app.js
App({
	IPurl1:'https://wx5100api.tdgjs.com/WebService.asmx/',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

   
    // 获取用户信息
    wx.getSetting({
    	success: res => {
    		if (res.authSetting['scope.userInfo']) {
    			// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    			wx.getUserInfo({
    				success: res => {
    					// 可以将 res 发送给后台解码出 unionId
    					this.globalData.userInfo = res.userInfo
    					wx.setStorageSync('userWxmsg', res.userInfo)
    					console.log(res.userInfo)
    					// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    					// 所以此处加入 callback 以防止这种情况
    					// 登录
    					this.dologin()
    
    				}
    			})
    		} else {
    			wx.reLaunch({
    				url: '/pages/login/login',
    			})
    		}
    	}
    })
  },
	dologin(){
		let that = this
		wx.login({
			success: function(res) {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId

				// console.log(that.IPurl1)
				// const url =   
				let data = {
					code: res.code
				}
				let rcode = res.code
				console.log(res.code)
				return
				wx.request({
					url:  that.IPurl+'/index/userlogin/login', 
					data: {
						'code':rcode,
						'avatarUrl':that.globalData.userInfo.avatarUrl,
						'nickName':that.globalData.userInfo.nickName,
					},
					// header: {
					// 	'content-type': 'application/x-www-form-urlencoded' 
					// },
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res)
						console.log(res.data)
						if(res.data.errCode==0){
							// wx.reLaunch({
							//   url: '/pages/index/index',
							//   fail: (err) => {
							//     console.log("失败: " + JSON.stringify(err));
							//   }
							// })
							console.log('登录成功')
		          wx.setStorageSync('login', 'login')
							wx.setStorageSync('usermsg', res.data.retData)
						}else{
							wx.showToast({
								icon:'none',
								title:res.data.ertips
							})
						}
						if(res.data.error==2){
							wx.setStorageSync('tokenstr', res.data.tokenstr)
							wx.setStorageSync('appcode', rcode)
							wx.reLaunch({
								url:'/pages/login/login'
							})
						}
					}
				})
			}
		})
	},
  globalData: {
    userInfo: null
  },
	/**   
	   * 预览图片  
	   */
	previewImage(e) {
	  var current = e.target.dataset.src;
		var arr1=[]
		arr1.push(current)
		console.log(arr1);
	  wx.previewImage({
	    current: current, // 当前显示图片的http链接  
	    urls: arr1 // 需要预览的图片http链接列表  
	  })
	},
	pveimg(urls,current,type){
		let urls1=[]
		if(!type){
			urls1[0]=urls
		}else{
			urls1=urls
		}
		wx.previewImage({
			current: current, // 当前显示图片的http链接
			urls: urls1 // 需要预览的图片http链接列表
		})
	},
	jump(e){
		console.log(e.currentTarget.dataset.url)
		wx.navigateTo({
			url:e.currentTarget.dataset.url
		})
	},
})