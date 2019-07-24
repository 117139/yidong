// pages/fabiaopl/fabiaopl.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		fbtext:'',
		tmpdata:{
			
			fblen:0,
			imgb:[]
		}
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
	bint(e){
		console.log(e.detail.value)
		console.log(e.detail.value.length)
		this.data.tmpdata.fblen=e.detail.value.length
		this.setData({
			fbtext:e.detail.value,
			tmpdata:this.data.tmpdata
		})
		// this.setData({
		// 	
		// 	fblen:e.detail.value.length
		// })
	},
	imgdel(e){
		var that =this
		console.log(e.currentTarget.dataset.idx)
		wx.showModal({
			title: '提示',
			content: '确定要删除这张图片吗',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					that.data.tmpdata.imgb.splice(e.currentTarget.dataset.idx)
					that.setData({
						tmpdata:that.data.tmpdata
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
		
	},
	scpic(){
		var that=this
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath可以作为img标签的src属性显示图片
				console.log(res)
				const tempFilePaths = res.tempFilePaths
				that.data.tmpdata.imgb.push(tempFilePaths[0])
				that.setData({
					tmpdata:that.data.tmpdata
				})
				return
				///api/upload_image/upload
				wx.uploadFile({
					url: app.IPurl+'/api/upload_image/upload', //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'images',
					formData: {
						'module_name': 'used'
					},
					success (res){
						console.log(res.data)
						var ndata=JSON.parse(res.data)
						console.log(ndata)
						console.log(ndata.errcode==0)
						if(ndata.errcode==0){
							that.data.tmpdata.imgb.push(ndata.retData[0])
							that.setData({
								tmpdata:that.data.tmpdata
							})
						}else{
							wx.showToast({
								icon:"none",
								title:"上传失败"
							})
						}
					}
				})
			}
		})
	},
	fabusub(){
		var that =this
		if(that.data.fbtext==""){
			wx.showToast({
				icon:"none",
				title:"请输入您的评论"
			})
			return
		}
		wx.showModal({
			title: '提示',
			content: '是否要发布该评论',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					that.setData({
						kg:0
					})
					var imbox=that.data.tmpdata.imgb
					imbox=imbox.join(',')
					wx.showLoading({
						title:'请稍后。。'
					})
					// 'Authorization':wx.getStorageSync('usermsg').user_token
					wx.request({
						url:  app.IPurl+'/api/used_comment/save',
						data:{
							"authorization":wx.getStorageSync('usermsg').user_token,
							'used_id':that.data.sqid,
							'body':that.data.fbtext,
							'path':imbox,
							'module_name':'used'
						},
						// header: {
						// 	'content-type': 'application/x-www-form-urlencoded'
						// },
						dataType:'json',
						method:'POST',
						success(res) {
							console.log(res.data)
						
							
							if(res.data.errcode==0){
								that.getpl(1)
								wx.showToast({
									 icon:'none',
									 title:'发表成功'
								})
								setTimeout(function(){
									that.onClose()
									
								},1000)
								
							}else{
								that.setData({
									kg:1
								})
								wx.showToast({
									 icon:'none',
									 title:res.data.ertips
								})
							}
							
							 
						},
						fail() {
							that.setData({
								kg:1
							})
							wx.showToast({
								 icon:'none',
								 title:'操作失败'
							})
						},
						complete() {
							wx.hideLoading()
						}
					})
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	
	},
	
	
})