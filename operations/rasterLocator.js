
const gdal = require('gdal');
const proj4 = require('proj4');


const RasterLocator = {

  raster: undefined,

  /**
   * Returns a tile.
   *
   * @param coords - The jsts.geom.Coordinate object of the location whose tile will be returned.
   * @returns {Array<number>} - A 2 position array having the x and y index of the tile.
   */
  getTile: function(coords) {

    let nx = Math.floor((coords.x - this.raster.xmin) / this.raster.tileSize);

    let ny = Math.floor((this.raster.ymin - coords.y) / this.raster.tileSize);

    return [nx, ny];

  },

  getTileByXY: function(x, y) {

    let nx = Math.floor((x - this.raster.xmin) / this.raster.tileSize);

    let ny = Math.floor((this.raster.ymin - y) / this.raster.tileSize);

    return [nx, ny];

  },

  /**
   * Returns a tile.
   *
   * @param coords - The jsts.geom.Coordinate object of the location whose cell will be returned.
   * @returns {Array<number>} - A 2 position array having the x and y index of the cell.
   */
  getCell: function(coords) {

    let nx = Math.floor((coords.x - this.raster.xmin) / this.raster.cellSize);

    let ny = Math.floor((this.raster.ymin - coords.y) / this.raster.cellSize);

    return [nx, ny];

  },

  getCellByXY: function(x, y) {

    let nx = Math.floor((x - this.raster.xmin) / this.raster.cellSize);

    let ny = Math.floor((this.raster.ymin - y) / this.raster.cellSize);

    return [nx, ny];

  }

};

module.exports = RasterLocator;
