
/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const restifyPlugins = require('restify').plugins;
const jsts = require('jsts');
const raster = require('./models/raster.js');
const rasterReader = require('./operations/rasterReader.js');
const rasterLocator = require('./operations/rasterLocator.js');
const geometryProjector = require('./operations/geometryProjector');



// ================================================================================
// Raster reading tests.

// Open the raster.
let raster = rasterReader.open();

console.log('Filename: ' + rasterReader.filename);

console.log('Columns: ' + raster.getColumns());
console.log('Rows: ' + raster.getRows());
console.log('Cell Size: ' + raster.getCellSize());
console.log('Tile Size: ' + raster.getTileSize());
console.log('minimum x: ' + raster.getXmin());
console.log('minimum y: ' + raster.getYmin());

// Get the band of the raster.
let band = raster.getBand();

console.log('Band.Id: ' + band.id);
console.log('Band.BlockSize.x: ' + band.blockSize.x);
console.log('Band.BlockSize.y: ' + band.blockSize.y);
console.log('Band.ColorInterpretation:  ' + raster.getBand().colorInterpretation);
console.log('Band.DataType: ' + band.dataType);
console.log('Band.Description: ' + band.description);
console.log('Band.HasArbitraryOverviews: ' + band.hasArbitraryOverviews);
console.log('Band.Minimum: ' + band.minimum);
console.log('Band.Maximum: ' + band.maximum);
console.log('Band.NoDataValue: ' + band.noDataValue);
console.log('Band.Offset: ' + band.offset);
console.log('Band.ReadOnly: ' + band.readOnly);
console.log('Band.Scale: ' + band.scale);
console.log('Band.Columns ' + raster.getBandColumns());
console.log('Band.Rows: ' + raster.getBandRows());
console.log('Band.UnitType: ' + band.unitType);

// Get the statistics of the raster band.
let statistics = band.getStatistics(false, true);

console.log('Band.Statistics.Minimum: ' + statistics.min);
console.log('Band.Statistics.Maximum: ' + statistics.max);
console.log('Band.Statistics.Mean: ' + statistics.mean);
console.log('Band.Statistics.StandardDeviation: ' + statistics.std_dev);

// Set up the RasterLocator used to locate the cells and tiles of the raster.
rasterLocator.raster = raster;



// ================================================================================
// Geometries tests.

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
console.log(p1Location.tile);
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
console.log(p2Location.tile);
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

let pixelData = rasterReader.read(upperLeftCell[0], upperLeftCell[1], 100, 100);
// let pixelData = rasterReader.read(0, 0, 100, 100);

console.log(pixelData);

for (let i = 0; i < pixelData.length; i++) {
  console.log(pixelData[i]);
}

let histogram = rasterReader.getBufferHistogram(pixelData);

for (var key in histogram) {
  if (histogram.hasOwnProperty(key)) {
    console.log(key + ': ' + histogram[key]);
  }
}
