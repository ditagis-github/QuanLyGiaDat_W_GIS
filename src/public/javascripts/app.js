var isMobile = false; //initiate as false
require.config({
  // define paths to where all of our dependencies live
  paths: {
    use: "use"
  },
  map: {
    '*': {
      'css': 'lib/css.min', // or whatever the path to require-css is
      'L': 'ditagis/leaflet-src'
    }
  }
});

require([
  'L',
  'mapconfig',
  'ditagis/Layer/WMS',
  'ditagis/Control/Locate',
  'ditagis/Control/Loading',
  'ditagis/Control/WaterMark',
  'ditagis/Control/LayerList',
  'ditagis/Control/Legend',
  'ditagis/Control/TypeMap',
  'ditagis/Control/Search',
  "ditagis/support/QueryTask",
  "ditagis/Control/SearchBox",
  'css!styles/leaflet.css',
  'css!styles/map.css'
], function (L, mapconfig, BetterWms, Locate, Loading, Watermark, LayerList, Legend, TypeMap, Search, QueryTask,
  SearchBox) {
  
  // device detection
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;
  var map = new L.Map(mapconfig.map.div, mapconfig.map.options);

  L.Map.prototype.getLayer = function (id) {
    return this.getWmsLayer(id) || this.getBasemap(id);
  }

  L.Map.prototype.getWmsLayer = function (id) {
    for (let layer of this.layers) {
      if (layer.id === id)
        return layer;
    }
  }

  L.Map.prototype.getBasemap = function (id) {
    for (let bm of this.basemaps) {
      if (bm.id === id)
        return bm;
    }
  }


  const initBasemap = () => {
    let bases = [],
      layerGroup = L.layerGroup();
    for (let bm of mapconfig.basemaps) {
      let bmwms = BetterWms(bm.url, bm.options);
      if (bm.visible) {
        layerGroup.addLayer(bmwms);
        // bmwms.addTo(map)
      }
      bmwms.id = bm.id;
      bases.push(bmwms);
      bases['binhduong'] = layerGroup;
    }
    var satellite = L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        transparent: true,
        format: 'image/png',
        layers: 'satellite'
      });
    var satelliteLabel = L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        transparent: true,
        format: 'image/png',
        layers: 'satellite'
      });
    satellite.id = 'satellite'

    satellite.on('add remove', (evt) => {
      const type = evt.type;
      if (type === 'add') {
        satelliteLabel.addTo(map);
        satellite.bringToBack(); //chuyển nó xuống tầng dưới, tại vì nó là basemap
        //set độ mờ cho layer là 0.7
        if (map.layers)
          map.layers.map((layer) => layer.setOpacity(0.7));
      } else {
        map.removeLayer(satelliteLabel);
        if (map.layers)
          map.layers.map((layer) => layer.setOpacity(1));
      }
    })
    bases.push(satellite);
    map.basemaps = bases;
    map.basemap = layerGroup;
    layerGroup.addTo(map);
  }

  const initLayers = () => {
    let layersCf = mapconfig.layers,
      layers = []; //lưu lại để trả về kết quả
    for (let layer of layersCf) {
      let wms = BetterWms(layer.url, layer.options);
      if (layer.visible)
        wms.addTo(map);
      layers.push(wms);
    }
    map.layers = layers;

  }
  map.on('locationfound', function (e) {
    let thuaDatLayer = map.getLayer('thuadat');
    thuaDatLayer.getFeatureInfo(L.latLng(10.938131705050612, 106.71037942171098));
  });

  function initControl() {
    /**
     * WIDGET
     */

    /////TOP-LEFT
    var position = 'topleft';

    SearchBox({
      position: position,
    }).addTo(map);


    /////END TOP-LEFT





    /**
     * TOP - RIGHT
     */
    var position = 'topright';

    ///// Add the geolocate control to the map

    //add loading
    Loading({
      position: position
    }).addTo(map);
    /////layers de base
    var layerOverview = {};
    for (let index in map.layers) {
      const layer = map.layers[index];
      layerOverview[layer.options.name] = layer;
    }
    Locate({
      position: position
    }).addTo(map);
    LayerList(layerOverview, {
      "Dữ liệu nền Bình dương": map.basemap,
      //"Bản đồ": OpenStreetMap,
      "Dữ liệu Vệ tinh": map.getBasemap('satellite')
    }, {
      position: position
    }).addTo(map);



    /**
     * END TOP-RIGHT
     */

    /**
     * BOTTOM-RIGHT
     */
    var position = 'bottomright';

    TypeMap(map.layers, {
      position: position
    }).addTo(map);

    /**
     * END BOTTOM-RIGHT
     */
    /**
     * BOTTOM - LEFT
     */
    var position = 'bottomleft';

    ///// Add legend control to the map
    Legend({
      position: position
    }).addTo(map);

    /**
     * BOTTOM - CENTER
     */
    var position = 'bottomcenter';
    //add Logo
    if(!isMobile)
    Watermark({
      position: position,
      src: '/images/logo-dtg.png'
    }).addTo(map);
  }

  initBasemap();
  initLayers();

  initControl();

  Loader.hide();

});