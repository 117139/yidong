//car.js
// var pageState = require('../../utils/pageState/index.js')
const app = getApp()

Page({
  data: {
    btnkg: 0,     //0  ok       1 off
    htmlReset: 0,
    goods: [],
    spimg: [],
    goods_sele: [],
    xuan: false,
    all: false,
    sum: '0.00'
  },
  onLoad: function () {

  },
  onShow() {
    wx.setNavigationBarTitle({
      title: '加载中...'
    })
    var that = this
    that.getcar()


  },
  cload() {
    var that = this
    that.getcar()
  },
  onReady() {

  },
  onfocus() {
    return false;
  },
  select(e) {
    let that = this
    // console.log(e.currentTarget.dataset.selec)
    let sid = e.currentTarget.dataset.selec
    // console.log(this.data.goods_sele[sid].xuan)
    if (that.data.goods_sele[sid].xuan == false) {
      that.data.goods_sele[sid].xuan = true
      that.setData({
        goods_sele: that.data.goods_sele
      });
    } else {
      that.data.goods_sele[sid].xuan = false
      that.setData({
        goods_sele: that.data.goods_sele
      });
    }
    let qx = true
    for (let i in that.data.goods_sele) {
      if (that.data.goods_sele[i].xuan == false) {
        qx = false
        break
      }
    }
    console.log(qx)
    //触发全选
    if (qx == true) {
      that.setData({
        all: true
      })
    } else {
      that.setData({
        all: false
      })
    }
    //计算总价
    that.countpri()
  },
  onChange(e) {
    console.log(e.currentTarget.dataset.selec)
    let idx = e.currentTarget.dataset.selec
    console.log(e.detail)
    this.data.goods_sele[idx].num = e.detail
    this.setData({
      goods_sele: this.data.goods_sele
    });
    //计算总价
    this.countpri()
    // console.log(that.goods_sele[1].laddermsgs.Totalpri)
  },
  selecAll() {
    let kg
    if (this.data.all == false) {
      kg = true
    } else {
      kg = false
    }
    this.setData({
      all: kg
    })
    // this.data.goods_sele[sid].xuan=true
    for (let i in this.data.goods_sele) {
      this.data.goods_sele[i].xuan = kg
    }
    this.setData({
      goods_sele: this.data.goods_sele
    });
    //计算总价
    this.countpri()
  },
  /*计算价格*/
  countpri() {
    let heji = 0
    let var2 = this.data.goods_sele
    for (let i in var2) {
      if (var2[i].xuan == true) {
        heji += var2[i].num * (var2[i].pri * 100)

      }
    }

    heji = (heji / 100).toFixed(0)

    this.setData({
      sum: heji
    })
  },
  openOrder() {
    // wx.navigateTo({
    // 	url:"/pages/Order/Order"
    // })
    let that = this
    let xuanG = that.data.goods_sele
    let idG = ''
    var xzarr = []
    for (let i in xuanG) {
      if (xuanG[i].xuan) {
        if (idG == '') {
          idG = xuanG[i].id

        } else {
          idG += ',' + xuanG[i].id
        }
        xzarr.push(that.data.goods[i])
      }

      // console.log(idG)
    }
    xzarr = JSON.stringify(xzarr)
    console.log(xzarr)
    console.log(idG)
    if (idG !== '') {
      app.openOrder(idG, xzarr, 1)
    }
  },
  //加减
  onNum(e) {
    let that = this
    console.log(e.currentTarget.dataset)
    let ad = e.currentTarget.dataset.ad
    let id = e.currentTarget.dataset.id
    let thisidx = e.currentTarget.dataset.idx

    if (that.data.goods_sele[thisidx].num < 2 && ad == '-') {
      console.log('禁止')
      return false;

    }
    //http://water5100.800123456.top/WebService.asmx/shopcar

    // return
    var jkurl
    if (ad == '-') {
      jkurl = '/api/shoppingGoodsNumDown/' + id
    } else {
      jkurl = '/api/shoppingGoodsNumUp/' + id
    }
    wx.request({
      url: app.IPurl + jkurl,
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'PUT',
      success(res) {
        // console.log(res.data)

        if (res.data.error == -2) {
          app.checktoken(res.data.error)
          that.onLoad()
        }
        if (res.data.code == 1) {
          let resultd = res.data
          console.log(res)
          console.log(resultd)
          if (ad == '-') {
            that.data.goods_sele[thisidx].num--
            that.data.goods[thisidx].num--
          } else {
            that.data.goods_sele[thisidx].num++
            that.data.goods[thisidx].num++
          }

          that.setData({
            goods_sele: that.data.goods_sele,
            goods: that.data.goods
          })
          console.log(thisidx)

          //计算总价
          that.countpri()
        }
      }
    })
  },
  //获取购物车
  getcar() {
    if (!wx.getStorageSync('token')){
      wx.setNavigationBarTitle({
        title: '购物车',
      })
      return
    }
    // const pageState1 = pageState.default(this)
    // pageState1.loading()    // 切换为loading状态
    let that = this
    wx.request({
      url: app.IPurl + '/api/shopping',
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'GET',
      success(res) {
        // console.log(res.data)
        if (res.data.code == 1) {
          let resultd = res.data.data
          // console.log(resultd)
          that.setData({
            goods: resultd,
            htmlReset: 0
          })

          //设置选中的数组
          let arra = []
          for (let i = 0; i < resultd.length; i++) {

            arra.push({
              xuan: false,
              id: resultd[i].id,
              pri: resultd[i].goods_real_price,
              num: resultd[i].num,
              order_cart_id: resultd[i].id
            })
          }
          that.setData({
            goods_sele: arra,
            all: false,
            sum: '0'
          })
          that.countpri()

        } else {
          wx.showToast({
            icon: 'none',
            title: '获取失败'
          })
          that.setData({
            htmlReset: 1
          })
          console.log(res.data)
        }
        // that.selecAll()
        // pageState1.finish()    // 切换为finish状态
      },
      fail(err) {
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })
        that.setData({
          htmlReset: 1
        })
        console.log(err)
        // pageState1.error()    // 切换为error状态
      },
      complete() {
        wx.setNavigationBarTitle({
          title: '购物车'
        })
      }
    })
  },
  opengoodsxq(e) {
    let id = e.currentTarget.dataset.gid
    app.opengoods(id)
  },
  jump(e) {
    app.jump(e)
  },
  cardel(e) {
    var that = this
    if (that.data.btnkg == 1) {
      return
    } else {
      that.setData({
        btnkg: 1
      })
    }
    let id = e.currentTarget.dataset.id
    wx.request({
      url: app.IPurl + '/api/shopping/' + id,
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'DELETE',
      success(res) {

        if (res.data.code == 1) {
          let resultd = res.data
          console.log(res)
          wx.showToast({
            icon: 'none',
            title: '删除成功'
          })
          setTimeout(function () {
            that.setData({
              btnkg: 0
            })
            that.getcar()
          }, 1000);
        } else {
          that.setData({
            btnkg: 0
          })
          if (res.data.msg) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '网络异常',
              duration: 2000,
              icon: 'none'
            });
          }
        }
      },
      fail() {
        that.setData({
          btnkg: 0
        })
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          duration: 2000,
          icon: 'none'
        });
      }
    })
  }
})