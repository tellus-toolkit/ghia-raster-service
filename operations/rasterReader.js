
const gdal = require('gdal');
const raster = require('../models/raster.js')


const RasterReader = {

  /**
   * The raster filename.
   */
  filename: './data/GHIA_ILM_V_1_1.tif',

  /**
   * Opens the raster file.
   *
   * @param filename - The filename of the raster to open.
   * @returns {Raster}
   */
  open: function(filename) {

    if (filename !== undefined && filename !== null && filename !== '') {
      this.filename = filename;
    }

    raster.dataset = gdal.open(this.filename);

    return raster;

  },

  /**
   * Reads a block of raster cells and returns a buffer with the raster data.
   *
   * @param col - The column of the raster band from which to start reading the cell values.
   * @param row - The row of the raster band from which to start reading the cell values.
   * @param width - The width of the block of cells to read.
   * @param height - The height of the block of cell to read.
   * @returns {Uint32Array} - A buffer with the cell values.
   */
  read: function(col, row, width, height) {

    // let band = ds.bands.get(1);
    let band = raster.getBand();

    let pixels = width * height;

    let buffer = undefined;

    if (band.dataType === 'UInt32') {
      buffer = new Uint32Array(new ArrayBuffer(pixels * 4));
    }

    if (buffer !== undefined) {
      band.pixels.read(col, row, width, height, buffer);
    }

    return buffer;

  },


  getBufferStatistics(buffer) {

    for (i = 0; i < buffer.length; i++) {
      console.log(buffer[i]);
    }

  },

  getBufferHistogram(buffer) {

    let histogram = {};

    histogram[buffer[0]] = 1;

    for (i = 1; i < buffer.length; i++) {
      let value = buffer[i];

      if (histogram.hasOwnProperty(value)) {
        histogram[value]++;
      }
      else {
        histogram[value] = 1;
      }

    }

    return histogram;

  }

};

module.exports = RasterReader;
