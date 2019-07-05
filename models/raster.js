
/**
 * A single band raster.
 */
const Raster = {

  /**
   * The gdal.Dataset.
   */
  dataset: undefined,

  /**
   * Gets the number of columns in the raster.
   * This is a shortcut to Raster.dataset.rasterSize.x.
   *
   * @returns {undefined|number}
   */
  getColumns: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.dataset.rasterSize.x;

  },

  /**
   * Gets the number of rows in the raster.
   * This is a shortcut to Raster.dataset.rasterSize.y.
   *
   * @returns {undefined|number}
   */
  getRows: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.dataset.rasterSize.y;

  },

  /**
   * Gets the cell size of the raster.
   * This is shortcut to this.dataset.geoTransform[1].
   *
   * @returns {undefined|number}
   */
  getCellSize: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.dataset.geoTransform[1];

  },

  /**
   * Get the tile size of the raster.
   *
   * @returns {number|undefined}
   */
  getTileSize: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.getCellSize() * 100;

  },

  /**
   * The x coordinate of the lower left corner of the raster.
   */
  getXmin: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.dataset.geoTransform[0]; // 351672.35

  },

  /**
   * The y coordinate of the lower left corner of the raster.
   */
  getYmin: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.dataset.geoTransform[3] - (this.getCellSize() * this.getBandRows()); // 381166.0433

  },

  /**
   * Gets the band of the raster.
   *
   * @returns {undefined|gdal.RasterBand}
   */
  getBand: function() {

    if (this.dataset === undefined) {
      return undefined;
    }

    return this.dataset.bands.get(1);

  },

  /**
   * Gets the columns of the raster band.
   *
   * @returns {undefined|number}
   */
  getBandColumns: function() {

    return this.getBand().size.x;

  },

  /**
   * Gets the columns of the raster band.
   *
   * @returns {undefined|number}
   */
  getBandRows: function() {

    return this.getBand().size.y;

  }

};

module.exports = Raster;
