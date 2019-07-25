
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            geometryProjector.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 06/07/2019.
//                   Vasilis Vlastaras (@gisvlasta), 25/07/2019.
//                   Re-engineered to allow flexibility in accepting 'from' and 'to'
//                   projections.
// ================================================================================

// Module Dependencies.
const proj4 = require('proj4');
const jsts = require('jsts');
const projections = require('../models/projections');

/**
 * Projects a coordinate from The 'fromProjection' to the 'toProjection'.
 */
const GeometryProjector = {

  /**
   * Projects the specified 2 dimensional coordinate from the 'fromProjection' to the 'toProjection' and
   * returns the projected coordinate.
   *
   * @param coordinate2D - The array holding the coordinates to project.
   * @param fromProjection - The name of the 'from' projection.
   * @param toProjection - The name of the 'to' projection.
   * @returns {Array.<number>}
   */
  projectCoordinate2D: function(coordinate2D, fromProjection, toProjection) {

    return proj4(
      projections[fromProjection],
      projections[toProjection],
      [coordinate2D[0], coordinate2D[1]]
    );

  },

  /**
   * Projects the specified coordinate from the 'fromProjection' to the 'toProjection' and
   * returns the projected jsts.geom.Coordinate.
   *
   * @param coordinate - The jsts.geom.Coordinate to project.
   * @param fromProjection - The name of the 'from' projection.
   * @param toProjection - The name of the 'to' projection.
   * @returns {jsts.geom.Coordinate}
   */
  projectCoordinate: function(coordinate, fromProjection, toProjection) {

    let coord = proj4(
      projections[fromProjection],
      projections[toProjection],
      [coordinate.x, coordinate.y]
    );

    let projectedCoordinate = coordinate.clone();

    projectedCoordinate.x = coord[0];
    projectedCoordinate.y = coord[1];

    return projectedCoordinate;

  },

  /**
   * Projects the specified point from the 'fromProjection' to the 'toProjection' and
   * returns the projected jsts.geom.Point
   *
   * @param point - The specified point having the 'from' projection.
   * @param fromProjection - The name of the 'from' projection.
   * @param toProjection - The name of the 'to' projection.
   * @returns {jsts.geom.Point}
   */
  projectPoint: function(point, fromProjection, toProjection) {

    let geoJsonReader = new jsts.io.GeoJSONReader();

    let coords = proj4(
      projections[fromProjection],
      projections[toProjection],
      [point.getX(), point.getY()]
    );

    let projectedPoint = {
      type: "Point",
      coordinates: coords
    };

    return geoJsonReader.read(projectedPoint);

  },

  /**
   * Projects the specified GeoJSON Polygon from the 'fromProjection' to the 'toProjection' and
   * returns the projected jsts.geom.Polygon
   *
   * @param geoJsonPolygon - The specified polygon having the 'from' projection. This is a single shell polygon.
   * @param fromProjection - The name of the 'from' projection.
   * @param toProjection - The name of the 'to' projection.
   * @returns {jsts.geom.Polygon}
   */
  projectSingleShellPolygon: function(geoJsonPolygon, fromProjection, toProjection) {

    let geoJsonReader = new jsts.io.GeoJSONReader();

    let polygonCoordinates = geoJsonPolygon.coordinates[0];
    let projectedPolygonCoordinates = [];

    for (i = 0; i < polygonCoordinates.length; i++) {
      projectedPolygonCoordinates.push(
        GeometryProjector.projectCoordinate2D(polygonCoordinates[i], fromProjection, toProjection )
      );
    }

    let projectedGeoJsonPolygon = {
      type: "Polygon",
      coordinates: [projectedPolygonCoordinates]
    };

    return geoJsonReader.read(projectedGeoJsonPolygon);

  }

};

module.exports = GeometryProjector;
