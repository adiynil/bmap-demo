import wuchuan from './source.json'
import townArray from './town.json'
import styleJson from './map_style.json'
import './index.scss'
let map
createMap()
setMap()
addTownOverlay()
addTownMarker()
function createMap() {
  map = new BMapGL.Map('app')
  let point = new BMapGL.Point(110.73824, 21.44182)
  map.centerAndZoom(point, 13)
  map.enableScrollWheelZoom(true)
}
function setMap() {
  map.setMapStyleV2({
    styleJson
    // styleId: 'd539bc2fec403fe81c9813d95c652064'
  })
}
function addTownOverlay() {
  wuchuan.forEach(town => {
    for (let i = 0; i < town.geometry.length; i++) {
      const ply = new BMapGL.Polygon(town.geometry[i], {
        strokeWeight: 1,
        strokeColor: '#00A1FF',
        fillColor: '#00A1FF',
        fillOpacity: 0.2
      })
      ply.addEventListener('mouseover', function (evt) {
        ply.setFillOpacity(0.4)
        ply.setStrokeWeight(2)
      })
      ply.addEventListener('mouseout', function (evt) {
        ply.setFillOpacity(0.2)
        ply.setStrokeWeight(1)
      })
      map.addOverlay(ply)
    }
  })
}
function addTownMarker() {
  const pointArray = []
  const labelArray = []
  for (let i = 0; i < townArray.length; i++) {
    pointArray.push(new BMapGL.Point(townArray[i].lng, townArray[i].lat))
    labelArray[i] = new BMapGL.Label(
      `<div class='label-container'>
        <span class='town-name'>${townArray[i].name}</span>
        <span class='school-number'>35</span>
      </div>`,
      { position: pointArray[i] }
    )
    labelArray[i].setStyle({
      color: '#d7d9db',
      backgroundColor: 'transparent',
      border: 'none'
    })
    // 城镇点
    const dataList = [
      '板桥中学',
      '黄坡镇平城中学',
      '林屋中学',
      '塘尾中学',
      '吴阳中学',
      '漳浦中学',
      '振文中学',
      '城东中学',
      '兰石中学'
    ]
    const pl = new BMapGL.Label('板桥中学', {
      position: new BMapGL.Point(110.560233, 21.453652)
    })
    pl.setStyle({
      color: '#fff',
      fontSize: '16px',
      fontWeight: 400,
      backgroundColor: 'transparent',
      border: 'none'
    })
    map.addEventListener('zoomend', () => {
      if (map.getZoom() >= 14) {
        map.addOverlay(pl)
      } else {
        map.removeOverlay(pl)
      }
    })
    const poperDom = document.createElement('div')
    poperDom.setAttribute('class', 'poper_content')
    const ul1 = document.createElement('ul')
    for (let i = 0; i < dataList.length; i++) {
      const item = dataList[i]
      const el = document.createElement('li')
      if (item == '板桥中学')
        el.addEventListener('click', () => {
          let p = new BMapGL.Point(110.560233, 21.453652)
          map.centerAndZoom(p, 15)
        })
      el.innerHTML = item
      ul1.appendChild(el)
    }
    poperDom.appendChild(ul1)
    poperDom.appendChild(document.createElement('ul'))
    const infowindow = new BMapGL.InfoWindow(poperDom, {
      offset: new BMapGL.Size(0, 120),
      enableCloseOnClick: true,
      enableAutoPan: true
    })
    labelArray[i].addEventListener('mouseover', params => {
      // let clientWidth = document.body.clientWidth
      // let clientHeight = document.body.clientHeight
      // let [x, y] = [0, 0],
      //   { clientX, clientY } = params,
      //   [poperWidth, poperHeight] = [180, 230],
      //   offset = 200
      // if (clientWidth - clientX < poperWidth + offset)
      //   x = -(poperWidth + offset - clientWidth + clientX)
      // if (clientHeight - clientY < poperHeight + offset)
      //   y = -(poperHeight + offset - clientHeight + clientY)
      // map.panBy(x, y)
      map.openInfoWindow(infowindow, pointArray[i])
      const iw_pop = document.getElementsByClassName('BMap_bubble_pop')[0]
      const iw_top = document.getElementsByClassName('BMap_bubble_top')[0]
      const iw_bottom = document.getElementsByClassName('BMap_bubble_bottom')[0]
      iw_top && iw_top.setAttribute('style', 'display:none')
      iw_bottom && iw_bottom.setAttribute('style', 'display:none')
      iw_pop.lastChild.setAttribute('style', 'display:none')
    })
    labelArray[i].addEventListener('mouseout', params => {
      // console.log(params)
    })
    map.addOverlay(labelArray[i])
  }
}
