
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            rasterReader.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 06/07/2019.
// ================================================================================

// Module Dependencies.
const gdal = require('gdal');
const jsts = require('jsts');
const raster = require('../models/raster.js');

/**
 * The RasterReader provides methods to read information from a specified raster file.
 */
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

  /**
   * Gets the histogram of raster values in a buffer.
   *
   * @param buffer - The buffer having the raster values.
   * @returns {object} - An object representing the histogram.
   */
  getEnvelopeHistogram(buffer) {

    let histogram = {
      totalCells: buffer.length
    };

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

  },

  /**
   * Gets the histogram of raster values that intersect a specified polygon.
   *
   * @param buffer - The buffer having the raster values of the envelope enclosing the polygon.
   * @param envelope - The envelope of the polygon expressed in raster column and row coordinates.
   * @param polygon - The jsts.geom.Polygon that is used to extract the raster values from the buffer.
   * @returns {object} - An object representing the histogram.
   */
  getPolygonHistogram(buffer, envelope, polygon) {

    let cellSize = raster.getCellSize();
    let leftX = raster.getXmin();
    let topY = raster.getYmin() + raster.getBandRows() * cellSize;

    minCol = envelope[0][0];
    minRow = envelope[0][1];
    cols = envelope[1][0] - minCol + 1;
    rows = envelope[1][1] - minRow + 1;

    let geoJsonReader = new jsts.io.GeoJSONReader();

    let bufferIndex = 0;

    let histogram = {
      totalCells: 0
    };

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {

        cellLeftX = leftX + (minCol + c) * cellSize;
        cellTopY = topY - (minRow + r) * cellSize;

        let cellGeoJSON = {
          type: "Polygon",
          coordinates: [
            [
              [cellLeftX,            cellTopY           ], // left-top
              [cellLeftX + cellSize, cellTopY           ], // right-top
              [cellLeftX + cellSize, cellTopY - cellSize], // right-bottom
              [cellLeftX,            cellTopY - cellSize], // left-bottom
              [cellLeftX,            cellTopY           ]  // left-top
            ]
          ]
        };

        let cell = geoJsonReader.read(cellGeoJSON);

        if (polygon.intersects(cell)) {

          histogram.totalCells++;

          let value = buffer[bufferIndex];

          if (histogram.hasOwnProperty(value)) {
            histogram[value]++;
          }
          else {
            histogram[value] = 1;
          }

        }

        bufferIndex++;

      }
    }

    return histogram;

  }

};

module.exports = RasterReader;
