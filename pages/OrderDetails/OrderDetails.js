//logs.js
// var pageState = require('../../utils/pageState/index.js')
const app = getApp()
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
const qrcodeWidth = rpx2px(210)
Page({
  data: {
		btnkg:0,
		htmlkg:0,
		Odata:'',
		order_id:'',
		order_status:'',
		delivery_code:'',
		goods:[],
		spimg:[],
		shopNum:[],
		goods_sele:[],
    qujan:[],
		order_product_list:[],
		show0:0,
		show1:0,
		show2:0,
		sum:0,
		qrcodeWidth: qrcodeWidth,
  },
  onLoad: function (option) {
		wx.setNavigationBarTitle({
			title:'加载中...'
		})
    if(option.id){
			console.log(option.id)
		}
		this.setData({
			order_id:option.id
		})
		this.getOrderList(option.id)
  },
	cload(){
		this.getOrderList(this.data.order_id)
	},
	onReady(){
		let that =this
		that.countpri()
		console.log(that.delivery_code)
		
	},
	onShow(){
		if(that.data.btnkg==1){
			that.setData({
				btnkg:0
			})
		}
	},
	bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show0: e.detail.value
    })
  },
	bchange1(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show1: e.detail.value
    })
  },
	bchange2(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show2: e.detail.value
    })
  },
	/*计算价格*/
	countpri(){
		/*let heji=0
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
					console.log(zj)
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
		})*/
	},
	//取消订单
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
									// var pages=[1,1,1,1,1]
									// var goods=[ [],[],[],[],[], ]
									// that.setData({
									// 	pages:pages,
									// 	goods:goods
									// })
									// that.getOrderList()
									wx.navigateBack()
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
	//去评论
	gopinlun(e){
		wx.navigateTo({
			url:'/pages/fabiaopl/fabiaopl?oid='+e.currentTarget.dataset.oid
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
							that.setData({
								btnkg:0
							})
							console.log(res.data)
							if(res.data.code==1){
								wx.showToast({
									title: '收货成功',
									duration: 1000
								});
								setTimeout(function(){
								// 	var pages=[1,1,1,1,1]
								// 	var goods=[ [],[],[],[],[], ]
								// 	that.setData({
								// 		pages:pages,
								// 		goods:goods
								// 	})
								// 	that.getOrderList()
								wx.navigateBack()
								},1000)
							}else{
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
	//获取订单详情
	getOrderList(id){
		// const pageState1 = pageState.default(this)
		// pageState1.loading()    // 切换为loading状态
		
		let that = this
		//http://water5100.800123456.top/WebService.asmx/order
		wx.request({
			url:  app.IPurl+'/api/order/1',
			data:{
				order_id:id,
				token:wx.getStorageSync('token')
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'get',
			success(res) {
				// console.log(res.data)
				
				if(res.data.code==1){
						
						let resultd=res.data
						console.log(res.data)
						// console.log(resultd.info.delivery_code)
						// that.data.spimg = that.data.spimg.concat(imgb)
						that.setData({
							Odata:resultd.data,
							htmlReset:0
						})
						wx.setNavigationBarTitle({
							title:'订单详情'
						})
				}else{
					wx.showToast({
						icon:'none',
						title:'获取失败'
					})
					console.log(res.data)
					that.setData({
						htmlReset:1
					})
				}
				// pageState1.finish()    // 切换为finish状态
			},
			fail(err) {
				 wx.showToast({
				 	icon:'none',
				 	title:'获取失败'
				 })
				 that.setData({
				 	htmlReset:1
				 })
				 console.log(err)
			}
		})
	},
	//阶梯价
	ladderpri(idx,num){
		
		let that = this
		let ygnum=that.data.goods.list[idx].havenum  //已购
		// let ygnum=0  //已购
		let jt=that.data.goods.list[idx].pricelist  //规则
		let nownum=that.data.goods.list[idx].order_product.goods_count//本次购买数量
		
		
		if(num){
			nownum=num
		}
		// let numz=ygnum+nownum
		let nownum1 //定义临时变量
		let numlen //定义单个阶梯的限购数量
		let jtlist=[]        //阶梯列表
		let jtnum=[]         //阶梯数量
		let jtTotal=[]         //阶梯总价
		let numladd=[]      //阶梯的区间
		let priladd=[]      //阶梯的价格
		let Totalpri=0
		let laddermsg=[]
		for(let i in jt){
			let lownum=jt[i].lower_num
			let upnum=jt[i].upper_num
			let bpri=jt[i].price
			// console.log(lownum)
			// console.log(upnum)
			
			let jtzsy=jt[i].limit_num-jt[i].saled_num //阶梯限购的剩余
			if(lownum-1<=ygnum&&ygnum<upnum){ //根据已购获取开始阶梯
	         
				let item1
				item1=upnum-ygnum        //n1阶梯限售剩余
				
				if(jtzsy<item1){
					item1=jtzsy
				}
				if(item1==0){
					continue   //售罄
				}
				if(nownum<=item1){         //限售剩余足够
					// Totalpri +=100*bpri*nownum/100
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':nownum,
						'priladd':bpri,
						'jtTotal':100*bpri*nownum/100
					}
					laddermsg.push(ladderOne)
					break;   //结束
				}else{                   //限售剩余不足
					nownum1=nownum-item1
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':item1,
						'priladd':bpri,
						'jtTotal':100*bpri*item1/100
					}
					// Totalpri +=100*bpri*item1/100
					laddermsg.push(ladderOne)
				}
			}
			if(ygnum<lownum){   //后续阶梯（最小值大于已购）
				numlen=upnum-lownum+1   //当前阶梯的限购数量
				if(jtzsy<numlen){
					numlen=jtzsy
				}
				if(numlen==0){
					continue   //售罄
				}
				if(nownum1<=numlen){  //限售剩余足够
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':nownum1,
						'priladd':bpri,
						'jtTotal':100*bpri*nownum1/100
					}
					// Totalpri +=100*bpri*nownum1/100
					laddermsg.push(ladderOne)
					break;   //结束
				}else{                   //限售剩余不足
					nownum1=nownum1-numlen
	
					let ladderOne={
						'numladd':lownum+'-'+upnum,
						'jtnum':numlen,
						'priladd':bpri,
						'jtTotal':100*bpri*numlen/100
					}
					// Totalpri +=100*bpri*numlen/100
					laddermsg.push(ladderOne)
				}
			}
		}
	
		let laddermsgs={
			'laddermsg':laddermsg,
			'Totalpri':Totalpri
		}
		console.log(laddermsgs)
		return laddermsgs
	},
	opengoods(e){
		 let id = e.currentTarget.dataset.id
		app.opengoods(id)
	},
	
	ewm(code){
		qrcode = new QRCode('canvas', {
			usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
			text: code,
			// image: '/images/bg.jpg',
			width: qrcodeWidth,
			height: qrcodeWidth,
			colorDark: "#000",
			colorLight: "white",
			correctLevel: QRCode.CorrectLevel.H,
		});
	},
	pay(){
		if(that.data.btnkg==1){
			return
		}else{
			that.setData({
				btnkg:1
			})
		}
		var that =this
		app.Pay(that.data.order_id,'info')
	},
	onRetry(){
		this.onLoad()
	}
})
