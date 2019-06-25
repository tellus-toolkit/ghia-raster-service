
var gdal = require('gdal');
//var util = require('util');

var filename = './data/GHIA_ILM_V_1_1.tif';

console.log(filename);

var ds = gdal.open(filename);

var driver = ds.driver;
var driver_metadata = driver.getMetadata();

if (driver_metadata['DCAP_RASTER'] !== 'YES') {
  console.error('Source file is not a raster');
}

console.log('Driver: ' + driver.description);

// Raster Dimensions
var size = ds.rasterSize;
console.log('Size is ' + size.x + ', ' + size.y);

// Spatial Reference
console.log('Coordinate System is: ');
console.log(ds.srs.toPrettyWKT());

console.log('--------------------------------------------------------------------------------');
console.log('Bands.Count: ' + ds.bands.count());
console.log('--------------------------------------------------------------------------------');

var band = ds.bands.get(1);

console.log('Band.id:  ' + band.id);
console.log('--------------------------------------------------------------------------------');

console.log('Band.BlockSize.x: ' + band.blockSize.x);
console.log('Band.BlockSize.y: ' + band.blockSize.y);
console.log('Band.ColorInterpretation:  ' + band.colorInterpretation);
console.log('Band.DataType: ' + band.dataType);
console.log('Band.Description: ' + band.description);
console.log('Band.HasArbitraryOverviews: ' + band.hasArbitraryOverviews);
console.log('Band.Minimum: ' + band.minimum);
console.log('Band.Maximum: ' + band.maximum);
console.log('Band.NoDataValue: ' + band.noDataValue);
console.log('Band.Offset: ' + band.offset);
console.log('Band.ReadOnly: ' + band.readOnly);
console.log('Band.Scale: ' + band.scale);
console.log('Band.Size.x: ' + band.size.x);
console.log('Band.Size.y: ' + band.size.y);
console.log('Band.UnitType: ' + band.unitType);
console.log('Band.CateGoryNames:');
console.log('--------------------------------------------------------------------------------');

band.categoryNames.forEach(function(categoryName) {
  console.log(categoryName + '\r\n');
});

console.log('--------------------------------------------------------------------------------');
console.log('Band.Overviews.Count: ' + band.overviews.count());

var result = band.overviews.map(function(overviewBand, i) {
  console.log(overviewBand.blockSize.x);
  console.log(overviewBand.blockSize.y);
  console.log(overviewBand.blockSize.minimum);
  console.log(overviewBand.blockSize.maximum);
});

console.log('');
console.log('--------------------------------------------------------------------------------');
console.log('Pixels');
console.log('--------------------------------------------------------------------------------');


let pixels = 100*100;
let pixelData = new Uint32Array(new ArrayBuffer(pixels * 4));

band.pixels.read(2900, 1900, 100, 100, pixelData);

console.log(pixelData);







