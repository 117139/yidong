//app.js
App({
	IPurl:'http://xie.800123456.top/',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

   wx.setStorageSync('token', 'xxx')
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
    					// console.log(res.userInfo)
   
    					// 登录
    					// this.dologin()
    
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
	onShow(){
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
							
							// 登录
							// this.dologin()
		
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
	
				let rcode = res.code
				console.log(res.code)
				wx.request({
					url:  that.IPurl+'/api/login', 
					data: {
						'js_code':rcode,
						'userInfo':that.globalData.userInfo,
						
					},
					// header: {
					// 	'content-type': 'application/x-www-form-urlencoded' 
					// },
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res)
						// console.log(res.data)
						if(res.data.code==1){
							
							console.log('登录成功')
		          wx.setStorageSync('login', 'login')
							wx.setStorageSync('usermsg', res.data.retData)
						}else{
							wx.showToast({
								icon:'none',
								title:'登录失败'
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
	openOrder(id,xzarr,type){
		console.log(id)
		if(type){
			wx.navigateTo({
			  url: '/pages/Order/Order?id=' + id+'&type='+type+'&xzarr='+xzarr
			})
		}else{
			wx.navigateTo({
			  url: '/pages/Order/Order?id=' + id
			})
		}
		
	},
})