/* global L */

// A layer control which provides for layer groupings.
// Author: Ishmael Smyrnow
define([
  'L',  'css!ditagis/Control/LayerList.css'
], function (L) {
  'use strict';
L.Control.LayerList = L.Control.Layers.extend({
	_initLayout: function () {

 L.Control.Layers.prototype._initLayout.call(this);
		L.DomUtil.create('i','fa fa-list',this._layersLink);

	},
   _addItem: function (obj) {
		var 
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'radio';
			input.name = 'leaflet-overlay-layers';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		input.layerId = stamp(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('label');

		// label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(holder);

		this._checkDisabledLayers();
		return input;
	}
});
function stamp(obj) {
	/*eslint-disable */
	obj._leaflet_id = obj._leaflet_id || ++lastId;
	return obj._leaflet_id;
	/*eslint-enable */
}
  return function (basemap, layers, options) {
    return new L.Control.LayerList(basemap,layers, options);
  }
});
