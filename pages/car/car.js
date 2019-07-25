//car.js
var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		goods:[1,2,3],
		spimg:[],
		goods_sele:[
			{xuan:false,num:1,price:133},
			{xuan:false,num:1,price:133},
			{xuan:false,num:1,price:133},
		],
		xuan:false,
		all:false,
		sum:'0.00'
  },
  onLoad: function () {
   
  },
	onShow(){
		var that=this
		that.getcar()
			

	},
	onReady(){
		
	},
	onfocus(){
		return false;
	},
	select(e){
		let that =this
		// console.log(e.currentTarget.dataset.selec)
		let sid=e.currentTarget.dataset.selec
		// console.log(this.data.goods_sele[sid].xuan)
		if(that.data.goods_sele[sid].xuan==false){
			that.data.goods_sele[sid].xuan=true
				that.setData({
					goods_sele:that.data.goods_sele
				});
		}else{
			that.data.goods_sele[sid].xuan=false
				that.setData({
					goods_sele:that.data.goods_sele
				});
		}
	  let qx=true
	  for (let i in that.data.goods_sele) {
	  	if(that.data.goods_sele[i].xuan==false){
	  		qx=false
	  		break
	  	}
	  }
		console.log(qx)
		//触发全选
	  if(qx==true){
	  	that.setData({
	  		all:true
	  	})
	  }else{
			that.setData({
				all:false
			})
		}
		that.ladderpri_gb()
		//计算总价
		that.countpri()
	},
	onChange(e){
		console.log(e.currentTarget.dataset.selec)
		let idx =e.currentTarget.dataset.selec
		console.log(e.detail)
		this.data.goods_sele[idx].num=e.detail
			this.setData({
				goods_sele:this.data.goods_sele
			});
		//计算总价
		this.countpri()
		// console.log(that.goods_sele[1].laddermsgs.Totalpri)
	},
	selecAll(){
		let kg
		if(this.data.all==false){
			kg=true
		}else{
			kg=false
		}
		this.setData({
			all:kg
		})
		// this.data.goods_sele[sid].xuan=true
		for (let i in this.data.goods_sele) {
			this.data.goods_sele[i].xuan=kg
		}
		this.setData({
			goods_sele:this.data.goods_sele
		});
		this.ladderpri_gb()
		//计算总价
		this.countpri()
	},
	/*计算价格*/
	countpri(){
		let heji=0
		let var2= this.data.goods_sele
		for (let i in var2) {
			if(var2[i].xuan==true){
				
				if(var2[i].laddermsgs){
					
						heji +=var2[i].laddermsgs.Totalpri*100

				}else{
					heji +=var2[i].num*(var2[i].pri*100)
				}
			}
		}
		
		heji=(heji/100).toFixed(2)

		this.setData({
			sum:heji
		})
	},
	openOrder(){
		wx.navigateTo({
			url:"/pages/Order/Order"
		})
		let that = this
		let xuanG=that.data.goods_sele
		let idG=''
	for(let i in xuanG){
			if(xuanG[i].xuan){
				if(idG==''){
					idG =xuanG[i].order_cart_id
				}else{
					idG +=','+xuanG[i].order_cart_id
				}
				
			}
			
			// console.log(idG)
		}
		
		console.log(idG)
		if(idG!==''){
			app.openOrder(idG,1)
		}
	},
	//加减
	onNum(e){
		let that = this
		console.log(e.currentTarget.dataset)
		let ad=e.currentTarget.dataset.ad
		let id=e.currentTarget.dataset.id
		let thisidx=e.currentTarget.dataset.idx
		
		if(that.data.goods_sele[thisidx].num<2&&ad=='-'){
				console.log('禁止')
				return false;

		}
		//http://water5100.800123456.top/WebService.asmx/shopcar
		
		// return
		wx.request({
			url:  app.IPurl1+'shopcar',
			data:{
				op:'num',
				ad:ad,
				order_cart_id:id,
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr')
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
					console.log(res)
					console.log(resultd)
					if(ad=='-'){
						that.data.goods_sele[thisidx].num--
					}else{
						that.data.goods_sele[thisidx].num++
					}
					
					that.setData({
						goods_sele:that.data.goods_sele
					})
					console.log(thisidx)
					
					//计算总价
					that.countpri()
				}
			}
		})
	},
	//获取购物车
	getcar(){
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
		let that = this
		pageState1.finish()
		return
		wx.request({
			url:  app.IPurl1+'shopcar',
			data:{
				op:'list',
				key:app.jkkey,
				tokenstr:wx.getStorageSync('tokenstr')
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
					let resultd=res.data.list
					console.log(resultd)
					that.setData({
						goods:resultd
					})
					
					//设置选中的数组
					let arra=[]
					for (let i=0;i<resultd.length;i++) {
						
							arra.push({
								xuan:false,
								pri:resultd[i].order_cart.internal_price,
								num:resultd[i].order_cart.goods_count,
								order_cart_id:resultd[i].order_cart.order_cart_id,
								goods_sku_id:resultd[i].order_cart.goods_sku_id
							})
					}
					that.setData({
						goods_sele:arra,
						all:false,
						sum:'0.00'
					})
					that.countpri()
				}
				that.selecAll()
				pageState1.finish()    // 切换为finish状态
			},
			fail() {
				 pageState1.error()    // 切换为error状态
			}
		})
	},
	onRetry(){
		this.getcar()
	},
	opengoodsxq(e){
		let id=e.currentTarget.dataset.gid
		app.opengoods(id)
	},
	jump(e){
		app.jump(e)
	}
})



//http://water5100.800123456.top/WebService.asmx/order?op=orderpub&key=server_mima&tokenstr=1357311016561513&goods_sku_id=1&logistics_self=0&shop_store_house_id=5&shop_delivery_time_id=9&num=1&goods_unit=330ml*24瓶