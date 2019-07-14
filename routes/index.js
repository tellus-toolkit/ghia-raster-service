
// Module Dependencies.
const config = require('../config');
const errors = require('restify-errors');
//const Client = require('node-rest-client').Client;
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
   * GET the server name and version.
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




  server.get('/test', function(req, res, next) {

    let now = new Date().toISOString();
    console.log(now + ' GET: /ghia-raster-server/test' );


    let result = {
      data: 'test'
    };


    // let coordinate = [parseFloat(req.params.lon), parseFloat(req.params.lat)];
    //
    // let projectedCoordinate = geometryProjector.projectCoordinate2D(coordinate);

    // let upperLeftCell = rasterLocator.getCellByXY(projectedCoordinate[0] - 500, projectedCoordinate[1] + 500);
    // // let lowerRightCell = rasterLocator.getCellByXY(projectedCoordinate[0] + 500, projectedCoordinate[1] - 500);
    //
    // let cellBlockSize = raster.getTileSize() / raster.getCellSize();
    //
    // let buffer = rasterReader.read(upperLeftCell[0], upperLeftCell[1], 100, 100);
    //
    // let histogram = rasterReader.getBufferHistogram(buffer);
    //
    // let report = {
    //   location: {
    //     x: projectedCoordinate[0],
    //     y: projectedCoordinate[1]
    //   },
    //   histogram: histogram
    // };

    // let band = ds.bands.get(1);
    let band = raster.getBand();
    let val = band.pixels.get(raster.getBandColumns() - 1, raster.getBandRows() - 1);

    result.data = val;

    res.send(result);


    return next();

  });


  /**
   * GET the raster metadata.
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
   * GET the report of the values of the raster based on a latitude, longitude location.
   */
  server.get('/report/@:lat(^[-]?\\d*\\.?\\d*),:lon(^[-]?\\d*\\.?\\d*)', (req, res, next) => {

    var now = new Date().toISOString();
    console.log(now + ' GET: /ghia-raster-server/report/:lat=' + req.params.lat + ',:lon=' + req.params.lon);

    let coordinate = [parseFloat(req.params.lon), parseFloat(req.params.lat)];

    let projectedCoordinate = geometryProjector.projectCoordinate2D(coordinate);

    let upperLeftCell = rasterLocator.getCellByXY(projectedCoordinate[0] - 500, projectedCoordinate[1] + 500);
    let lowerRightCell = rasterLocator.getCellByXY(projectedCoordinate[0] + 500, projectedCoordinate[1] - 500);

    //let cellBlockSize = raster.getTileSize() / raster.getCellSize();
    let width = lowerRightCell[0] - upperLeftCell[0] + 1;
    let height = lowerRightCell[1] - upperLeftCell[1] + 1;

    // let buffer = rasterReader.read(upperLeftCell[0], upperLeftCell[1], cellBlockSize, cellBlockSize);
    let buffer = rasterReader.read(upperLeftCell[0], upperLeftCell[1], width, height);

    let histogram = rasterReader.getBufferHistogram(buffer);

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
      raster: {
        envelope: {
          minRow: upperLeftCell[1],
          minCol: upperLeftCell[0],
          maxRow: lowerRightCell[1],
          maxCol: lowerRightCell[0]
        },
        totalCells: width * height,
        histogram: histogram
      }
    };

    res.send(report);

    return next();

  });



  server.post('/report', (req, res, next) => {

    var now = new Date().toISOString();
    console.log(now + ' POST: /ghia-raster-server/report/');

    console.log('');
    console.log(req.params.polygon);

    let polygon = req.params.polygon;

    // geoJSON = {
    //   type: "Polygon",
    //   coordinates: [
    //     [
    //       [-2.2576904296875004, 53.46837962792356],
    //       [-2.226791381835938, 53.47900545831375],
    //       [-2.19503402709961, 53.45882432637676],
    //       [-2.227392196655274, 53.45867101524035],
    //       [-2.2594928741455083, 53.4496246783658],
    //       [-2.2576904296875004, 53.46837962792356]
    //     ]
    //   ]
    // };

    // geoJSON = {type: "Polygon", coordinates: [[[-2.2576904296875004, 53.46837962792356],[-2.226791381835938, 53.47900545831375],[-2.19503402709961, 53.45882432637676],[-2.227392196655274, 53.45867101524035],[-2.2594928741455083, 53.4496246783658],[-2.2576904296875004, 53.46837962792356]]]};


    let projectedPolygon = geometryProjector.projectSingleShellPolygon(polygon);

    let coords = projectedPolygon.getCoordinates();

    let envelope = rasterLocator.getEnvelopeCells(coords);


    //let cellBlockSize = raster.getTileSize() / raster.getCellSize();
    let width = envelope[1][0] - envelope[0][0] + 1;
    let height = envelope[1][1] - envelope[0][1] + 1;

    // let buffer = rasterReader.read(upperLeftCell[0], upperLeftCell[1], cellBlockSize, cellBlockSize);
    let buffer = rasterReader.read(envelope[0][0], envelope[0][1], width, height);

    let histogram = rasterReader.getBufferHistogram(buffer);

    let report = {
      raster: {
        envelope: {
          minRow: envelope[0][1],
          minCol: envelope[0][0],
          maxRow: envelope[1][1],
          maxCol: envelope[1][0]
        },
        totalCells: width * height,
        histogram: histogram
      }
    };

    res.send(report);

    return next();


//
// console.log('');
// console.log('--------');
// console.log('Polygon');
// console.log(geoJSON.coordinates);
// console.log(projectedPolygon.getCoordinates());
//
// console.log('');
// console.log('--------');
//
// let result = projectedPolygon.intersects(projectedP1) === true ? ' ' : ' not ';
// console.log('Point 1' + result + 'intersects polygon');
// result = projectedPolygon.intersects(projectedP2) === true ? ' ' : ' not ';
// console.log('Point 2' + result + 'intersects polygon');
//
//
// let upperLeftCell = rasterLocator.getCellByXY(projectedP1.getX() - 500, projectedP1.getY() + 500);
// let lowerRightCell = rasterLocator.getCellByXY(projectedP1.getX() + 500, projectedP1.getY() - 500);
//
// console.log(upperLeftCell);
// console.log(lowerRightCell);
//
// let pixelData = rasterReader.read(upperLeftCell[0], upperLeftCell[1], 100, 100);
// // let pixelData = rasterReader.read(0, 0, 100, 100);
//
// // console.log(pixelData);
//
// for (let i = 0; i < pixelData.length; i++) {
//   //console.log(pixelData[i]);
// }
//
// let histogram = rasterReader.getBufferHistogram(pixelData);
//
// for (var key in histogram) {
//   if (histogram.hasOwnProperty(key)) {
//     console.log(key + ': ' + histogram[key]);
//   }
// }


  });





  // /**
  //  * GET the codes of a specific NUTS level.
  //  */
  // server.get('/nuts/codes/:level', (req, res, next) => {
  //   var now = new Date().toISOString();
  //   console.log(now + ' GET: /resin/nuts/codes/:level=' + req.params.level);
  //
  //   NutsCodes.findOne({ level: req.params.level }, function(err, doc) {
  //     if (err) {
  //       console.log('Error Occured.');
  //       console.log('');
  //       console.error(err);
  //       return next(
  //         new errors.InvalidContentError(err.name + ': ' + err.message)
  //       );
  //     }
  //
  //     var result = null;
  //     if (doc != null || doc != undefined) {
  //       result = doc.codes;
  //     }
  //     else {
  //       result = doc;
  //     }
  //
  //     res.send(result);
  //     next();
  //   });
  // });
  //
  // /**
  //  * GET the codes of a specific NUTS level that fall inside the previous level NUTS code.
  //  */
  // server.get('/nuts/codes/:level/:prev_levels_nuts_code', (req, res, next) => {
  //   var now = new Date().toISOString();
  //   console.log(now + ' GET: /resin/nuts/codes/:level=' + req.params.level + '/:prev_levels_nuts_code=' + req.params.prev_levels_nuts_code);
  //
  //   NutsCodes.findOne({ level: req.params.level }, function(err, doc) {
  //     if (err) {
  //       console.log('Error Occured.');
  //       console.log('');
  //       console.error(err);
  //       return next(
  //         new errors.InvalidContentError(err.name + ': ' + err.message)
  //       );
  //     }
  //
  //     var lev = parseInt(req.params.level);
  //
  //     var result = null;
  //
  //     if (doc != null || doc != undefined) {
  //       var nc = req.params.prev_levels_nuts_code;
  //
  //       if (lev > 0) {
  //         if (nc != null || nc != undefined) {
  //           if (nc.length > 1 && nc.length < lev + 2) {
  //             if (doc.codes != null || doc.codes != undefined) {
  //               result = doc.codes.filter(nco => nco.nuts_id.startsWith(nc));
  //             }
  //           }
  //         }
  //       }
  //     }
  //
  //     res.send(result);
  //     next();
  //   });
  // });
  //
  // /**
  //  * GET a specific typology array of objects.
  //  * Valid values are: 'supergroups', 'groups', 'indicators'.
  //  */
  // server.get('/typology/:name', (req, res, next) => {
  //   var now = new Date().toISOString();
  //   console.log(now + ' GET: /resin/typology/:name=' + req.params.name);
  //
  //   Typology.findOne({ name: req.params.name }, function(err, doc) {
  //     if (err) {
  //       console.log('Error Occured.');
  //       console.log('');
  //       console.error(err);
  //       return next(
  //         new errors.InvalidContentError(err.name + ': ' + err.message)
  //       );
  //     }
  //
  //     // var result = null;
  //     // if (doc != null || doc != undefined) {
  //     //   result = doc.objs;
  //     // }
  //     // else {
  //     //   result = doc;
  //     // }
  //
  //     res.send(doc.objs);
  //     // res.send(result);
  //     next();
  //   });
  // });
  //
  // /**
  //  * GET the geospatial feature (geometry, classification and indicators) of a specific NUTS 3 region.
  //  * Valid values for geometry_type are: 'centroids', 'polygons'.
  //  */
  // server.get('/geospatial/:geometry_type/:nuts_id', (req, res, next) => {
  //   var now = new Date().toISOString();
  //   console.log(now + ' GET: /resin/geospatial/:geometry_type=' + req.params.geometry_type + '/:nuts_id=' + req.params.nuts_id);
  //
  //   var result = null;
  //
  //   var client = new Client();
  //
  //   var part1 = 'http://maps.humanities.manchester.ac.uk/spatial/geoserver/resin/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=';
  //
  //   var layer = null;
  //
  //   if (req.params.geometry_type === 'centroids') {
  //     layer = 'resin:nuts-3-2013-centroids-v4&';
  //   }
  //   else if (req.params.geometry_type === 'polygons') {
  //     layer = 'resin:nuts-3-2013-polygons-v4&';
  //   }
  //
  //   var cqlFilter = "cql_filter=NUTS_ID='" + req.params.nuts_id + "'&";
  //
  //   var part2 = 'outputFormat=application/json';
  //
  //   var url = part1 + layer + cqlFilter + part2;
  //
  //   client.get(url, function (data, response) {
  //     result = data;
  //
  //     res.send(result);
  //     next();
  //   });
  // });

};
