//goodsdetails.js
var pageState = require('../../utils/pageState/index.js')
var WxParse = require('../../vendor/wxParse/wxParse.js')
const app = getApp()

Page({
  data: {
		spimg:[
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',

		],
		goodsd:'',
		indicatorDots: true,
		autoplay: true,
		circular:true,
		interval: 3000,
		duration: 1000,
		qujan:[
			{qj:'1-3',num:1,pri:24,gs:10000,spri:24},
			{qj:'4-10',num:7,pri:48,gs:0,spri:336},
			{qj:'10-',num:5,pri:72,gs:0,spri:360}
		],
		sheetshow:false,         //规格弹框控制
		showcan:false,
		goods_total_limit:'',  //商品阶梯
		guige:['41','42','43','44'],  //规格
		guige1:['白色','黑色','蓝色','灰色'],  //规格
		type1:0,         //规格index
    type2:0,
		cnum:1           ,//数量
		goods_sku_id:0,  //商品id
		pricelist:0,            //阶梯价
		havenum:0,               //已购数量
		addshow:false,         //小红点
		width:0,
		shareTempFilePath:'',
		actionSheetHidden: true,




  },
	listenerButton: function() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        });
    },
    listenerActionSheet:function() {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
    },

  onLoad: function (option) {
    if(option.id){
			// console.log(option.id)
			this.setData({
				goods_sku_id:option.id
			})
		}
		var article = '<div>11111111</div><div>11111111</div>'
		WxParse.wxParse('article', 'html', article, this, 5);
		
		this.getGoodsDetails(option.id,option.sku_info_id)
  },
	onReady: function () {
    var that = this;
   var query = wx.createSelectorQuery();

    query.select('.htoi').boundingClientRect(function (rect) {
      // console.log(rect.width)
      that.setData({
        width: rect.width
      })
			const ctx = wx.createCanvasContext('share');
			console.log(ctx)
			 wx.getImageInfo({
			  src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563874463693&di=39d4ee06bfc66cdde04022278d004fee&imgtype=0&src=http%3A%2F%2Fpic45.nipic.com%2F20140729%2F1628220_084628920000_2.jpg',
			  success(res){
			    ctx.drawImage(res.path,0,0,750,750)
					ctx.fillStyle="#fff";
					ctx.fillRect(0,750,750,150);
					ctx.setFillStyle('#000000')//文字颜色：默认黑色
					ctx.setFontSize(44)//设置字体大小，默认10
					ctx.fillText('霸道板鞋男' ,38, 810)
					ctx.save()
					ctx.fillStyle="#f2f2f2";
					ctx.fillRect(0,840,750,434);
					ctx.save()
					ctx.setFillStyle('#f75852')//文字颜色：默认黑色
					
					// ctx.setFontSize(14)//设置字体大小，默认10
					ctx.font="bold 52px Arial";
					ctx.fillText('￥133.00' ,38, 1060)
					ctx.drawImage("../../static/images/xcxewm.jpg",432,860,270,270)
					ctx.save()
					ctx.setFillStyle('#333333')//文字颜色：默认黑色
					
					// ctx.setFontSize(14)//设置字体大小，默认10
					ctx.font="30px Arial";
					ctx.fillText('扫码或长按小程序码' ,432, 1180)
			    ctx.draw()

			  }
			})
    }).exec();
		// wx.showLoading({
		// 	title:'图片生成中'
		// })
		// setTimeout(function(){
		// 	that.getTempFilePath1()
		// 	wx.hideLoading()
		// },500)
		
	},
  //获取临时路径
  getTempFilePath1: function () {
		var that =this
		wx.showLoading({
			title:'图片生成中'
		})
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
				wx.hideLoading()
				console.log(res.tempFilePath)
        that.setData({
          shareTempFilePath: res.tempFilePath
        })
				setTimeout(function(){
					that.setData({
						showcan: true ,
						actionSheetHidden: !that.data.actionSheetHidden
					
					});
				},1000)
		
      }
    })
		
		
  },
  //下载
  getTempFilePath: function () {
		var that =this
		wx.showLoading({
			title:'正在保存'
		})
		wx.saveImageToPhotosAlbum({
			filePath:that.data.shareTempFilePath,
			success(res1) {
				console.log(res1)
				wx.hideLoading()
			}
		})
    /*wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
				console.log(res.tempFilePath)
        that.setData({
          shareTempFilePath: res.tempFilePath
        })
				wx.saveImageToPhotosAlbum({
					filePath:res.tempFilePath,
					success(res1) {
						console.log(res1)
					}
				})
		
      }
    })*/
  },






	onClose(){
		this.setData({
			sheetshow:false
		})
	},
	onClosecanvas() {
    this.setData({ showcan: false });
  },
	sheetshow(){
		this.setData({
			sheetshow:true
		})
	},
	onChange(e){
		let idx =e.currentTarget.dataset.selec
		console.log(e.detail)
		// this.data.goods_sele[idx].num=e.detail
			this.setData({
				cnum:e.detail
			});
  },
  selegg(e) {
    console.log(e.currentTarget.dataset.gg)
    this.setData({
      type1: e.currentTarget.dataset.gg
    })
  },
  selegg1(e) {
    console.log(e.currentTarget.dataset.gg)
    this.setData({
      type2: e.currentTarget.dataset.gg
    })
  },
	gomore(){
		wx.navigateTo({
			url:"/pages/pinglun/pinglun"
		})
	},
	addwgc(){
		wx.showToast({
			title:"加入成功"
		})
		return
		//http://water5100.800123456.top/WebService.asmx/shopcar
		console.log('addwgc')
		let that = this
		wx.request({
			url:  app.IPurl1+'shopcar',
			data:{
				op: 'addcar',
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				goods_sku_id:that.data.goods_sku_id,						//(商品id) 
				num:that.data.cnum,															//（数量） 
				goods_unit:that.data.guige[that.data.type1].goods_sku_info.goods_unit			,//(规格名称) 
				sku_info_id:that.data.guige[that.data.type1].goods_sku_info.sku_info_id
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				
				if(res.data.error==-2){
					app.checktoken(res.data.error)
					that.onLoad()
				}
				if(res.data.error==0){
					let resultd=res.data
					console.log(res.data)
					that.onClose()
					wx.showToast({
						title:'添加成功'
					})
					that.setData({
						addshow:true
					})
				}
			}
		})
	},
	nowbuy(){
		wx.navigateTo({
		  url: '/pages/Order/Order'
		})
		console.log('buy')
		//http://water5100.800123456.top/WebService.asmx/order
		let that = this
	
		// let goodsxq=JSON.stringify(this.data.goodsd)
		// let goodsname=this.data.goodsd.goods_sku_name
		let goodsguige=this.data.guige[this.data.type1].goods_sku_info.goods_unit
		let goodsnum=this.data.cnum
		// let goodsladder=this.data.goodsd.is_ladder_pricing
		// let goodsxq=this.data.goodsd
		// console.log(goodsxq)
		 wx.navigateTo({
		  url: '/pages/Order/Order?id=' + that.data.goods_sku_id+'&goodsguige=' + goodsguige+'&ggtype=' + this.data.type1+'&goodsnum=' + goodsnum
		})
	},
	opengwc(e) {
	  let id = e.currentTarget.dataset.id
		var that =this
		// console.log(id)
		
	  wx.switchTab({
	    url: '/pages/car/car?id=' + id
	  })
		that.setData({
			addshow:false
		})
	},
	openshouye(){
		wx.switchTab({
		  url: '/pages/index/index'
		})
	},
	getGoodsDetails(id,gid){
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
		pageState1.finish()
		return
		let that = this
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
	onRetry(){
		this.onLoad()
	},
	pveimg(e){
		let that =this
		if(e.currentTarget.dataset.curitem){
			app.pveimg(that.data.spimg,e.currentTarget.dataset.curitem,true)
		}else{
			app.pveimg(e.currentTarget.dataset.imgurl)
		}
		
	},
	previewImage(e){
		app.previewImage(e)
	},
  goshare(){
		var that =this
    wx.showActionSheet({
      itemList: ['发送给朋友', '保存商品图片'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex==1){
					that.getTempFilePath1()
         
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})
	/*wx.request({
			url:  app.IPurl1+'order',
			data:{
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				goods_sku_id:that.data.goodsd.goods_sku_id
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
					console.log(res.data.data)
					
				}
			}
		})*/