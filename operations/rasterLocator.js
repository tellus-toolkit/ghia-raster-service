
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            rasterLocator.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 14/07/2019.
// ================================================================================

/**
 * The RasterLocator provides methods to locate tiles or cells of an associated raster file
 * retrieved using spatial locations.
 */
const RasterLocator = {

  /**
   * The models/raster object used to located tiles or cells.
   */
  raster: undefined,

  /**
   * Gets a raster tile.
   * Tiles are defined as square blocks of raster cells.
   *
   * @param coords - The jsts.geom.Coordinate object of the location whose tile will be returned.
   * @returns {Array<number>} - A 2 position array having the col and row index of the tile.
   */
  getTile: function(coords) {

    let col = undefined;
    let row = undefined;

    if (this.raster !== undefined) {
      col = Math.floor((coords.x - this.raster.getXmin()) / this.raster.getTileSize());
      row = Math.floor((this.raster.getYmin() + (this.raster.getBandRows() * this.raster.getCellSize()) - coords.y) / this.raster.getTileSize());
    }

    return this.restrainCellInBounds(col, row);

  },

  /**
   * Gets a raster tile.
   * Tiles are defined as square block of raster cells.
   *
   * @param x - The x coordinate of the location whose tile will be returned.
   * @param y - The y coordinate of the location whose tile will be returned.
   * @returns {Array<number>} - A 2 position array having the col and row index of the tile.
   */
  getTileByXY: function(x, y) {

    let col = undefined;
    let row = undefined;

    if (this.raster !== undefined) {
      col = Math.floor((x - this.raster.getXmin()) / this.raster.getTileSize());
      row = Math.floor((this.raster.getYmin() + (this.raster.getBandRows() * this.raster.getCellSize()) - coords.y) / this.raster.getTileSize());
    }

    return this.restrainCellInBounds(col, row);

  },

  /**
   * Gets a raster cell.
   *
   * @param coords - The jsts.geom.Coordinate object of the location whose cell will be returned.
   * @returns {Array<number>} - A 2 position array having the col and row index of the cell.
   */
  getCell: function(coords) {

    let col = undefined;
    let row = undefined;

    if (this.raster !== undefined) {
      col = Math.floor((coords.x - this.raster.getXmin()) / this.raster.getCellSize());
      row = Math.floor((this.raster.getYmin() + (this.raster.getBandRows() * this.raster.getCellSize()) - coords.y) / this.raster.getCellSize());
    }

    return this.restrainCellInBounds(col, row);

  },

  /**
   * Gets a raster cell.
   *
   * @param x - The x coordinate of the location whose cell will be returned.
   * @param y - The y coordinate of the location whose cell will be returned.
   * @returns {Array<number>} - A 2 position array having the col and row index of the cell.
   */
  getCellByXY: function(x, y) {

    let col = undefined;
    let row = undefined;

    if (this.raster !== undefined) {
      col = Math.floor((x - this.raster.getXmin()) / this.raster.getCellSize());
      row = Math.floor((this.raster.getYmin() + (this.raster.getBandRows() * this.raster.getCellSize()) - y) / this.raster.getCellSize());
    }

    return this.restrainCellInBounds(col, row);

  },

  /**
   * Gets an envelope of raster cells.
   *
   * @param coordsArray - The Array<jsts.geom.Coordinate> that will be used to get the envelope of raster cells.
   * @returns {Array<Array<number>>} - A 2 position array having the minimum and maximum cells of the envelope.
   */
  getEnvelopeCells: function(coordsArray) {

    let minx = coordsArray[0].x;
    let miny = coordsArray[0].y;
    let maxx = coordsArray[0].x;
    let maxy = coordsArray[0].y;

    for (let i = 1; i < coordsArray.length; i++) {
      if (minx > coordsArray[i].x) {
        minx = coordsArray[i].x;
      }
      if (miny > coordsArray[i].y) {
        miny = coordsArray[i].y;
      }
      if (maxx < coordsArray[i].x) {
        maxx = coordsArray[i].x;
      }
      if (maxy < coordsArray[i].y) {
        maxy = coordsArray[i].y;
      }
    }

    let minCell = this.getCellByXY(minx, maxy);
    let maxCell = this.getCellByXY(maxx, miny);

    return [minCell, maxCell];

  },

  /**
   * Restrains the current cell within the raster band's bounds.
   *
   * @param col - The column in which the cell belongs.
   * @param row - The row in which the cell belongs.
   * @returns {Array<number>} - A 2 position array having the col and row index of the cell.
   */
  restrainCellInBounds(col, row) {

    let cell = [col, row];

    if (col < 0) {
      cell[0] = 0;
    }
    else if (col > this.raster.getBandColumns()) {
      cell[0] = this.raster.getBandColumns();
    }

    if (row < 0) {
      cell[1] = 0;
    }
    else if (row > this.raster.getBandRows()) {
      cell[1] = this.raster.getBandRows();
    }

    return cell;

  }

};

module.exports = RasterLocator;
