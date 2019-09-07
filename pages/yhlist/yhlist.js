// pages/yhlist/yhlist.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		btnkg:0,
		yhlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that =this
		if(options.type==1){
			that.setData({
				btnkg:0,
				addresback:true
			})
		}else{
			that.setData({
				addresback:false
			})
		}
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
		this.getyhlist()
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
	getyhlist(){
		var that=this
		wx.request({
				url:  app.IPurl+'/api/userCouponList',
				data:{
					token:wx.getStorageSync('token')
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				dataType:'json',
				method:'get',
				success(res) {
					console.log(res.data)
					if(res.data.code==1){
			
							that.setData({
								yhlist:res.data.data
							})
							
					}else{
						wx.showToast({
							icon:'none',
							title:res.data.msg
						})
					}
					
				},
				fail() {
					wx.showToast({
						icon:'none',
						title:res.data.msg
					})
					 console.log('失败')
				}
			})
		
	},
	toback(e){
		var that =this
		if(that.data.addresback==true){
			if(that.data.btnkg==1){
				return
			}else{
				that.setData({
					btnkg:1
				})
			}
			console.log(e.currentTarget.dataset.idx)
			var idx= e.currentTarget.dataset.idx
			var pages = getCurrentPages();   //当前页面
			var prevPage = pages[pages.length - 2];   //上一页面
			prevPage.setData({
			       //直接给上一个页面赋值
			      yhlistchose: that.data.yhlist[idx],
            yhindex:idx
			});
			 
			wx.navigateBack({
			     //返回
			     delta: 1
			})
		}
	},
})