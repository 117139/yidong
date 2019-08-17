// pages/fabiaopl/fabiaopl.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		btnkg:0,   // 0 ok    1 off
		id:1,
		oid:1,
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
		if(options.oid){
			this.setData({
				oid:options.oid
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
				const imglen=that.data.tmpdata.imgb.length
				for(var i=0;i<tempFilePaths.length;i++){
					// console.log(imglen)
					var newlen=Number(imglen)+Number(i)
					// console.log(newlen)
					if(newlen==9){
						wx.showToast({
							icon:'none',
							title:'最多可上传九张'
						})
						break;
					}
					wx.uploadFile({
							url: app.IPurl+'/api/uploadImg', 
							filePath: tempFilePaths[i],
							name: 'file[]',
							formData: {
							
							},
							success (res){
								console.log(res.data)
								var ndata=JSON.parse(res.data)
								console.log(ndata)
								console.log(ndata.errcode==0)
								if(ndata.code==1){
									that.data.tmpdata.imgb.push(ndata.data)
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
					
					var imbox=that.data.tmpdata.imgb
					imbox=imbox.join(',')
					wx.showLoading({
						title:'请稍后。。'
					})
					if(that.data.btnkg==1){
						return
					}else{
						that.setData({
							btnkg:1
						})
					}
					// 'Authorization':wx.getStorageSync('usermsg').user_token
					wx.request({
						url:  app.IPurl+'/api/comment/'+that.data.id,
						data:{
							"token":wx.getStorageSync('token'),
							'comment':that.data.fbtext,
							'comment_img':imbox,
							'order_id':that.data.oid
						},
						// header: {
						// 	'content-type': 'application/x-www-form-urlencoded'
						// },
						dataType:'json',
						method:'POST',
						success(res) {
							console.log(res.data)
						
								wx.hideLoading()
							if(res.data.code==1){
								wx.showToast({
									 icon:'none',
									 title:'操作成功'
								})
								setTimeout(function(){
									that.setData({
										btnkg:0
									})
									wx.navigateBack()
									
								},1000)
								
							}else{
								that.setData({
									btnkg:0
								})
								if(res.data.msg){
									wx.showToast({
										title: res.data.msg,
										duration: 2000,
										icon:'none'
									});
								}else{
									wx.showToast({
										title: '网络异常',
										duration: 2000,
										icon:'none'
									});
								}
							}
							
							 
						},
						fail(err) {
							that.setData({
								btnkg:0
							})
								wx.hideLoading()
							
							wx.showToast({
								 icon:'none',
								 title:'操作失败'
							})
						},
						complete() {
						
						}
					})
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	
	},
	
	
})