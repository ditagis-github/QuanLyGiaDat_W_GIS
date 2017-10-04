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
      Watermark({
        position: position,
        src: 'images/logo-dtg.png'
      }).addTo(map);
    }

    initBasemap();
    initLayers();

    initControl();

    Loader.hide();

  });