define([
    'L',
], function (L) {
    'use strict';
    return class {
        constructor(url, options = {}) {
            this.url = url || 'http://ditagis.com:8080/geoserver/postgres/wms';
        }
        getRequestUrl(params) {
            return this.url + L.Util.getParamString(params, this.url, true);
        }
        // Create the XHR object.
        createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();

            if ("withCredentials" in xhr) {
                // XHR for Chrome/Firefox/Opera/Safari.
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
                // XDomainRequest for IE.
                xhr = new XDomainRequest();
                xhr.open(method, url);

            } else {
                // CORS not supported.
                xhr = null;
            }
            return xhr;
        }

        // Helper method to parse the title tag from the response.
        getTitle(text) {
            return text.match('<title>(.*)?</title>')[1];
        }

        // Make the actual CORS request.
        makeCorsRequest(url) {
            return new Promise((resolve, reject) => {


                // This is a sample server that supports CORS.
                var xhr = this.createCORSRequest('GET', url);
                if (!xhr) {
                    alert('CORS not supported');
                    return;
                }

                // Response handlers.
                xhr.onload = (params) => {
                    var response = xhr.responseText;
                    if (response) {
                        try {
                            var jsondata = JSON.parse(response);
                            resolve(jsondata);
                        } catch (error) {
                            console.log(error);
                            reject(response);
                        }
                    } else {
                        reject("Không tìm thấy dữ liệu hoặc không thể chuyển dữ liệu sang JSON");
                    }
                };

                xhr.onerror = function () {
                    reject('error');
                };

                xhr.send();
            });
        }
        getFeatures(url) {
            return new Promise((resolve, reject) => {
                this.makeCorsRequest(url).then((data) => {
                    resolve(data)
                }).catch((err) => {
                    //         reject(error)
                })
            });

        }
        execute(query = {}) {
            return new Promise((resolve, reject) => {
                // query.layerName = this.layerName;//gán layer
                const url = this.getRequestUrl(query.params);
                this.getFeatures(url).then((res) => {

                    //kiểm tra xem có where?
                    //nếu có thì lọc dữ liệu theo where
                    if (query.where) {
                        let filtered = this.filterData(query, res.features);
                        resolve(filtered);
                    } else {
                        resolve(res.features);
                    }

                }).catch(((err) => {
                    reject(err)
                }))
            });
        }
        filterData(query, features) {
            let filtered = [];
            for (let feature of features) {
                const properties = feature.properties;
                for (let w of query.where) {
                    const value1 = w.value1,
                        value2 = w.value2,
                        operator = w.operator;
                    switch (operator) {
                        case '=':
                            if (properties[value1] == value2)
                                filtered.push(feature);
                            break;

                        case '>':
                            if (properties[value1] >= value2)
                                filtered.push(feature);
                            break;
                        case '<':
                            if (properties[value1] <= value2)
                                filtered.push(feature);
                            break;
                        case '>=':
                            if (properties[value1] >= value2)
                                filtered.push(feature);
                            break;
                        case '<=':
                            if (properties[value1] <= value2)
                                filtered.push(feature);
                            break;
                        default:
                            break;
                    }
                }
            }
            return filtered;
        }
    }
});