//logs.js
// var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		btnkg:0,
		htmlReset:0,
		datalist:[
			'全部',
			'待付款',
			'待发货',
			'待收货',
			'已完成',
		],
		pages:[1,1,1,1,1],
		type:0,
		goods:[
				[],
				[],
				[],
				[],
				[],
		],
		shopNum:[],
		sum:0,
		otype:-2
  },
  onLoad: function (option) {
		wx.setNavigationBarTitle({
			title:'加载中...'
		})
    if(option.id){
			console.log(option.id)
		}
		// let hmtltit
		// if(option.id==-2){
		// 	hmtltit="订单"
		// }else if(option.id==0){
		// 	hmtltit="未支付"
		// }else if(option.id==1){
		// 	hmtltit="待取货"
		// }else if(option.id==3){
		// 	hmtltit="已完成"
		// }
		// console.log(hmtltit)
		wx.setNavigationBarTitle({
			title: '订单列表'
		})
		if(option.type){
			this.setData({
				type:option.type
			})
		}
		
		
		
  },
	onShow(){
		var pages=[1,1,1,1,1]
		var goods=[ [],[],[],[],[], ]
		this.data.goods=goods
		this.setData({
			pages:pages,
			goods:this.data.goods
		})
    if (this.data.btnkg==1){
			that.setData({
				btnkg:0
			})
		}
		console.log('我显示了')
		this.getOrderList('onshow')
	},
	cload(){
		var pages=[1,1,1,1,1]
		var goods=[ [],[],[],[],[], ]
		this.data.goods=goods
		this.setData({
			pages:pages,
			goods:this.data.goods
		})
		console.log('我显示了')
		this.getOrderList('onshow')
	},
	onReady(){
		
	},
	bindcur(e){
		var that =this
	  console.log(e.currentTarget.dataset.type)
	  that.setData({
	    type: e.currentTarget.dataset.type
	  })
		// that.getOrderList()
		if(that.data.goods[that.data.type].length==0){
			that.getOrderList()
		}
	},
	gopinlun(e){
		wx.navigateTo({
			url:'/pages/fabiaopl/fabiaopl?oid='+e.currentTarget.dataset.oid
		})
	},
	//删除
	cancelOrder(e){
		let that =this
		// console.log('picker发送选择改变，携带值为', e.detail.value)
		let oid=e.currentTarget.dataset.oid
		wx.showModal({
			title: '提示',
			content: '是否取消该订单?',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					wx.request({
						url:  app.IPurl+'/api/order',
						data:{
							status:-1,
							order_id:oid,
							token:wx.getStorageSync('token')
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' 
						},
						dataType:'json',
						method:'PUT',
						success(res) {
							if(res.data.error==-2){
								app.checktoken(res.data.error)
								that.onLoad()
							}
							if(res.data.code==1){
								wx.showToast({
									title: '删除成功',
									duration: 1000
								});
								setTimeout(function(){
									var pages=[1,1,1,1,1]
									var goods=[ [],[],[],[],[], ]
									that.setData({
										pages:pages,
										goods:goods
									})
									that.getOrderList()
								},1000)
								// that.getOrderList(that.data.type)
							}else{
								wx.showToast({
									title: '操作失败',
									duration: 1000
								});
							}
							
						
						},
						fail() {
							 wx.showToast({
							 	title: '操作失败',
							 	duration: 1000
							 });
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
		
	},
	/*计算价格*/
	countpri(){
		let heji=0
		let var2= this.data.goods
		for (let i in var2) {
				heji +=var2[i].num*(var2[i].pri*100)
				let zj=var2[i].num*(var2[i].pri*100)
				if(zj==0){
					this.setData({
						sum:'0.00'
					})
					return
				}else{
					zj=zj+"'"
				}
				if(zj.length<4){
					zj='0000'+zj
					zj=zj.substr(-4);
					// console.log(zj)
				}
				
				let zj1 = zj.substring(0, zj.length-3);
				let zj2 = zj.substring( zj.length-3, zj.length-1);
				// console.log(zj1+'.'+zj2)
				zj=zj1+'.'+zj2
				this.data.goods[i].zj=zj
				this.setData({
					goods:this.data.goods
				})
		}
		// console.log(heji)
		if(heji==0){
			this.setData({
				sum:'0.00'
			})
			return
		}else{
			heji=heji+"'"
		}
		if(heji.length<4){
			heji='0000'+heji
			heji=heji.substr(-4);
			// console.log(heji)
		}
		
		let hj1 = heji.substring(0, heji.length-3);
		let hj2 = heji.substring( heji.length-3, heji.length-1);
		// console.log(hj1+'.'+hj2)
		heji=hj1+'.'+hj2
		this.setData({
			sum:heji
		})
	},

	shouhuoBtn(e){
		let that =this
		// console.log('picker发送选择改变，携带值为', e.detail.value)
		let oid=e.currentTarget.dataset.oid
		wx.showModal({
			title: '提示',
			content: '是否确认收货?',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					if(that.data.btnkg==1){
						return
					}else{
						that.setData({
							btnkg:1
						})
					}
					wx.request({
						url:  app.IPurl+'/api/order',
						data:{
							status:1,
							order_id:oid,
							token:wx.getStorageSync('token')
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' 
						},
						dataType:'json',
						method:'PUT',
						success(res) {
							
							if(res.data.code==1){
								wx.showToast({
									title: '收货成功',
									duration: 1000
								});
								setTimeout(function(){
									var pages=[1,1,1,1,1]
									var goods=[ [],[],[],[],[], ]
									that.setData({
										pages:pages,
										goods:goods
									})
									that.setData({
										btnkg:0
									})
									that.getOrderList()
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
						fail() {
							that.setData({
								btnkg:0
							})
							 wx.showToast({
							 	title: '操作失败',
							 	duration: 1000
							 });
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
		
		
	},

	//获取列表
	getOrderList(ttype){
		// const pageState1 = pageState.default(this)
		// pageState1.loading()    // 切换为loading状态
		// pageState1.finish()
		// return
		let that = this
		//http://water5100.800123456.top/WebService.asmx/order
		wx.request({
			url:  app.IPurl+'/api/orderList',
			data:{
				token:wx.getStorageSync('token'),
				status_code:that.data.type,
				page:that.data.pages[that.data.type],
				page_length:10
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				if(res.data.code==1){
					wx.setNavigationBarTitle({
						title:'订单列表'
					})
					that.setData({
						htmlReset:0
					})
						console.log(ttype)
						let resultd=res.data.data
						if(ttype=='onshow'){
							var pages=[1,1,1,1,1]
							var goods=[ [],[],[],[],[], ]
							that.data.goods=goods
						}
						if(resultd.length>0){
							that.data.goods[that.data.type]=that.data.goods[that.data.type].concat(resultd)
							that.data.pages[that.data.type]++
							that.setData({
								goods:that.data.goods,
								pages:that.data.pages,
							})
							console.log(that.data.goods)
						}else{
							wx.showToast({
								icon:"none",
								title:"没有更多数据了"
							})
						}
						// console.log(res.data.list)
						
						
				}else{
					wx.showToast({
						icon:"none",
						title:"获取失败"
					})
					that.setData({
						htmlReset:1
					})
					console.log(res.data)
				}
				
				// pageState1.finish()    // 切换为finish状态
			},
			fail(err) {
				wx.showToast({
					icon:"none",
					title:"获取失败"
				})
				that.setData({
					htmlReset:1
				})
				console.log(err)
				 // pageState1.error()    // 切换为error状态
			}
		})
	},
	//订单详情
	goOrderDetails(e){
		console.log(e.currentTarget.dataset.id)
		wx.navigateTo({
			url:'/pages/OrderDetails/OrderDetails?id='+e.currentTarget.dataset.id
		})
	},
	//付款
	pay(e){
    var that =this
		let oid=e.currentTarget.dataset.code
		if(that.data.btnkg==1){
			return
		}else{
			that.setData({
				btnkg:1
			})
		}
		app.Pay(oid,'info')
	},
	onRetry(){
		this.onLoad()
	}
})
