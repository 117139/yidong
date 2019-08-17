// pages/pinglun/pinglun.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		page:1,
		datalist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getpinlun()
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
			this.getpinlun()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	getpinlun(){
		var that=this
		wx.request({
				url:  app.IPurl+'/api/comment/1',
				data:{
					page:that.data.page,
					page_length:10,
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				dataType:'json',
				method:'get',
				success(res) {
					console.log(res.data)
					if(res.data.code==1){
						if(res.data.data.length>0){
							that.data.page++
							that.data.datalist=that.data.datalist.concat(res.data.data)
						}
							that.setData({
								page:that.data.page,
								datalist:that.data.datalist
							})
							if(res.data.data.length==0){
								wx.showToast({
									icon:'none',
									title:'没有更多数据了'
								})
							}
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
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
					 console.log(err)
				}
			})
		
	},
	
})