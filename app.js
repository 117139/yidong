//app.js
App({
	// IPurl:'http://xie.800123456.top:8000/',
	IPurl:'https://yidong-sport.com/',
  //IPurl:'http://chenjingjie.cn/',
	onLaunchtype:'',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('userWxmsg')
    wx.removeStorageSync('token')
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
								this.onLaunchtype=0
								setTimeout(function(){
									this.onLaunchtype=''
								},10000)
    					// 登录
    					this.dologin()
    
    				}
    			})
    		} else {
    			// wx.reLaunch({
    			// 	url: '/pages/login/login',
    			// })
    		}
    	}
    })
  },
	onShow(){
		if(this.onLaunchtype=0){
			return
		}
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
							this.dologin()
		
						}
					})
				} else {
					// wx.reLaunch({
					// 	url: '/pages/login/login',
					// })
				}
			}
		})
	},
	dologin(type){
		let that = this
		
		wx.login({
			success: function(res) {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
	
				let rcode = res.code
				// console.log(res.code)
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
						console.log(res.data)
						// console.log(res.data)
						if(res.data.code==1){
							
							// console.log('登录成功')
		          // wx.setStorageSync('usermsg', res.data.retData)
							wx.setStorageSync('token',  res.data.token)
              setTimeout(function () {
                if (getCurrentPages().length != 0) {
                  getCurrentPages()[getCurrentPages().length - 1].onLoad()
                }
              }, 0)
							// res.data.status=1
							if(res.data.status==0){
								
								wx.reLaunch({
									url:'/pages/login1/login1?status=0'
								})
							}else{
								// wx.setStorageSync('login', 'login')
								
								if(type=='shouquan'){
                  wx.navigateBack()
								}
							}
						}else{
							wx.showToast({
								icon:'none',
								title:res.data.msg
							})
						}
						
					},
					fail(err){
						wx.showToast({
							icon:'none',
							title:'登录失败'
						})
						console.log(err)
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
	//获取支付信息
	Pay(order_id){
		let that=this
		let datas
			datas= {
				token:wx.getStorageSync('token'),
				order_code: order_id
			}
		
		console.log(JSON.stringify(datas))
		wx.request({
			url: that.IPurl + '/api/pay',
			data: datas,
			header: {
					'content-type': 'application/x-www-form-urlencoded' // 默认值
			},
			method: "POST",
			success: function (res) {
				// console.log('194'+res.data);
				if(res.data.code==1){
					that.doWxPay(res.data);
				}else{
					
				}
				
			},
			fail: function (err) {
				wx.showToast({
						icon: "none",
						title: '服务器异常，请稍候再试'
				})
			},
		});
	},
	doWxPay(param) {
		// wx.showToast({
		// 	title:'doWxPay'
		// })
		//小程序发起微信支付
		wx.requestPayment({
			timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
			nonceStr: param.data.nonceStr,//随机字符串
			package: param.data.package,
			signType: 'MD5',
			paySign: param.data.paySign,
			success: function (event) {
				// success
				console.log(event);
				
				wx.redirectTo({
					url: '/pages/OrderList/OrderList?id=0'
				})
				wx.showToast({
					title: '支付成功',
					icon: 'none',
					duration: 1000
				});
			},
			fail: function (error) {
				// fail
				console.log("支付失败")
				
				wx.redirectTo({
					url: '/pages/OrderList/OrderList?id=0'
				})
				wx.showToast({
					title: '支付失败',
					icon: 'none',
					duration: 1000
				});
				console.log(error)
			},
			complete: function () {
				// complete
				console.log("pay complete")
			}
		 
		});
	},
	
})