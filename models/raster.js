
const gdal = require('gdal');


const Raster = {

  /**
   * The filename.
   */
  filename: './data/GHIA_ILM_V_1_1.tif',

  /**
   * The number of the columns of the raster.
   */
  columns: undefined,

  /**
   * The number of the rows of the raster.
   */
  rows: undefined,

  /**
   * The size of the raster cell.
   */
  cellSize: undefined,

  /**
   * The size of the tile cell.
   */
  tileSize: undefined,

  /**
   * The x coordinate of the lower left corner of the raster area of interest in British National Grid. (EPSG:27700).
   */
  xmin: undefined, // 351672.35

  /**
   * The y coordinate of the lower left corner of the raster area of interest in British National Grid. (EPSG:27700).
   */
  ymin: undefined, // 381166.0433

  band: {
    id: undefined,
    blockSize: {
      x: undefined,
      y: undefined
    },
    colorInterpretation: undefined,
    dataType: undefined,
    description: undefined,
    hasArbitraryOverviews: undefined,
    minimum: undefined,
    maximum: undefined,
    noDataValue: undefined,
    offset: undefined,
    readOnly: undefined,
    scale: undefined,
    columns: undefined,
    rows: undefined,
    unitType: undefined
  },

  /**
   * Gets the raster metadata
   */
  getMetadata: function() {

    let ds = gdal.open(this.filename);

    this.columns = ds.rasterSize.x;
    this.rows = ds.rasterSize.y;

    this.xmin = ds.geoTransform[0];
    this.ymin = ds.geoTransform[3];

    this.cellSize = ds.geoTransform[1];
    this.tileSize = this.cellSize * 100;

    let b = ds.bands.get(1);

    this.band.id = b.id;

    this.band.blockSize.x = b.blockSize.x;
    this.band.blockSize.y = b.blockSize.y;

    this.band.colorInterpretation = b.colorInterpretation;
    this.band.colorInterpretation = b.colorInterpretation;
    this.band.dataType = b.dataType;
    this.band.description = b.description;
    this.band.hasArbitraryOverviews = b.hasArbitraryOverviews;
    this.band.minimum = b.minimum;
    this.band.maximum = b.maximum;
    this.band.noDataValue = b.noDataValue;
    this.band.offset = b.offset;
    this.band.readOnly = b.readOnly;
    this.band.scale = b.scale;
    this.band.columns = b.size.x;
    this.band.rows = b.size.y;

  },


  read: function(col, row, width, height) {

    let ds = gdal.open(this.filename);
    let band = ds.bands.get(1);

    let pixels = width * height;

    let buffer = new Uint32Array(new ArrayBuffer(pixels * 4));

    band.pixels.read(col, row, width, height, buffer);

    return buffer;

  }

};

module.exports = Raster;
