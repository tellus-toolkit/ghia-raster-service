
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            index.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 14/07/2019.
// ================================================================================

// Module Dependencies.
const jsts = require('jsts');
const config = require('../config');
//const errors = require('restify-errors');
const raster = require('../models/raster.js');
const rasterReader = require('../operations/rasterReader.js');
const rasterLocator = require('../operations/rasterLocator.js');
const geometryProjector = require('../operations/geometryProjector');

/**
 * Exports the routes of the server.
 *
 * @param server - The server object.
 */
module.exports = function(server) {

  /**
   * Gets the server name and version.
   * Uses the HTTP GET verb.
   *
   * @returns {JSON} - A JSON document with the server and version.
   */
  server.get('/', function(req, res, next) {

    let now = new Date().toISOString();
    console.log(now + ' GET: /ghia-raster-server' );

    res.send({
      'server': `${config.name}`,
      'version': `${config.version}`
    });

    return next();

  });

  /**
   * Gets the raster metadata.
   * Uses the HTTP GET verb.
   *
   * @returns {JSON} - A JSON document with raster metadata
   */
  server.get('/raster-metadata', function(req, res, next) {

    let now = new Date().toISOString();
    console.log(now + ' GET: /ghia-raster-server/raster-metadata' );

    // Get the band of the raster.
    let band = raster.getBand();

    // Get the statistics of the raster band.
    let statistics = band.getStatistics(false, true);

    let rasterMetadata = {
      cellSize: raster.getCellSize(),
      tileSize: raster.getTileSize(),
      minimumX: raster.getXmin(),
      minimumY: raster.getYmin(),
      columns: raster.getBandColumns(),
      rows:  raster.getBandRows(),
      band:{
        dataType: band.dataType,
        minimum: band.minimum,
        maximum: band.maximum,
        noDataValue: band.noDataValue,
        statistics: {
          minimum: statistics.min,
          maximum: statistics.max,
          average: statistics.mean,
          StandardDeviation: statistics.std_dev
        },
        lookup: raster.lookup,
        dictionary: raster.dictionary
      }
    };

    res.send(rasterMetadata);

    return next();

  });

  /**
   * Gets the report of the values of the raster based on a latitude, longitude location.
   * Uses the HTTP GET verb.
   *
   * @returns {JSON} - A JSON document with the report of raster data around the latitude and longitude location.
   */
  server.get('/report/@:lat(^[-]?\\d*\\.?\\d*),:lon(^[-]?\\d*\\.?\\d*)', (req, res, next) => {

    var now = new Date().toISOString();
    console.log(now + ' GET: /ghia-raster-server/report/:lat=' + req.params.lat + ',:lon=' + req.params.lon);

    let coordinate = [parseFloat(req.params.lon), parseFloat(req.params.lat)];

    let projectedCoordinate = geometryProjector.projectCoordinate2D(coordinate);

    let upperLeftCell = rasterLocator.getCellByXY(projectedCoordinate[0] - 500, projectedCoordinate[1] + 500);
    let lowerRightCell = rasterLocator.getCellByXY(projectedCoordinate[0] + 500, projectedCoordinate[1] - 500);

    let width = lowerRightCell[0] - upperLeftCell[0] + 1;
    let height = lowerRightCell[1] - upperLeftCell[1] + 1;

    let buffer = rasterReader.read(upperLeftCell[0], upperLeftCell[1], width, height);

    let histogram = rasterReader.getEnvelopeHistogram(buffer);

    let report = {
      location: {
        geographic: {
          lon: coordinate[0],
          lat: coordinate[1]
        },
        projected: {
          x: projectedCoordinate[0],
          y: projectedCoordinate[1]
        }
      },
      rasterExtract: {
        envelope: {
          minRow: upperLeftCell[1],
          minCol: upperLeftCell[0],
          maxRow: lowerRightCell[1],
          maxCol: lowerRightCell[0]
        },
        histogram: histogram
      }
    };

    res.send(report);

    return next();

  });

  /**
   * Gets the report of the values of the raster within a specified polygon.
   * Uses the HTTP POST verb.
   *
   * @returns {JSON} - A JSON document with the report of raster data inside the specified polygon.
   */
  server.post('/report', (req, res, next) => {

    var now = new Date().toISOString();
    console.log(now + ' POST: /ghia-raster-server/report/');

    let polygon = req.params.polygon;

    console.log(JSON.stringify(polygon));
    console.log();

    let projectedPolygon = geometryProjector.projectSingleShellPolygon(polygon);

    let geoJsonWriter = new jsts.io.GeoJSONWriter();

    let projectedPolygonGeoJSON = geoJsonWriter.write(projectedPolygon);

    let coords = projectedPolygon.getCoordinates();

    let envelope = rasterLocator.getEnvelopeCells(coords);

    let width = envelope[1][0] - envelope[0][0] + 1;
    let height = envelope[1][1] - envelope[0][1] + 1;

    let buffer = rasterReader.read(envelope[0][0], envelope[0][1], width, height);

    let histogram = rasterReader.getPolygonHistogram(buffer, envelope, projectedPolygon);

    let report = {
      polygon: {
        geographic: polygon,
        projected: projectedPolygonGeoJSON
      },
      rasterExtract: {
        envelope: {
          minRow: envelope[0][1],
          minCol: envelope[0][0],
          maxRow: envelope[1][1],
          maxCol: envelope[1][0]
        },
        histogram: histogram
      }
    };

    res.send(report);

    return next();

  });

};
