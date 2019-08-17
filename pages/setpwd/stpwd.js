// pages/setpwd/stpwd.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		btnkg:0,
		pwd:'',
		showpwd:1,
		yzm:'',
		setstate:0,
		time:60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	toggless(e){
		console.log(e.currentTarget.dataset.type)
		this.setData({
			showpwd:e.currentTarget.dataset.type
		})
	},
	oniptblurpwd(e){
		console.log(e.detail.value)
		this.setData({
			pwd:e.detail.value
		})
	},
	getcode(){
		let that =this
		if(that.data.tel=='' || !(/^1\d{10}$/.test(that.data.tel))){
			wx.showToast({
				icon:'none',
				title:'手机号有误'
			})
			return 
		}
		if(that.data.btnkg==1){
			return
		}else{
			that.setData({
				btnkg:1
			})
		}
		wx.request({
			url:  app.IPurl1+'sendcode',
			data:  {
					key:'server_mima',
					tokenstr:that.data.tokenstr,
					tel:that.data.tel
		    },
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				if(res.data.code==1){
					wx.showToast({
						icon:'none',
						title:'发送成功'
					})
					console.log(res.data.code)
					
					console.log(that.data.yzm)
					that.codetime()
				}else{
					if(res.data.msg){
						wx.showToast({
							icon:'none',
							title:res.data.msg
						})
					}else{
						wx.showToast({
							 icon:'none',
							 title:'操作失败'
						})
					}
				}
			},
			fail(err) {
					console.log(err)
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				
			}
		})
		
	},
	codetime(){
		let that =this
		let time=60
		let st=setInterval(function(){
		    if(time==0){
		        that.setData({
							setstate:0,
						})
		        clearInterval(st);
		    }else{
		        let news=time--;
						console.log(news)
						that.setData({
							setstate:1,
							time:news
						})
		        
		    }
		},1000);
	},
	//提交表单
	formSubmit(e) {
		console.log(app.globalData.userInfo)
		let uinfo=app.globalData.userInfo
		console.log(uinfo.nickName)
	  if (uinfo===null){
	    wx.showToast({
	      title: '您的授权已失效，请重新授权',
	      duration: 2000,
	      icon: 'none'
	    });
	    setTimeout(function(){
	      wx.reLaunch({
	        url: '/pages/login/login',
	        fail: (err) => {
	          console.log("失败: " + JSON.stringify(err));
	        }
	      })
	    },500) 
	    return
	  }
		console.log(uinfo.avatarUrl)
		let that =this
	  console.log('form发生了submit事件，携带数据为：', e.detail.value)
		let formresult=e.detail.value
		if (formresult.name=='') {
			wx.showToast({
				title: '姓名不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (!(/^1\d{10}$/.test(formresult.tel))) {
			wx.showToast({
				title: '手机号码有误',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (formresult.code=='') {
			wx.showToast({
				title: '验证码不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (formresult.pwd.length<6) {
			wx.showToast({
				title: '密码长度不能小于6位',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		let rcode
		wx.login({
			success: function (res) {
				console.log(res)
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				rcode=res.code
				wx.setStorageSync('appcode', rcode)
				that.setData({
					wxcode:rcode
				});
				console.log(rcode)
				//发送请求
				wx.showLoading({
					title: '正在登录中',
					mask:true
				})
				// return
				wx.request({
					url:  app.IPurl1+'login',
					data:  {
							key:'server_mima',
							code:rcode,
							tokenstr:that.data.tokenstr,
							nickname:uinfo.nickName,
							headpicurl:uinfo.avatarUrl,
							tel:formresult.tel,
							name:formresult.name,
							shop_channel_id:formresult.company,
				    },
					header: {
						'content-type': 'application/x-www-form-urlencoded' 
					},
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res.data)
						wx.hideLoading()
						if(res.data.error==0){
							wx.showToast({
								title: '登录成功',
								duration: 1000,
								icon:'none'
							});
							setTimeout(function() {
								wx.reLaunch({
									url:'/pages/index/index'
								})
							}, 500);
							
							wx.setStorageSync('login', 'login')
							wx.setStorageSync('tokenstr', res.data.tokenstr)
							wx.setStorageSync('morenaddress', res.data.user_member_shopping_address)
							/*
							address:"2321231323"
							city:"北京市"
							county:"东城区"
							create_time:"05/14/2019 15:50:41"
							default_add:1
							mobile:"18334774129"
							name:"苏鑫"
							province:"北京市"
							update_time:"05/14/2019 15:50:41"
							user_member_id:2
							user_member_shopping_address_id:3
							*/
							// wx.setStorageSync('appcode', rcode)
						}else{
							wx.showToast({
								title: res.data.returnstr,
								duration: 2000,
								icon:'none'
							});
						}
					},
					fail() {
						wx.hideLoading()
						wx.showToast({
							title: '网络异常',
							duration: 2000,
							icon:'none'
						});
					}
				})
			}
		})
	},
	
})