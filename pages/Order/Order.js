//order.js
var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		xzarr:[],
		yunfei:0,
		yhlist:[],
		addresslist:[],
		paykg:true,
		goods_sku_id:'',
		address:wx.getStorageSync('morenaddress'),
		ztaddress:0,
		zttime:0,
		sum:23.00,
		zsum:0
  },
  onLoad: function (option) {
		var that =this
    console.log(option)
		if(option.type){
			console.log(option.xzarr)
			let idg=option.id.split(",")
			console.log(idg)
			var xzarr=JSON.parse(option.xzarr)
			that.setData({
				xzarr:xzarr,
				idg:idg
			})
			setTimeout(function(){
				that.countpri()
				that.getyunfei()
				that.getyhlist()
			},0)
		}else{
	
			that.setData({
				goods_sku_id:option.id
			})
			
			that.getGoodsDetails(option.id)

		}
		that.getaddlist()
		that.getadd()
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
					title:res.data.msg
				})
				 console.log('失败')
			}
		})
	},
	//运费
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
	
						that.setData({
							address:res.data.data
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
	//地址
	getaddlist(){
		// const pageState1 = pageState.default(this)
		// pageState1.loading()    // 切换为loading状态
		let that =this
		//http://water5100.800123456.top/WebService.asmx/useraddress
		wx.request({
			url:  app.IPurl+'/api/userAddressList',
			data:  {
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
						addresslist:res.data.data
					})
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
							if(res.data.data[0].coupon_money){
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
	subbtn(){
		
		console.log(app.IPurl1)
		let that = this
		let data
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
		wx.hideLoading()
		that.setData({
			paykg:true
		})
		wx.showToast({
			title: '提交失败',
			icon: 'none',
			duration: 1000
		})
		return
		if(that.data.goods_sku_id!==''){
			data={
				op:'orderpub',
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				goods_sku_id:that.data.goods_sku_id,	//商品ID
				sku_info_id:that.data.goodslist[0].goods_sku_info[that.data.dbggtype].sku_info_id,
				logistics_self:0,											//自提
				// user_member_shopping_address_id:that.data.address.user_member_shopping_address_id, //地址id(物流选择)
				shop_store_house_id:that.data.ztaddress,
				shop_delivery_time_id:that.data.zttime,
				num:that.data.goodsnum,
				goods_unit:that.data.goodsguige
			}
		}else{
			let idg=that.data.idg.join(',')
			console.log(idg)
			// return
			data={
				op:'orderpub',
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr'),
				carids:idg,
				logistics_self:0,											//自提
				shop_store_house_id:that.data.ztaddress,
				shop_delivery_time_id:that.data.zttime,
			}
		}
		wx.request({
			url:  app.IPurl1+'order',
			data:data,
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				
				wx.hideLoading()
				console.log(res)
				
				if(res.data.error==-2){
					app.checktoken(res.data.error)
					that.onLoad()
				}else if(res.data.error==0){
					let resultd=res.data
					console.log(res.data)
					if(res.data.order_info_id){
						console.log('178info')
						app.Pay(res.data.order_info_id,'info')
					}
					if(res.data.partner_trade_no){
						console.log('182no')
						app.Pay(res.data.partner_trade_no,'no')
					}
				}else{
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
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
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
		this.onLoad()
	}
})
