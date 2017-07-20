require.config({
  // define paths to where all of our dependencies live
  paths: {


    'ditagis': 'ditagis',
    'jquery': "lib/jquery-1.10.2.min",
    'jquery-ui': "lib/jquery-ui.min",
    // 'jquery-form': 'lib/jquery.form.min',
    // 'bootstrap': "lib/bootstrap.min",
    use: "use"
  },
  use: {
    // bootstrap: {
    //   deps: ['jquery']
    // },
    // 'jquery-form': {
    //   deps: ['jquery']
    // }
  },
  map: {
    '*': {
      'css': 'lib/css.min', // or whatever the path to require-css is
      'L': 'ditagis/leaflet-src'
    }
  }
});

// require all dependencies, we still need to require our leaflet-heat and leaflet-markercluster modules so they load
require([
  'L',
  'mapconfig',
  // 'jquery',
  // "ditagis/lib/leaflet-google",
  'ditagis/Layer/WMS',
  'ditagis/Control/LayerList',
  'ditagis/Control/Legend',
  'ditagis/Control/TypeMap',
  "ditagis/support/Query",
  "ditagis/Util/geometryUtil",
  // "jquery-form",
  // "boostrap",
  'css!styles/leaflet.css',
  'css!styles/map.css',
  // 'css!styles/minimap.css'
], function (L, mapconfig, BetterWms, LayerList, Legend, TypeMap, Query,geometryUtil) {
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
  window.Map = {
    zoom: function (tenduong, tu, den) {
      return new Promise((resolve, reject) => {
        let query = new Query({
          params: {
            propertyName: 'tenconduon,tu,den'
          }
        });
        const layer = map.getLayer('timduong');
        layer.getFeatures(query).then((features) => {



          for (let feature of features) {
            const props = feature.properties,
              _tenduong = props.tenconduon,
              _tu = props.tu,
              _den = props.den;
            if (tenduong == _tenduong && tu == _tu && den == _den) {
              query.params = {
                featureId: feature.id
              }
              layer.getFeatures(query).then((features) => {
                const data = features[0], //vì query theo id nên chỉ duy nhất có một features được trả về
                  latlng = geometryUtil.getLatlngPolyline(data.geometry),
                  x = latlng[0],
                  y = latlng[1];
                //chuyen vi tri center cua map den x,y va zoom:18 voi hieu ung flyTo
                map.flyTo([x, y], 18);
                resolve(data);
              });
              break;
            }
          }
        })
      });
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
        layers: 'sateobjectllite'
      });
    satellite.id = 'satellite'
    satellite.on('add remove', (evt) => {
      const type = evt.type;
      if (type === 'add') {
        satellite.bringToBack(); //chuyển nó xuống tầng dưới, tại vì nó là basemap
        //set độ mờ cho layer là 0.7
        if (map.layers)
          map.layers.map((layer) => layer.setOpacity(0.7));
      } else {
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

  function initControl() {
    /**
     * WIDGET
     */

    /////TOP-LEFT
    var position = 'topleft';

    // SearchBox({
    //   position: position,
    // }).addTo(map);


    /////END TOP-LEFT





    /**
     * TOP - RIGHT
     */
    var position = 'topright';

    ///// Add the geolocate control to the map

    //add loading
    /////layers de base
    var layerOverview = {};
    for (let index in map.layers) {
      const layer = map.layers[index];
      layerOverview[layer.options.name] = layer;
    }
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
  }

  initBasemap();
  initLayers();

  initControl();
  Loader.hide();
});