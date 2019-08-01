//myaddress.js
var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
		addresslist:[
			{name:'问心',mobile:'18000000000',province:'某省',city:'某市',county:'某区',address:'详细地址',user_member_shopping_address_id:'1'},
			{name:'问心',mobile:'18000000000',province:'某省',city:'某市',county:'某区',address:'详细地址',user_member_shopping_address_id:'1'},
			{name:'问心',mobile:'18000000000',province:'某省',city:'某市',county:'某区',address:'详细地址',user_member_shopping_address_id:'1'},
		],
    mridx:0
  },
  onLoad: function (option) {
  
  },
	onShow(){
		this.getaddlist()
	},
	selecmr(e){
		let that =this
		console.log(e.currentTarget.dataset.id)
		let id=e.currentTarget.dataset.id
		wx.request({
			url:  app.IPurl+'/api/userAddressDefaultStatus/'+id,
			data:  {
				token:wx.getStorageSync('token')
		  },
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'put',
			success(res) {
				console.log(res.data)
				
				if(res.data.code==1){
					that.getaddlist()
				}
			}
		})
	},
	addressEdit(e){
		
		console.log(e.currentTarget.dataset.id)
		let address=this.data.addresslist[e.currentTarget.dataset.id]
		 address=JSON.stringify(address)
		wx.navigateTo({
			url:'/pages/addressEdit/addressEdit?address='+address
		})
	},
	addressDel(e){
		let that =this
		console.log(e.currentTarget.dataset.id)
		let id=e.currentTarget.dataset.id
		wx.showModal({
			content:"确定要删除改地址吗?",
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
					wx.request({
						url:  app.IPurl+'/api/userAddress/'+e.currentTarget.dataset.id,
						data:  {
								token:wx.getStorageSync('token')
					    },
						header: {
							'content-type': 'application/x-www-form-urlencoded' 
						},
						dataType:'json',
						method:'DELETE',
						success(res) {
							console.log(res.data)
							
							if(res.data.code==1){
								wx.showToast({
									title:'操作成功'
								})
								setTimeout(function(){
									that.getaddlist()
								},1000)
							}
						}
					})
					
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	getaddlist(){
		const pageState1 = pageState.default(this)
		pageState1.loading()    // 切换为loading状态
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
				pageState1.finish()    // 切换为finish状态
					// pageState1.error()    // 切换为error状态
			},
			fail() {
				 pageState1.error()    // 切换为error状态
			}
		})
	},
	onRetry(){
		this.getaddlist()
	}
})
