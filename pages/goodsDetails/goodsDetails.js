//goodsdetails.js
var pageState = require('../../utils/pageState/index.js')
var WxParse = require('../../vendor/wxParse/wxParse.js')
const app = getApp()

Page({
  data: {
		kg:0,    
		goods_id:1, //商品id
		goods:'', //商品详情
		ggshow:'', //规格显示
		ggjson:'', //规格json
		yunfei:0, //运费
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
		sheetshow:false,         //规格弹框控制
		showcan:false,
		goods_total_limit:'',  //商品阶梯
		guige:['41','42','43','44'],  //规格
		guige1:['白色','黑色','蓝色','灰色'],  //规格
		type1:[],         //规格index
		cnum:0           ,//数量
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
				goods_id:option.id
			})
		}
		var article = '<div>11111111</div><div>11111111</div>'
		WxParse.wxParse('article', 'html', article, this, 5);
		
		this.getGoodsDetails()
		this.getyunfei()
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
			// console.log(ctx)
			var goods =that.data.goods
			var img =goods.goods_pic.split(",")
			var imgurl=app.IPurl+img[0]
		
			 wx.getImageInfo({
			  src:imgurl,
			  success(res){
			    ctx.drawImage(res.path,0,0,750,750)
					ctx.fillStyle="#fff";
					ctx.fillRect(0,750,750,150);
					ctx.setFillStyle('#000000')//文字颜色：默认黑色
					ctx.setFontSize(44)//设置字体大小，默认10
					ctx.fillText(	goods.goods_name ,38, 810)
					ctx.save()
					ctx.fillStyle="#f2f2f2";
					ctx.fillRect(0,840,750,434);
					ctx.save()
					ctx.setFillStyle('#f75852')//文字颜色：默认黑色
					
					// ctx.setFontSize(14)//设置字体大小，默认10
					ctx.font="bold 52px Arial";
					ctx.fillText('￥'+goods.goods_real_price ,38, 1060)
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
	
	onShow(){
		if(this.data.kg==1){
			this.getyh100()
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		console.log(res)
		if (res.from === 'button') {
			console.log(res.target.dataset.supid)
			this.setData({
				actionSheetHidden:false,
				kg:1
			})
	  }
	  return {
	    title: '霸道板鞋男',
	    success: function (res) {
	      console.log('成功', res)
				
	    }
	  }
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
		var ggs=this.data.guige
		var type=this.data.type1
		if(type[0]==-1){
			var ggshow1=[]
			var ggjson='{'
			for(var i=0;i<type.length;i++){
				type[i]=0
				
				console.log(ggs[i].values)
				ggshow1.push(ggs[i].values[0].attr_value)
				ggjson+='"'+ggs[i].name+'":"'+ggs[i].values[0].attr_value+'"'
				if(i!=ggs.length-1){
					ggjson+=','
				}
			}
			
			
			ggshow1=ggshow1.join(',')
			ggjson+="}"
			console.log(ggjson)
			// ggjson=JSON.parse(ggjson)
			this.setData({
				type1:type,
				ggshow: ggshow1,
				ggjson:ggjson,
				cnum:1
			})
		}
	},
	onChange(e){
		let idx =e.currentTarget.dataset.selec
		console.log(e.detail)
		// this.data.goods_sele[idx].num=e.detail
			this.setData({
				cnum:e.detail
			});
  },
  //选择规格
	selegg(e) {
	  // console.log(e.currentTarget.dataset.gg)
		this.data.type1[e.currentTarget.dataset.gg]=e.currentTarget.dataset.gg1
		
	  this.setData({
	    type1: this.data.type1
	  })
		var ggs=this.data.guige
		var ggidxs=this.data.type1
		
		var ggshow1=[]
		var ggjson='{'
		for(var i=0;i<ggs.length;i++){
			console.log(ggidxs[i])
			if(ggidxs[i]!=-1){
				console.log(ggs[i].values)
				ggshow1.push(ggs[i].values[ggidxs[i]].attr_value)
				ggjson+='"'+ggs[i].name+'":"'+ggs[i].values[ggidxs[i]].attr_value+'"'
				if(i!=ggs.length-1){
					ggjson+=','
				}
			}
		}
		ggshow1=ggshow1.join(',')
		ggjson+="}"
		// ggjson=JSON.parse(ggjson)
		 this.setData({
		  ggshow: ggshow1,
			ggjson:ggjson
		})
	},
	//更多评价
	gomore(){
		wx.navigateTo({
			url:"/pages/pinglun/pinglun"
		})
	},
	//加入购物车
	addwgc(){
		// wx.showToast({
		// 	title:"加入成功"
		// })
		// return
		///api/shopping
		console.log('addwgc')
		let that = this
		wx.request({
			url:  app.IPurl+'/api/shopping',
			data:{
				token:wx.getStorageSync('token'),
				goods_id:that.data.goods_id,						//(商品id) 
				num:that.data.cnum,															//（数量） 
				attr_set:that.data.ggjson,//(规格名称) 
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				if(res.data.code==1){
					let resultd=res.data
					// console.log(res.data)
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
	    url: '/pages/car/car'
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
	getGoodsDetails(){
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
		// return
		let that = this
		wx.request({
			url:  app.IPurl+'api/goodsPage',
			data:{token:wx.getStorageSync('token')},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				// console.log(res.data)
				if(res.data.code==1){
					let resultd=res.data.data
					var types=[]
					for(var i=0;i<resultd.goods_attr.length;i++){
						types.push(-1)
					}
						that.setData({
							goods:resultd,
							guige:resultd.goods_attr,
							type1:types
						})
						var article = resultd.goods_desc
						var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
						article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
						WxParse.wxParse('article', 'html', article, that, 5);
						
				}
				pageState1.finish()    // 切换为finish状态
				  // pageState1.error()    // 切换为error状态
			},
			fail() {
				 pageState1.error()    // 切换为error状态
			}
		})
	},
	getyhlist(){
		let that = this
		wx.request({
			url:  app.IPurl+'api/goods',
			data:{
				
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				// console.log(res.data)
				if(res.data.code==1){
	
						that.setData({
							goods:resultd,
							guige:resultd.goods_attr,
							type1:types
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
	//运费
	getyunfei(){
		let that = this
		wx.request({
			url:  app.IPurl+'/api/carriage',
			data:{
				
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				// console.log(res.data)
				if(res.data.code==1){
	
						that.setData({
							yunfei:res.data.data.carriage
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