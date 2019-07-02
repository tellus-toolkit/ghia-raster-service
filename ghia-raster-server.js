
// var gdal = require('gdal');
// //var util = require('util');
//
// var filename = './data/GHIA_ILM_V_1_1.tif';
//
// console.log(filename);
//
// var ds = gdal.open(filename);
//
// var driver = ds.driver;
// var driver_metadata = driver.getMetadata();
//
// if (driver_metadata['DCAP_RASTER'] !== 'YES') {
//   console.error('Source file is not a raster');
// }
//
// console.log('Driver: ' + driver.description);
//
// // Raster Dimensions
// var size = ds.rasterSize;
// console.log('Size is ' + size.x + ', ' + size.y);
//
// // Spatial Reference
// console.log('Coordinate System is: ');
// console.log(ds.srs.toPrettyWKT());
//
// console.log('--------------------------------------------------------------------------------');
// console.log('Bands.Count: ' + ds.bands.count());
// console.log('--------------------------------------------------------------------------------');
//
// var band = ds.bands.get(1);
//
// console.log('Band.id:  ' + band.id);
// console.log('--------------------------------------------------------------------------------');
//
// console.log('Band.BlockSize.x: ' + band.blockSize.x);
// console.log('Band.BlockSize.y: ' + band.blockSize.y);
// console.log('Band.ColorInterpretation:  ' + band.colorInterpretation);
// console.log('Band.DataType: ' + band.dataType);
// console.log('Band.Description: ' + band.description);
// console.log('Band.HasArbitraryOverviews: ' + band.hasArbitraryOverviews);
// console.log('Band.Minimum: ' + band.minimum);
// console.log('Band.Maximum: ' + band.maximum);
// console.log('Band.NoDataValue: ' + band.noDataValue);
// console.log('Band.Offset: ' + band.offset);
// console.log('Band.ReadOnly: ' + band.readOnly);
// console.log('Band.Scale: ' + band.scale);
// console.log('Band.Size.x: ' + band.size.x);
// console.log('Band.Size.y: ' + band.size.y);
// console.log('Band.UnitType: ' + band.unitType);
// console.log('Band.CateGoryNames:');
// console.log('--------------------------------------------------------------------------------');
//
// band.categoryNames.forEach(function(categoryName) {
//   console.log(categoryName + '\r\n');
// });
//
// console.log('--------------------------------------------------------------------------------');
// console.log('Band.Overviews.Count: ' + band.overviews.count());
//
// var result = band.overviews.map(function(overviewBand, i) {
//   console.log(overviewBand.blockSize.x);
//   console.log(overviewBand.blockSize.y);
//   console.log(overviewBand.blockSize.minimum);
//   console.log(overviewBand.blockSize.maximum);
// });
//
// console.log('');
// console.log('--------------------------------------------------------------------------------');
// console.log('Pixels');
// console.log('--------------------------------------------------------------------------------');
//
//
// let pixels = 100*100;
// let pixelData = new Uint32Array(new ArrayBuffer(pixels * 4));
//
// band.pixels.read(2900, 1900, 100, 100, pixelData);
//
// console.log(pixelData);


//================================================================================

let jsts = require('jsts');

// let Location = require('./models/location');
// const projections = require('./models/projections');
const geometryProjector = require('./operations/geometryProjector');


// Point Inside
let p1Location = {
  coord: [-2.226963043212891, 53.46694902448933],
  tile: [33, 24]
};

// Point Outside
let p2Location = {
  coord: [-2.176752090454102, 53.48554310849578],
  tile: [36, 22]
};

// Polygon
let polygonLocations = {
  coords: [
    { coord: [-2.2576904296875004, 53.46837962792356], tile: [31,24] },
    { coord: [-2.226791381835938, 53.47900545831375], tile: [33,23] },
    { coord: [-2.19503402709961, 53.45882432637676], tile: [35,25] },
    { coord: [-2.227392196655274, 53.45867101524035], tile: [33,25] },
    { coord: [-2.2594928741455083, 53.4496246783658], tile: [31,26] },
    { coord: [-2.2576904296875004, 53.46837962792356], tile: [31,24] }
  ]
};



let geoJsonReader = new jsts.io.GeoJSONReader();

let geoJSON = {
  type: "Point",
  coordinates: p1Location.coord
};

let p1 = geoJsonReader.read(geoJSON);
let projectedP1 = geometryProjector.projectPoint(p1);

console.log('');
console.log('--------');
console.log('Point');
console.log(p1.getCoordinate());
console.log(projectedP1.getCoordinate());

geoJSON.coordinates = p2Location.coord;

let p2 = geoJsonReader.read(geoJSON);
let projectedP2 = geometryProjector.projectPoint(p2);

console.log('');
console.log('--------');
console.log('Point');
console.log(p2.getCoordinate());
console.log(projectedP2.getCoordinate());

geoJSON = {
  type: "Polygon",
  coordinates: [
    [
      [-2.2576904296875004, 53.46837962792356],
      [-2.226791381835938, 53.47900545831375],
      [-2.19503402709961, 53.45882432637676],
      [-2.227392196655274, 53.45867101524035],
      [-2.2594928741455083, 53.4496246783658],
      [-2.2576904296875004, 53.46837962792356]
    ]
  ]
};

let projectedPolygon = geometryProjector.projectSingleShellPolygon(geoJSON);

console.log('');
console.log('--------');
console.log('Polygon');
console.log(geoJSON.coordinates);
console.log(polygon.getCoordinates());
console.log(projectedPolygon.getCoordinates());
//console.log(geoJSON.coordinates);




// let polygon = geoJsonReader.read(geoJSON);
//
// let polygonCoordinates = geoJSON.coordinates[0];
//
// for (i = 0; i < polygonCoordinates.length; i++) {
//   polygonCoordinates[i] = geometryProjector.projectCoordinate2D(polygonCoordinates[i]);
// }
//
// geoJSON.coordinates[0] = polygonCoordinates;
//
// let projectedPolygon = geoJsonReader.read(geoJSON);
//
// console.log('');
// console.log('--------');
// console.log('Polygon');
// console.log(geoJSON.coordinates);
// console.log(polygon.getCoordinates());
// console.log(projectedPolygon.getCoordinates());
// console.log(geoJSON.coordinates);


let result = projectedPolygon.intersects(projectedP1) === true ? ' ' : ' not ';
console.log('Point 1' + result + 'intersects polygon');
result = projectedPolygon.intersects(projectedP2) === true ? ' ' : ' not ';
console.log('Point 2' + result + 'intersects polygon');


// console.log('Point 1 ' + projectedPolygon.intersects(projectedP1) === true ? '' : 'not' + ' intersects polygon.');
// console.log('Point 2 ' + projectedPolygon.intersects(projectedP2) === true ? '' : 'not' + ' intersects polygon.');


//================================================================================


// /**
//  * Module Dependencies
//  */
// const config = require('./config');
// const restify = require('restify');
// const restifyPlugins = require('restify').plugins;
//
// /**
//  * Initialize Server.
//  */
// const server = restify.createServer({
//   name: config.name,
//   version: config.version,
// });
//
// /**
//  * Middleware.
//  */
// server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
// server.use(restifyPlugins.acceptParser(server.acceptable));
// server.use(restifyPlugins.queryParser({ mapParams: true }));
// server.use(restifyPlugins.fullResponse());
//
// /**
//  * Start Server, Connect to DB & Require Routes.
//  */
// server.listen(config.port, () => {
//
//   require('./routes')(server);
//
//   var now = new Date().toISOString();
//
//   console.log('');
//   console.log('--------------------------------------------------------------------------------');
//   console.log(`${config.name}.`);
//   console.log(`Version ${config.version}`);
//   console.log('Server up and running on ' + now);
//   console.log(`Waiting for requests on port ${config.port}...`);
//   console.log('--------------------------------------------------------------------------------');
//   console.log('');
//   console.log('');
//
// });
