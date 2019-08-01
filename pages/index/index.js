//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../vendor/wxParse/wxParse.js')
var pageState = require('../../utils/pageState/index.js')
Page({
  data: {
		tokenstr: 'xxx',
		bannerimg:[
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg'
		],
		youhui:100, //优惠
		shopxq:'',
		kg:0,
		goods:'',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
		circular:true
  },
  onLoad: function () {
		var that=this
		that.getbanner()
		that.getshoplist()
		that.getyouhui()
		that.getgoods()
  },
	
	onShow(){
		if(this.data.kg==1){
			this.getyh100()
		}
	},
	onHide(){
		
	},
	onShareAppMessage: function (res) {
		var img =this.data.goods.goods_pic.split(",")
		var imgurl=app.IPurl+img[0]
		console.log(res)
		if (res.from === 'button') {
			console.log(res.target.dataset.supid)
			this.setData({
				kg:1
			})
			
			
	  }
	  return {
	    title: '霸道板鞋男',
      imageUrl: imgurl,
			path:'/pages/goodsDetails/goodsDetails',
	    success: function (res) {
	      console.log('成功', res)
			},
      fail: function (res) {
        // 转发失败
        console.log("用户点击了取消", res)
      }
	  }
	},
	getyh100(){
		var that=this
		wx.request({
				url:  app.IPurl+'/api/coupon/1',
				data:{
					token:wx.getStorageSync('token')
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				dataType:'json',
				method:'post',
				success(res) {
					console.log(res.data)
					if(res.data.code==1){
			
							wx.showToast({
								icon:'none',
								title:'领取成功'
							})
							that.setData({
								kg:0
							})
						setTimeout(function(){
							wx.navigateTo({
								url:'/pages/yhlist/yhlist'
							})	
						},1000)
							
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
	opengoods(e){
		 let id = e.currentTarget.dataset.id
		 let sku_info_id = e.currentTarget.dataset.sku_info_id
		app.opengoods(id,sku_info_id)
	},
	getbanner(){
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
		let that = this
		wx.request({
			url:  app.IPurl+'api/indexRollPic',
			data:{},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'GET',
			success(res) {
			// console.log(res)
				if(res.data.code==1){
					let resultd=res.data.data
					// console.log(res.data)
						that.setData({
							bannerimg:resultd,
						})
				}
				pageState1.finish()    // 切换为finish状态
				  // pageState1.error()    // 切换为error状态
			},
			fail() {
				 pageState1.error()    // 切换为error状态
			}
		})
	},
	getshoplist(){
		
		let that = this
		wx.request({
			url:  app.IPurl+'api/indexDesc',
			data:{},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'GET',
			success(res) {
				if(res.data.code==1){
					let resultd=res.data.data
					
						var article = resultd.desc
						var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
						article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
						WxParse.wxParse('article', 'html', article, that, 5);
						
						
						// that.setData({
						// 	shopxq:that.data.spimg,
						// 	
						// })
				}
			
			},
			fail() {
				console.log('获取失败')
			}
		})
	},
	getyouhui(){
		
		let that = this
		wx.request({
			url:  app.IPurl+'api/coupon',
			data:{},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'GET',
			success(res) {
				if(res.data.code==1){
					let resultd=res.data.data
						
						
						that.setData({
							youhui:resultd.power,
							
						})
				}
			
			},
			fail() {
				console.log('获取失败')
			}
		})
	},
	getgoods(){
		
		let that = this
		wx.request({
			url:  app.IPurl+'api/goods',
			data:{},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'GET',
			success(res) {
				if(res.data.code==1){
					let resultd=res.data.data
						
						
						that.setData({
							goods:resultd,
							
						})
				}
			
			},
			fail() {
				console.log('获取失败')
			}
		})
	},
	jump(e){
		app.jump(e)
	},
	onRetry(){
		// this.getshoplist()
	}
})
