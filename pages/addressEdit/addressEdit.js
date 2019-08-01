//logs.js
const app = getApp()

Page({
  data: {
    region: [],
		moren:false,
		editaddress:{
			name: "aaa", 
			tel: "18300000000", 
			address: "北京市北京市东城区", 
			xxaddress: "街道街道街道", 
			moren: "true"}
  },
  onLoad: function (option) {
    if(option.address){
			console.log(option.address)
		}
		this.setData({
			editaddress:JSON.parse(option.address)
		})
		var area=this.data.editaddress.area.split(' ')
		this.data.region=area
		this.setData({
			region:this.data.region
		})
		console.log(this.data.region)
  },
	//选择地区
	bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
		this.data.region=e.detail.value
    this.setData({
      region: this.data.region
    })
  },
	//设置默认
	switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
		this.setData({
			moren:e.detail.value
		})
  },
	//提交表单
	formSubmit(e) {
    let that =this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		let formresult=e.detail.value
		if (formresult.name=='') {
			wx.showToast({
				title: '收货人姓名不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (!(/^1\d{10}$/.test(formresult.tel))) {
			wx.showToast({
				title: '手机号码有误',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (formresult.address=='') {
			wx.showToast({
				title: '请选择地区',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (formresult.xxaddress=='') {
			wx.showToast({
				title: '请填写详情地址',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		wx.request({
			url: app.IPurl+'/api/userAddress/'+that.data.editaddress.id,
			data:  {
					
					token:wx.getStorageSync('token'),
					area:that.data.region[0]+''+that.data.region[1]+''+that.data.region[2], 
					address:formresult.xxaddress,
					user_name: formresult.name,
					phone:formresult.tel,
					is_default:formresult.moren ? 1:0
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'POST',
			success(res) {
				console.log(res.data)
				if(res.data.code==1){
					wx.showToast({
						title:'操作成功'
					})
					setTimeout(function(){
						wx.navigateBack()
					},1000)
				}else{
					wx.showToast({
						icon:'none',
						title:res.data.msg
					})
				}
			},
			fail(){
				wx.showToast({
					icon:'none',
					title:res.data.msg
				})
			}
		})
  }
	
})
