//goodsdetails.js
// var pageState = require('../../utils/pageState/index.js')
var WxParse = require('../../vendor/wxParse/wxParse.js')
const app = getApp()

Page({
  data: {
		btnkg:0,    //0可以  1不可以
		htmlReset:0,
		kg:0,    
		goods_id:1, //商品id
		goods:'', //商品详情
    newprice: '', //新增价格
    newimg: '',    //新增img
    sku_id:0,
		ggshow:'', //规格显示
		ggjson:'', //规格json
		yunfei:0, //运费
		pllist:[],
		spimg:[],
		goodsd:'',
		indicatorDots: true,
		autoplay: true,
		circular:true,
		interval: 3000,
		duration: 1000,
		sheetshow:false,         //规格弹框控制
		showcan:false,
		goods_total_limit:'',  //商品阶梯
		guige:[],  //规格
		guige1:[],  //规格
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
		wx.setNavigationBarTitle({
			title:'加载中...'
		})
    if(option.id){
			// console.log(option.id)
			this.setData({
				goods_id:option.id
			})
		}
		// var article = '<div>11111111</div><div>11111111</div>'
		// WxParse.wxParse('article', 'html', article, this, 5);
		
		this.getGoodsDetails()
		this.getyunfei()
		this.getpinlun()
  },
	cload(){
		this.getGoodsDetails()
		this.getyunfei()
		this.getpinlun()
	},
	onReady: function () {
    
		
	},
	
	onShow(){
    if (!wx.getStorageSync('userWxmsg')) {
     
      return
    }
		if(this.data.kg==1){
			this.setData({
				kg:0
			})
      
			this.getyh100()
			
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		var that =this
		console.log(res)
		if (res.from === 'button') {
			console.log(res.target.dataset.supid)
			that.setData({
				actionSheetHidden:true,
				kg:1
			})
	  }
	  return {
	    // title: '霸道板鞋男',
			title:that.data.goods.goods_name,
	    success: function (res) {
	      console.log('成功', res)
				
	    }
	  }
	},
	ctxc(){
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
				},0)
		
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
			},
      fail: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          console.log("打开设置窗口");
          that.imageErrorAuth()
        }
      }
		})
  },
  imageErrorAuth() {
    // 授权失败 提示授权操作
    wx.showModal({
      title: '提示',
      content: '需要您授权保存至相册',
      showCancel: false,
      success: modalSuccess => {
        wx.openSetting({
          success(settingData) {
            console.log("settingData", settingData)
            if (settingData.authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '提示',
                content: '获取权限成功,再次保存图片即可',
                showCancel: false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取权限失败，将无法保存到相册',
                showCancel: false
              })
            }
          },
          fail(failData) {
            console.log("failData", failData)
          },
          complete(finishData) {
            console.log("finishData", finishData)
          }
        })
      }
    })
  },

  //获取优惠
	getyh100(){
		var that=this
		wx.request({
				url:  app.IPurl+'/api/coupon/'+that.data.goods.id,
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
							// wx.navigateTo({
							// 	url:'/pages/yhlist/yhlist'
							// })
								that.getGoodsno()
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
	
	getpinlun(){
		var that=this
		wx.request({
				url:  app.IPurl+'/api/comment/1',
				data:{
					page:1,
					page_length:1,
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
								pllist:res.data
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
			sheetshow:true,
      btnkg:0
		})
		var ggs=this.data.guige
		var type=this.data.type1
		if(type[0]==-1){
			var ggshow1=[]
      var ggshowid = []
			var ggjson='{'
			for(var i=0;i<type.length;i++){
				type[i]=0
				
				// console.log(ggs[i].values)
				ggshow1.push(ggs[i].values[0].attr_value)
        ggshowid.push(ggs[i].values[0].id)
				ggjson+='"'+ggs[i].name+'":"'+ggs[i].values[0].attr_value+'"'
				if(i!=ggs.length-1){
					ggjson+=','
				}
			}
			
			
			ggshow1=ggshow1.join('，')
			ggjson+="}"
			console.log(ggjson)
      var newpri = this.bSort(ggshowid)
      newpri = newpri.join('_')
      console.log(newpri)
      var json1 = this.data.goods.sku_data
      var mrpri = this.data.goods.goods_real_price
      var mrpimg = this.data.goods.goods_pic
      this.setData({
        newprice: mrpri,
        newimg: mrpimg,
        sku_id:0
      })
      for (var key in json1) {
        // console.log(key, newpri, newpri == key);     //获取key值
        if (key == newpri) {
          console.log(json1[key])
          this.setData({
            newprice: json1[key].sku_price,
            sku_id: json1[key].sku_id,
            newimg: json1[key].sku_images,
          })
        }
        // console.log(json1[key]); //获取对应的value值
      }
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
		
    var ggshow1 = []
		var ggshowid=[]
		var ggjson='{'
		for(var i=0;i<ggs.length;i++){
			console.log(ggidxs[i])
			if(ggidxs[i]!=-1){
				console.log(ggs[i].values)
        ggshow1.push(ggs[i].values[ggidxs[i]].attr_value)
        ggshowid.push(ggs[i].values[ggidxs[i]].id)
				ggjson+='"'+ggs[i].name+'":"'+ggs[i].values[ggidxs[i]].attr_value+'"'
				if(i!=ggs.length-1){
					ggjson+=','
				}
			}
		}
		var ggshow2=ggshow1.join('，')
		ggjson+="}"
		// ggjson=JSON.parse(ggjson)
    var newpri = this.bSort(ggshowid)
    newpri = newpri.join('_')
    console.log(newpri)
    var json1 = this.data.goods.sku_data
    var mrpri = this.data.goods.goods_real_price
    var mrpimg = this.data.goods.goods_pic
    this.setData({
      newprice: mrpri,
      newimg: mrpimg,
      sku_id: 0
    })
    for (var key in json1) {
      // console.log(key, newpri, newpri == key);     //获取key值
      if (key == newpri){
        console.log(json1[key])
        this.setData({
          newprice: json1[key].sku_price,
          sku_id: json1[key].sku_id,
          newimg: json1[key].sku_images,
        })
      }
      // console.log(json1[key]); //获取对应的value值
    }
    // console.log(this.data.goods.sku_data['"'+newpri+'"'])
		 this.setData({
       ggshow: ggshow2,
			ggjson:ggjson
		})
	},
  bSort(arr) {
    var len = arr.length;
    for(var i = 0; i<len- 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        // 相邻元素两两对比，元素交换，大的元素交换到后面
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  },
	//更多评价
	gomore(){
		wx.navigateTo({
			url:"/pages/pinglun/pinglun"
		})
	},
	//加入购物车
	addwgc(){
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
		// wx.showToast({
		// 	title:"加入成功"
		// })
		// return
		///api/shopping
		console.log('addwgc')
		let that = this
		if(that.data.btnkg==1){
			return
		}else{
			that.setData({
				btnkg:1
			})
		}
		wx.request({
			url:  app.IPurl+'/api/shopping',
			data:{
				token:wx.getStorageSync('token'),
				goods_id:that.data.goods_id,						//(商品id) 
				num:that.data.cnum,															//（数量） 
				attr_set:that.data.ggjson,//(规格名称)
        sku_id: that.data.sku_id,
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
          // that.setData({
          //   btnkg: 0
          // })
         
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
			fail(err){
				that.setData({
					btnkg:0
				})
				wx.showToast({
					title: '网络异常',
					duration: 2000,
					icon:'none'
				});
			}
		})
	},
	nowbuy(){
    if (!wx.getStorageSync('userWxmsg')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
		// console.log('buy')
		//http://water5100.800123456.top/WebService.asmx/order
		let that = this
	
    let goods = this.data.goods
    let newimg = this.data.newimg
    let newprice = this.data.newprice
		//let goodsname=this.data.goodsd.goods_sku_name
    let goods_pic = newimg ? newimg :goods.goods_pic
		let goods_name =goods.goods_name
		let goods_id =goods.id
    let goods_real_price = newprice ? newprice :goods.goods_real_price
		let ggshow=that.data.ggshow
		let ggjson=that.data.ggjson
		let goodsnum=this.data.cnum
    let sku_id= that.data.sku_id
		// let goodsladder=this.data.goodsd.is_ladder_pricing
		// let goodsxq=this.data.goodsd
		// console.log(goodsxq)
		 wx.navigateTo({
       url: '/pages/Order/Order?goods_pic=' + goods_pic + '&goods_name=' + goods_name + '&goods_id=' + goods_id + '&goods_real_price=' + goods_real_price + '&ggshow=' + ggshow + '&ggjson=' + ggjson + '&goodsnum=' + goodsnum + '&sku_id=' + sku_id
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
					wx.setNavigationBarTitle({
						title:'商品详情'
					})
					let resultd=res.data.data
					var types=[]
					for(var i=0;i<resultd.goods_attr.length;i++){
						types.push(-1)
					}
						that.setData({
							goods:resultd,
							guige:resultd.goods_attr,
							type1:types,
							htmlReset:0
						})
						//画图
						that.ctxc()
						var article = resultd.goods_desc
						var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
						article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
						WxParse.wxParse('article', 'html', article, that, 5);
						
				}else{
					wx.showToast({
						icon:'none',
						title:'获取失败'
					})
					that.setData({
						htmlReset:1
					})
					console.log(res.data)
				}
				// pageState1.finish()    // 切换为finish状态
				  // pageState1.error()    // 切换为error状态
			},
			fail(err) {
				that.setData({
					htmlReset:1
				})
				wx.showToast({
					icon:'none',
					title:'获取失败'
				})
				console.log(err)
				 
			}
		})
	},
	getGoodsno(){
	
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
						//画图
						that.ctxc()
						var article = resultd.goods_desc
						var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
						article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
						WxParse.wxParse('article', 'html', article, that, 5);
						
				}
				// pageState1.finish()    // 切换为finish状态
				  // pageState1.error()    // 切换为error状态
			},
			fail() {
				 // pageState1.error()    // 切换为error状态
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