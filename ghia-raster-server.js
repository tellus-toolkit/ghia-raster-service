
const jsts = require('jsts');
const raster = require('./models/raster.js')
const rasterLocator = require('./operations/rasterLocator.js')
const geometryProjector = require('./operations/geometryProjector');


raster.getMetadata();

console.log('Filename: ' + raster.filename);
console.log('Columns: ' + raster.columns);
console.log('Rows: ' + raster.rows);
console.log('Cell Size: ' + raster.cellSize);
console.log('Tile Size: ' + raster.tileSize);
console.log('minimum x: ' + raster.xmin);
console.log('minimum y: ' + raster.ymin);

console.log('Band.BlockSize.x: ' + raster.band.blockSize.x);
console.log('Band.BlockSize.y: ' + raster.band.blockSize.y);
console.log('Band.ColorInterpretation:  ' + raster.band.colorInterpretation);
console.log('Band.DataType: ' + raster.band.dataType);
console.log('Band.Description: ' + raster.band.description);
console.log('Band.HasArbitraryOverviews: ' + raster.band.hasArbitraryOverviews);
console.log('Band.Minimum: ' + raster.band.minimum);
console.log('Band.Maximum: ' + raster.band.maximum);
console.log('Band.NoDataValue: ' + raster.band.noDataValue);
console.log('Band.Offset: ' + raster.band.offset);
console.log('Band.ReadOnly: ' + raster.band.readOnly);
console.log('Band.Scale: ' + raster.band.scale);
console.log('Band.Columns ' + raster.band.columns);
console.log('Band.Rows: ' + raster.band.rows);
console.log('Band.UnitType: ' + raster.band.unitType);

rasterLocator.raster = raster;


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
console.log(rasterLocator.getTile(projectedP1.getCoordinate()));
console.log(rasterLocator.getCell(projectedP1.getCoordinate()));

geoJSON.coordinates = p2Location.coord;

let p2 = geoJsonReader.read(geoJSON);
let projectedP2 = geometryProjector.projectPoint(p2);

console.log('');
console.log('--------');
console.log('Point');
console.log(p2.getCoordinate());
console.log(projectedP2.getCoordinate());
console.log(rasterLocator.getTile(projectedP2.getCoordinate()));
console.log(rasterLocator.getCell(projectedP2.getCoordinate()));

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
console.log(projectedPolygon.getCoordinates());

console.log('');
console.log('--------');

let result = projectedPolygon.intersects(projectedP1) === true ? ' ' : ' not ';
console.log('Point 1' + result + 'intersects polygon');
result = projectedPolygon.intersects(projectedP2) === true ? ' ' : ' not ';
console.log('Point 2' + result + 'intersects polygon');


let upperLeftCell = rasterLocator.getCellByXY(projectedP1.getX() - 500, projectedP1.getY() + 500);
let lowerRightCell = rasterLocator.getCellByXY(projectedP1.getX() + 500, projectedP1.getY() - 500);

console.log(upperLeftCell);
console.log(lowerRightCell);

// let pixels = 100*100;
// let pixelData = new Uint32Array(new ArrayBuffer(pixels * 4));
//
// band.pixels.read(3285, 3385, 100, 100, pixelData);
//
// console.log(pixelData);

let pixelData = raster.read(upperLeftCell[0], upperLeftCell[1], 100, 100);

// console.log(pixelData);

for (i = 0; i < pixelData.length; i++) {
  console.log(pixelData[i]);
}


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
