define([

], function () {
    'use strict';
    return class {
        static getLatlngPolygon(geometry) {
            const
                x = geometry.coordinates[0][0][1],
                y = geometry.coordinates[0][0][0];
            return [x, y];
        }
        static getLatlngPolyline(geometry) {
            const
                x = geometry.coordinates[0][0][1] || geometry.coordinates[0][1],
                y = geometry.coordinates[0][0][0] || geometry.coordinates[0][0];
            return [x, y];
        }
        static getLatlngCentroid(vertices) {
            var centroid = [0, 0];
            var signedArea = 0.0;
            var x0 = 0.0; // Current vertex X
            var y0 = 0.0; // Current vertex Y
            var x1 = 0.0; // Next vertex X
            var y1 = 0.0; // Next vertex Y
            var a = 0.0; // Partial signed area
            var i = 0;
            for (i = 0; i < vertices.length - 1; ++i) {
                x0 = vertices[i][1];
                y0 = vertices[i][0];
                x1 = vertices[i + 1][1];
                y1 = vertices[i + 1][0];
                a = x0 * y1 - x1 * y0;
                signedArea += a;
                centroid[0] += (x0 + x1) * a;
                centroid[1] += (y0 + y1) * a;
            }

            // Do last vertex separately to avoid performing an expensive
            // modulus operation in each iteration.
            x0 = vertices[i][1];
            y0 = vertices[i][0];
            x1 = vertices[0][1];
            y1 = vertices[0][0];
            a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroid[0] += (x0 + x1) * a;
            centroid[1] += (y0 + y1) * a;

            signedArea *= 0.5;
            centroid[0] /= (6.0 * signedArea);
            centroid[1] /= (6.0 * signedArea);
            return centroid;
        }


    }
});