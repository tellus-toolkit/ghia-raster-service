
/**
 * Module Dependencies
 */
const config = require('../config');
let Location = require('../models/location');
const projections = require('../models/projections');
const locationProjector = require('../operations/locationProjector');


const errors = require('restify-errors');
//const Client = require('node-rest-client').Client;

/**
 * Model Schema
 */
//const NutsCodes = require('../models/nutsCodesModel');
//const Typology = require('../models/typologyModel');

module.exports = function(server) {

  /**
   * Get the server name and version.
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

    //let loc = new Location();
    let location = new Location(-2.575607299804688, 53.63649628489509);

    let projectedLocation = locationProjector.project(location);

    res.send(projectedLocation);

    return next();

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
