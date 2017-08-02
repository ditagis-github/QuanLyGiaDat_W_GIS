define([
    'L',
    'jquery'
], function (L, $) {
    'use strict';
    return class {
        constructor(options = {}) {
            this.defaultParams= {
                    service: 'WFS',
                    request: 'GetFeature',
                    version: '1.0.0',
                    outputFormat: 'json',
                    srsName: 'EPSG:4326',
                }
            this.options = {
                
            }
            for (let i in options) {
                if (i == 'params') {
                    this.params = options.params;
                }
                else if (i == 'outFields') {
                    this.outFields = options.outFields;
                }
                else {

                    this.options[i] = options[i] || this.options[i];
                }
            }
        }
        set typeName(val){
            this.params.typeName = val;
        }
        get where(){
            return this.options.where;
        }
        set where(value){
            this.options.where = value;
        }
        get params(){
            return this.options.params;
        }
        set params(value){
            for(let i in this.defaultParams) {
                value[i] = value[i] || this.defaultParams[i];
            }
            this.options.params=value;

        }
        set layerName(value) {
            this.params.typeNames = value;
        }
        get layerName(){
            return this.params.typeNames;
        }
        set outFields(value) {
            this.options.outFields = value;
            if (value.length > 0) {
                let hasAll = false;
                for (let field of value) {
                    if (field === '*') {
                        hasAll = true;
                        break;
                    }
                }
                //neu nhu khong co '*'
                if (!hasAll) {
                    let outfields = value.join(',');
                    this.params.propertyName = outfields;
                }
            }
        }
        get outFields() {
            return this.options.outFields;
        }
    }
});