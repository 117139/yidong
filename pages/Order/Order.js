//order.js
// var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		btnkg:0,
		htmlReset:0,
		type:0,    ///1 单品下单  2 购物车下单
		xzarr:[],
		yunfei:0,  //运费
		yhlist:[],  //优惠
		addresslist:[], //地址列表
		paykg:true,    //按钮开关
		address:'',
		sum:23.00,
		zsum:0
  },
  onLoad: function (option) {
		wx.setNavigationBarTitle({
			title:'加载中...'
		})
		var that =this
    console.log(option)
		if(option.type){
			console.log(option.xzarr)
			// let idg=option.id.split(",")
			let idg=option.id
			console.log(idg)
			var xzarr=JSON.parse(option.xzarr)
			that.setData({
				type:2,
				xzarr:xzarr,
				idg:idg
			})
			
		}else{
			// var goods=JSON.parse(option.goods)
			// var goods=option.goods
			var xzarr0={
				"goods_pic":option.goods_pic,
				"goods_name":option.goods_name,
				"goods_id":option.goods_id,
				"goods_real_price":option.goods_real_price,
				"attr_set":option.ggshow,
				"attr_setjson":option.ggjson,
				"num":option.goodsnum,
			}
			this.data.xzarr[0]=xzarr0
			that.setData({
				type:1,
				xzarr:this.data.xzarr
			})
			
			

		}
		setTimeout(function(){
			that.countpri()
			that.getyunfei()
			that.getyhlist()
		},0)
		// that.getaddlist()
		that.getadd()
  },
	cload(){
		var that=this
		that.countpri()
		that.getyunfei()
		that.getyhlist()
		
		that.getadd()
	},
	onShow(){
		
				let pages = getCurrentPages();
		    let currPage = pages[pages.length - 1];
		    if (currPage.data.addresschose) {
		        this.setData({
		            //将携带的参数赋值
		            address: currPage.data.addresschose,
		            addressBack: true
		      });
		 
		    console.log(this.data.address, '地址')
		 
		    }
	},
	onReady(){
		
	},
	bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show0: e.detail.value
    })
  },
	//address
	bchange1(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show1: e.detail.value,
			ztaddress:this.data.columns1[e.detail.value].id,
			zttime:this.data.columns2[e.detail.value][0].id
    })
		// that.setData({
		// 	ztaddress:that.data.columns1[0].id,
		// 	zttime:that.data.columns2[0][0].id
		// })
  },
	//time
	bchange2(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show2: e.detail.value,
			zttime:this.data.columns2[this.data.show1][e.detail.value].id
    })
  },
	/*计算价格*/
	countpri(){
		var that =this
		let heji=0
		let var2= this.data.xzarr
		// console.log(this.data.goods_sele)
		// console.log(var2)
		for (let i in var2) {
				
					heji +=var2[i].num*(var2[i].goods_real_price*100)

			
			
		}
		console.log(heji)
		heji=(heji/100).toFixed(0)
		
		this.setData({
			sum:heji
			
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
					title:'获取失败'
				})
				 console.log('失败')
			}
		})
	},
	//获取默认地址
	getadd(){
		let that = this
		wx.request({
			url:  app.IPurl+'/api/userAddressDefault',
			data:{
				token:wx.getStorageSync('token')
			},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded' 
			// },
			dataType:'json',
			method:'get',
			success(res) {
				// console.log(res.data)
				if(res.data.code==1){
						wx.setNavigationBarTitle({
							title:'提交订单'
						})
						that.setData({
							address:res.data.data,
							htmlReset:0
						})
						
						
				}else{
					wx.showToast({
						icon:'none',
						title:res.data.msg
					})
					that.setData({
						htmlReset:1
					})
				}
				
			},
			fail(err) {
				wx.showToast({
					icon:'none',
					title:'获取默认地址失败'
				})
				that.setData({
					htmlReset:1
				})
				 console.log(err)
			}
		})
	},
	//获取优惠
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
							
							var zsum
							if(res.data.data[0]){
								zsum=that.data.sum-res.data.data[0].coupon_money+Number(that.data.yunfei)
							}else{
								zsum=Number(that.data.sum)+Number(that.data.yunfei)
							}
							that.setData({
								zsum:zsum
							})
					}else{
						wx.showToast({
							icon:'none',
							title:''
						})
					}
					
				},
				fail() {
					wx.showToast({
						icon:'none',
						// title:res.data.msg
						title:'获取优惠券信息失败'
					})
					 console.log('失败')
				}
			})
		
	},
	subbtn(){
		
		console.log(app.IPurl1)
		let that = this
		
		if(that.data.address==null||that.data.address.id==''||that.data.address.id==undefined){
			wx.showToast({
				icon:'none',
				title:'请先添加地址'
			})
			return
		}
		if(that.data.paykg==false){
			return
		}else{
			wx.showLoading({
				title:'订单提交中...'
			})
			that.setData({
				paykg:false
			})
		}
		// wx.hideLoading()
		// that.setData({
		// 	paykg:true
		// })
		// wx.showToast({
		// 	title: '提交失败',
		// 	icon: 'none',
		// 	duration: 1000
		// })
		// return
		let data
		let jkurl
		if(that.data.type==2){
			data={
				token:wx.getStorageSync('token'),
				shopping_ids:that.data.idg,
				user_address_id:that.data.address.id,
				user_coupon_id:that.data.yhlist[0]?that.data.yhlist[0].id:-1
			}
			jkurl='/api/orderForShopping'
		}else{
		
			data={
				token:wx.getStorageSync('token'),
				goods_id:that.data.xzarr[0].goods_id,
				goods_attr:that.data.xzarr[0].attr_setjson,
				goods_num:that.data.xzarr[0].num,
				user_address_id:that.data.address.id,
				user_coupon_id:that.data.yhlist[0]?that.data.yhlist[0].id:-1
			}
			jkurl='/api/orderForGoods'
		}
		wx.request({
			url:  app.IPurl+jkurl,
			data:data,
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				
				wx.hideLoading()
				console.log(res)
				
				if(res.data.code==1){
					
					// setTimeout(function(){
						if(res.data.data.order_code){
							console.log('order_code'+res.data.data.order_code)
						 app.Pay(res.data.data.order_code)
						}
					// },1000)
					// let resultd=res.data
					// console.log(res.data)
					// if(res.data.data.order_code){
					// 	console.log('order_code'+res.data.data.order_code)
					// 	// app.Pay(res.data.order_info_id,'info')
					// }
				}else{
					wx.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 1000
					})
					that.setData({
						paykg:true
					})
				}
			},
			fail(res) {
				

				wx.hideLoading()
				that.setData({
					paykg:true
				})
				wx.showToast({
					title: '提交失败',
					icon: 'none',
					duration: 1000
				})
			}
		})
	
		
		// wx.navigateTo({
		// 	url:'../OrderDetails/OrderDetails'
		// })
		
	},
	goaddress(){
		app.goaddress()
	},
	//单品
	getGoodsDetails(id){
		// const pageState1 = pageState.default(this)
		// pageState1.loading()    // 切换为loading状态
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
					let resultd=res.data
					console.log(res.data)
					that.data.goodslist.push(res.data)
						that.setData({
							goodslist:that.data.goodslist,
						})
						
						let shopimg=resultd.data.goods_img.split(",")
						// let guige=resultd.data.goods_unit.split(",")
						// // that.data.spimg = that.data.spimg.concat(rlb)
						console.log(shopimg[0])
						that.data.spimg.push(shopimg[0])
						that.setData({
							spimg:that.data.spimg
						})
						let arra=[]
						if(that.data.goodslist[0].goods_total_limit!=''){
							
							arra.push({
								 xuan:true,
								// pri:res.data.shopinfo_sku_price_list[dbggidx].goods_sku_info.internal_price,
								num:that.data.goodsnum,
								// order_cart_id:that.data.goodslist[0].order_cart.order_cart_id,
								laddermsgs:that.ladderpri(0)
							})
						}else{
							var dbggidx=that.data.dbggtype
							console.log(dbggidx)
							let ss=res.data.shopinfo_sku_price_list[dbggidx].goods_sku_info.internal_price * that.data.goodsnum
							
							let Totalpri=ss.toFixed(2)
							
							arra.push({
								xuan:true,
								pri:res.data.shopinfo_sku_price_list[dbggidx].goods_sku_info.internal_price,
								num:that.data.goodsnum,
								Totalpri:Totalpri
							})
						}
						that.setData({
							goods_sele:arra
						})
						that.countpri()
				}
				// pageState1.finish()    // 切换为finish状态
				  // pageState1.error()    // 切换为error状态
			},
			fail(err) {
				wx.showToast({
					icon:'none',
					title:'获取失败'
				})
				console.log(err)
				 // pageState1.error()    // 切换为error状态
			}
		})
	},
	jump(e){
		app.jump(e)
	},
	onRetry(){
		this.onLoad()
	}
})
