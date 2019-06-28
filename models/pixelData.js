
// let pixels = 100*100;
// let pixelData = new Uint32Array(new ArrayBuffer(pixels * 4));
//
// band.pixels.read(2900, 1900, 100, 100, pixelData);
//
// console.log(pixelData);

var PixelData = {
  col: 0,
  row: 0,
  width: 100,
  height: 100,
  buffer: null,
  band: null,

  /**
   * Sets the buffer used to read the data.
   */
  setBuffer: function() {
    this.buffer = new Uint32Array(new ArrayBuffer(this.col * this.row) * 4);
  },

  read: function(col, row, width, height) {

  }
};








