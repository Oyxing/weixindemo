Page({
  data: {
    poisbomid:"init",
    animationData:{},
    // 第几页
    page_index:1,
    // 纬度
    latitude: 23.10229,
    // 经度
    longitude: 113.3345211,
    oldlongitude : "",
    oldlatitude: "",
    //rect.bottom
    rectbottom:"",
    //rect.height
    rectheight:"",
    // 当前位置 省份
    address_component:{},
    // 附近位置
    pois:[],
    // 格式化的位置
    formatted_addresses:{},
    //地图top
    maptop:"0px",
    controlsimgtop:"",
    poistop:"",
    boolmarkers:true,
    subkey:"EPOBZ-DA7W5-JMQIB-QFR3T-AY3TE-HVB74",
    markers: [],
    polyline: [{
      points: [],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
    }],
    controls: []
  },
  onReady(){
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.poisarr = []
    this.mapCtx = wx.createMapContext('myMap')
    this.getcontrols()
    this.controltap()
  },
  includePoints(){
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },
  getLocation(){
    const that = this
    this.mapCtx.getCenterLocation({
      success(res) {
        if (that.data.oldlongitude != res.longitude && that.data.oldlatitude != res.latitude) {
            that.setData({
              poisbomid:"init",
              latitude: res.latitude,
              longitude: res.longitude,
              oldlongitude: res.longitude,
              oldlatitude: res.latitude,
              page_index: 1,
              markers: [],
            })
            that.getbmapplace(res.longitude, res.latitude, 1)
            setTimeout(() => {
              that.animation.translateY(-30).step().translateY(0).step()
              that.setData({
                animationData: that.animation.export()
              })
            }, 500)
        }
      }
    })
  },
  regionchange(e) {
    if (e.type == 'end') {
        this.poisarr = []
      if (this.data.boolmarkers) {
            this.setData({
                poisbomid: "init",
                markers: [],
              })
              setTimeout(() => {
                this.animation.translateY(-30).step().translateY(0).step()
                this.setData({
                  animationData: this.animation.export()
                })
              }, 500)
              this.getLocation()
        } else {
            setTimeout(() => {
              this.setData({
                boolmarkers: true
              })
            }, 1000)
        }
    } 
  },
  getbmapplace(longitude, latitude, page_index){
    const seft = this
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
          key:this.data.subkey, // 秘钥
          location:latitude+","+longitude,
          get_poi:1,
          poi_options: 'radius=5000;page_size=20;page_index=' + page_index,
        },
        success: function (res) {
          for (var key in res.data.result.pois){
            seft.poisarr.push(res.data.result.pois[key])
          }
          var formatted_addresses = {}
          formatted_addresses["recommend"] = res.data.result.formatted_addresses.recommend
          formatted_addresses["rough"] = res.data.result.formatted_addresses.rough
          formatted_addresses["location"] = res.data.result.location 
          seft.setData({
            formatted_addresses: formatted_addresses,
            address_component: res.data.result.address_component,
            pois: seft.poisarr
          })
        },
        fail: function () {
         
        },
        complete: function () {
          // complete 
        }
      })
  },
  getcontrols(){
    // 获取 节点
    var query = wx.createSelectorQuery();
      const seft = this
      query.select('#myMap').boundingClientRect(function (rect) {
        console.log("rect")
        console.log(rect)
        seft.setData({
          controlsimgtop: rect.height/2 - 32,
          rectheight: rect.height,
          rectbottom: rect.bottom,
          poistop: rect.bottom + "px",
          controls: [{
            id: 1,
            iconPath: './images/position.png',
            position: {
              left: rect.width - 40,
              top: rect.height - 40,
              width: 30,
              height: 30
            },
            clickable: true
          }]
        })
      }).exec();
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    this.mapCtx.moveToLocation()
  },
  // 滚动到低部
  bindscrolltolower(e){
    // 纬度
    const latitude = this.data.latitude
    // 经度
    const longitude = this.data.longitude
    this.getbmapplace(longitude, latitude, this.data.page_index++)
  },
  // 点击触发
  mapbindtap(){
    this.animation.translateY(0).step()
    this.setData({
      boolmarkers: true,
      animationData: this.animation.export()
    })
  
  },
  // 滚动时触发
  bindscroll(e){
    if (e.detail.scrollTop > 10){
      this.setData({
        maptop: "-60px",
        poistop: this.data.rectbottom - 60 + "px",
        controlsimgtop: this.data.rectheight / 2 - 32 -60,
      })
    }else{
      this.setData({
        maptop: "0px",
        poistop: this.data.rectbottom + "px",
        controlsimgtop: this.data.rectheight / 2 - 32,
      })
    }
  },
  poitap(e){
    console.log(e)
  },
  bindpois(e){
      this.setData({
        boolmarkers : false,
        markers: [
          {
            iconPath: "./images/place.png",
            id: 0,
            latitude: "",
            longitude: "",
            width: 32,
            height: 32,
          }, {
            iconPath: "./images/identifying.png",
            id: 1,
            latitude: "",
            longitude: "",
            width: 16,
            height: 16,
            anchor: { x: .5, y: .5 }
          }],
        poisbomid: e.currentTarget.dataset.index
      })
      const item =  e.currentTarget.dataset.item
      const location = item.location
      this.updatamarkers1(location.lat, location.lng)
      this.updatamarkers0(location.lat, location.lng)
  },
  updatamarkers0(lat, lng) {
    const seft = this
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: false,
      duration: 1000,
      destination: {
        latitude: lat,
        longitude: lng,
      },
      animationEnd() {
      }
    })
  },
  updatamarkers1(lat, lng) {
    const seft = this
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: false,
      duration: 20,
      destination: {
        latitude: lat,
        longitude: lng,
      },
      animationEnd() {
        seft.setData({
          latitude: lat,
          longitude: lng,
        })
      }
    })
  },
  handletouchmove(e){
    console.log("e")
    console.log(e)
  }
})