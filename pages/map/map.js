Page({
  data: {
    subkey:"EPOBZ-DA7W5-JMQIB-QFR3T-AY3TE-HVB74",
    markers: [],
    polyline: [{
      points: [],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: './resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  onReady(){
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
  moveToLocation() {
    // 移动 到当前为止
    this.mapCtx.moveToLocation()
  },
  getCenterLocation(){
    this.mapCtx.getCenterLocation({
      success(res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
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
  regionchange(e) {
    const that = this
    this.mapCtx.getCenterLocation({
      success(res) {
        that.getbmapplace(res.longitude, res.latitude)
        that.setData({
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#FF0000DD',
            fillColor: '#d1edff88',
            radius: 50,//定位点半径
            strokeWidth: 1
          }]
        })
      }
    })
  },
  getbmapplace(longitude, latitude){
    console.log("longitude")
    console.log(longitude)
    console.log(latitude)
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/', //url
        data: {
          key:this.data.subkey, // 秘钥
          location:latitude+","+longitude
        },
        success: function (res) {
          console.log(res)
        },
        fail: function () {
         
        },
        complete: function () {
          // complete 
        }
      })
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  bindtap(e){
    
  },
  bindpoitap(e){
    console.log("bindpoitap")
    console.log(e)
  }
})