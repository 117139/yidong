//logs.js
const app = getApp()

var WxParse = require('../../vendor/wxParse/wxParse.js')
Page({
  data: {
    
  },
  onLoad: function (option) {
    if(option.id){
			console.log(option.id)
		}
		this.aboutfwb()
  },
	aboutfwb(){
		var that=this
		wx.request({
			url:  app.IPurl+'/api/about',
			data:{},
			// header: {
			// 	'content-type': 'application/x-www-form-urlencoded'
			// },
			dataType:'json',
			method:'GET',
			success(res) {
				console.log(res.data)
				wx.hideLoading()
				
				if(res.data.code==1){
					
						let resultd=res.data.data
						if(resultd==null){
							wx.showToast({
								 icon:'none',
								 title:'暂无内容'
							})
							return
						}
						var article = resultd.content
						var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
						article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
						var subStr1 = new RegExp('<p><br/></p>', 'ig');
						article = article.replace(subStr1, "<text style='margin-bottom:1em;'></text>");
						WxParse.wxParse('article', 'html', article, that, 5);
					
				}else{
					wx.showToast({
						 icon:'none',
						 title:'操作失败'
					})
				}
				
				 
			},
			fail() {
				
				wx.showToast({
					 icon:'none',
					 title:'操作失败'
				})
			}
		})
		
	}
})
