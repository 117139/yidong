//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../vendor/wxParse/wxParse.js')
var pageState = require('../../utils/pageState/index.js')
Page({
  data: {
		tokenstr: wx.getStorageSync('tokenstr')?wx.getStorageSync('tokenstr'):'',
		bannerimg:[
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg'
		],
		shoplist:[
			1
		],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
		circular:true
  },
  onLoad: function () {
		var that=this
		// app.dologin()
		// setTimeout(function(){
		// 	
		// var article = '<img  src="/uploadfile/2019/0724/20190724101802392.png" style="width: 859px; height: 646px;" />'
		// WxParse.wxParse('article', 'html', article, that, 5);
			that.getshoplist()
		// },10)
  },
	
	onShow(){
		
	},
	onShareAppMessage(){
		return {
      title: '转发',
      path: '/pages/index/index',
      success: function(res) {
				console.log('success')
			}
    }
	},
	opengoods(e){
		 let id = e.currentTarget.dataset.id
		 let sku_info_id = e.currentTarget.dataset.sku_info_id
		app.opengoods(id,sku_info_id)
	},
	getshoplist(){
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
		let that = this
		pageState1.finish()
		return
		wx.request({
			url:  app.IPurl1+'shopinfo',
			data:{
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				goods_sku_id:id
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				// console.log(res.data)
				
				if(res.data.error==-2){
					app.checktoken(res.data.error)
					that.onLoad()
				}
				if(res.data.error==0){
					let resultd=res.data.data
					// console.log(res.data)
						that.setData({
							goodsd:resultd,
						})
						var article = resultd.goods_describe
						WxParse.wxParse('article', 'html', article, that, 5);
						let rlb=resultd.goods_img.split(",")
						let guige=res.data.shopinfo_sku_price_list
						let goods_total_limit=res.data.goods_total_limit
						that.data.spimg = that.data.spimg.concat(rlb)
						if(resultd.is_ladder_pricing==1){
							that.setData({
								pricelist:res.data.pricelist,
								havenum:res.data.havenum
								
							})
						}
						that.setData({
							spimg:that.data.spimg,
							guige:guige,
							goods_total_limit:goods_total_limit
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
	jump(e){
		app.jump(e)
	},
	onRetry(){
		this.getshoplist()
	}
})
