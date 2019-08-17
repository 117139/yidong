// pages/login0/login0.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
		wx.showToast({
			icon:'none',
			title:'请先注册账号'
		})
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
		
		if (!(/^1\d{10}$/.test(formresult.tel))) {
			wx.showToast({
				title: '手机号码有误',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (formresult.pwd=='') {
			wx.showToast({
				title: '密码不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		let rcode
		wx.request({
			url:  app.IPurl+'login',
			data:  {
					token:wx.getStorageSync('token'),
					phone:formresult.tel,
					passwrod:formresult.pwd,
					
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
					
				}else{
					wx.showToast({
						title: res.data.msg,
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
			
	},
	jump(e){
		app.jump(e)
	}
})