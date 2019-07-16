
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            raster.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 06/07/2019.
// ================================================================================

/**
 * A single band raster.
 */
const Raster = {

  /**
   * The gdal.Dataset.
   */
  dataset: undefined,

  lookup: {
    '11': {
      count: 1890363,
      form: "Built",
      function: "Urban Other",
      landscape: "Urban Other Built"
    },
    '13': {
      count: 1082581,
      form: "Built",
      function: "Domestic Gardens",
      landscape: "Domestic Gardens Built"
    },
    '14': {
      count: 65683,
      form: "Built",
      function: "Public Recreation",
      landscape: "Public Recreation Built"
    },
    '15': {
      count: 251800,
      form: "Built",
      function: "Amenity",
      landscape: "Amenity Built"
    },
    '16': {
      count: 33834,
      form: "Built",
      function: "Previously Developed",
      landscape: "Previously Developed Built"
    },
    '17': {
      count: 93415,
      form: "Built",
      function: "Institutional",
      landscape: "Institutional Built"
    },
    '18': {
      count: 60,
      form: "Built",
      function: "Urban Other",
      landscape: "Urban Other Built"
    },
    '21': {
      count: 9262,
      form: "Water",
      function: "Urban Other",
      landscape: "Urban Other Water"
    },
    '23': {
      count: 1949,
      form: "Water",
      function: "Domestic Gardens",
      landscape: "Domestic Gardens Water"
    },
    '24': {
      count: 90817,
      form: "Water",
      function: "Public Recreation",
      landscape: "Public Recreation Water"
    },
    '25': {
      count: 37082,
      form: "Water",
      function: "Amenity",
      landscape: "Amenity Water"
    },
    '26': {
      count: 232,
      form: "Water",
      function: "Previously Developed",
      landscape: "Previously Developed Water"
    },
    '27': {
      count: 302,
      form: "Water",
      function: "Institutional",
      landscape: "Institutional Water"
    },
    '28': {
      count: 87463,
      form: "Water",
      function: "Peri-urban",
      landscape: "Peri-urban Water"
    },
    '31': {
      count: 152910,
      form: "Grasses",
      function: "Urban Other",
      landscape: "Urban Other Grasses"
    },
    '33': {
      count: 312356,
      form: "Grasses",
      function: "Domestic Gardens",
      landscape: "Domestic Gardens Grasses"
    },
    '34': {
      count: 270989,
      form: "Grasses",
      function: "Public Recreation",
      landscape: "Public Recreation Grasses"
    },
    '35': {
      count: 368232,
      form: "Grasses",
      function: "Amenity",
      landscape: "Amenity Grasses"
    },
    '36': {
      count: 4803,
      form: "Grasses",
      function: "Previously Developed",
      landscape: "Previously Developed Grasses"
    },
    '37': {
      count: 52626,
      form: "Grasses",
      function: "Institutional",
      landscape: "Institutional Grasses"
    },
    '38': {
      count: 959678,
      form: "Grasses",
      function: "Peri-urban",
      landscape: "Peri-urban Grasses"
    },
    '41': {
      count: 205147,
      form: "Forbs and shrubs",
      function: "Urban Other",
      landscape: "Urban Other Forbs and shrubs"
    },
    '43': {
      count: 422170,
      form: "Forbs and shrubs",
      function: "Domestic Gardens",
      landscape: "Domestic Gardens Forbs and shrubs"
    },
    '44': {
      count: 349814,
      form: "Forbs and shrubs",
      function: "Public Recreation",
      landscape: "Public Recreation Forbs and shrubs"
    },
    '45': {
      count: 778452,
      form: "Forbs and shrubs",
      function: "Amenity",
      landscape: "Amenity Forbs and shrubs"
    },
    '46': {
      count: 11460,
      form: "Forbs and shrubs",
      function: "Previously Developed",
      landscape: "Previously Developed Forbs and shrubs"
    },
    '47': {
      count: 57490,
      form: "Forbs and shrubs",
      function: "Institutional",
      landscape: "Institutional Forbs and shrubs"
    },
    '48': {
      count: 2557302,
      form: "Forbs and shrubs",
      function: "Peri-urban",
      landscape: "Peri-urban Forbs and shrubs"
    },
    '51': {
      count: 266714,
      form: "Tree canopy",
      function: "Urban Other",
      landscape: "Urban Other Tree canopy"
    },
    '53': {
      count: 557844,
      form: "Tree canopy",
      function: "Domestic Gardens",
      landscape: "Domestic Gardens Tree canopy"
    },
    '54': {
      count: 401480,
      form: "Tree canopy",
      function: "Public Recreation",
      landscape: "Public Recreation Tree canopy"
    },
    '55': {
      count: 795895,
      form: "Tree canopy",
      function: "Amenity",
      landscape: "Amenity Tree canopy"
    },
    '56': {
      count: 7136,
      form: "Tree canopy",
      function: "Previously Developed",
      landscape: "Previously Developed Tree canopy"
    },
    '57': {
      count: 46286,
      form: "Tree canopy",
      function: "Institutional",
      landscape: "Institutional Tree canopy"
    },
    '58': {
      count: 535310,
      form: "Tree canopy",
      function: "Peri-urban",
      landscape: "Peri-urban Tree canopy"
    }
  },
  dictionary: [
    {
      field: "form",
      term: "Built",
      description: "Sealed surfaces including roads, buildings and hardstanding"
    },
    {
      field: "form",
      term: "Water",
      description: "Areas covered by natural and man-made water bodies and water courses"
    },
    {
      field: "form",
      term: "Grasses",
      description: "Areas covered by lawns, mown grass or grass-like (graminoid) crops"
    },
    {
      field: "form",
      term: "Forbs and shrubs",
      description: "Land dominated by herbaceous flowering plants and shrubs"
    },
    {
      field: "form",
      term: "Tree Canopy",
      description: "Tree canopy"
    },
    {
      field: "function",
      term: "Urban Other",
      description: "Land-use not assigned to any other function in this list and existing in urban areas"
    },
    {
      field: "function",
      term: "Domestic Gardens",
      description: "Private domestic gardens"
    },
    {
      field: "function",
      term: "Public Recreation",
      description: "Public Parks and Recreation. Accessible sites designated for leisure and recreation"
    },
    {
      field: "function",
      term: "Amenity",
      description: "Green areas primarily aimed at increasing aesthetic value located between buildings, roads and other land-uses"
    },
    {
      field: "function",
      term: "Previously Developed",
      description: "Brownfield sites and transitional land-use"
    },
    {
      field: "function",
      term: "Institutional",
      description: "Intitutional land (e.g. on hospital, adminstrative or school grounds)"
    },
    {
      field: "function",
      term: "Peri-urban",
      description: "Non-urban land-use within Greater Manchester"
    },
    {
      field: "function",
      term: "Urban Other Built",
      description: "Land-use: Urban other; Land-cover: Built"
    },
    {
      field: "function",
      term: "Urban Other Water",
      description: "Land-use: Urban other; Land-cover: Water"
    },
    {
      field: "function",
      term: "Urban Other Grasses",
      description: "Land-use: Urban other; Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Urban Other Forbs and shrubs",
      description: "Land-use: Urban other; Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Urban Other Tree canopy",
      description: "Land-use: Urban other; Land-cover: Tree Canopy"
    },
    {
      field: "function",
      term: "Public Recreation Built",
      description: "Land-use: Public Parks and Recreation: Land-cover: Built"
    },
    {
      field: "function",
      term: "Public Recreation Water",
      description: "Land-use: Public Parks and Recreation: Land-cover: Water"
    },
    {
      field: "function",
      term: "Public Recreation Grasses",
      description: "Land-use: Public Parks and Recreation: Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Public Recreation Forbs and shrubs",
      description: "Land-use: Public Parks and Recreation: Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Public Recreation Tree canopy",
      description: "Land-use: Public Parks and Recreation: Land-cover: Tree Canopy"
    },
    {
      field: "function",
      term: "Amenity Built",
      description: "Land-use: Amenity; Land-cover: Built"
    },
    {
      field: "function",
      term: "Amenity Water",
      description: "Land-use: Amenity; Land-cover: Water"
    },
    {
      field: "function",
      term: "Amenity Grasses",
      description: "Land-use: Amenity; Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Amenity Forbs and Shrubs",
      description: "Land-use: Amenity; Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Amenity Tree canopy",
      description: "Land-use: Amenity; Land-cover: Tree Canopy"
    },
    {
      field: "function",
      term: "Domestic Gardens Buillt",
      description: "Land-use: Domestic Gardens; Land-cover: Built"
    },
    {
      field: "function",
      term: "Domestic Gardens Water",
      description: "Land-use: Domestic Gardens; Land-cover: Water"
    },
    {
      field: "function",
      term: "Domestic Gardens Grasses",
      description: "Land-use: Domestic Gardens; Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Domestic Gardens Forbs and Shrubs",
      description: "Land-use: Domestic Gardens; Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Domestic Gardens Tree canopy",
      description: "Land-use: Domestic Gardens; Land-cover: Tree Canopy"
    },
    {
      field: "function",
      term: "Institutional Built",
      description: "Land-use: Institutional Land; Land-cover: Built"
    },
    {
      field: "function",
      term: "Institutional Water",
      description: "Land-use: Institutional Land; Land-cover: Water"
    },
    {
      field: "function",
      term: "Institutional Grasses",
      description: "Land-use: Institutional Land; Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Institutional Forbs and shrubs",
      description: "Land-use: Institutional Land; Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Institutional Tree canopy",
      description: "Land-use: Institutional Land; Land-cover: Tree Canopy"
    },
    {
      field: "function",
      term: "Previously Developed Built",
      description: "Land-use: Previously developed; Land-cover: Built"
    },
    {
      field: "function",
      term: "Previously Developed Water",
      description: "Land-use: Previously developed; Land-cover: Water"
    },
    {
      field: "function",
      term: "Previously Developed Grasses",
      description: "Land-use: Previously developed; Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Previously Developed Forbs",
      description: "Land-use: Previously developed; Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Previously Developed Tree canopy",
      description: "Land-use: Previously developed; Land-cover: Tree Canopy"
    },
    {
      field: "function",
      term: "Peri-urban Built",
      description: "Land-use: Peri-urban; Land-cover: Built"
    },
    {
      field: "function",
      term: "Peri-urban Water",
      description: "Land-use: Peri-urban; Land-cover: Water"
    },
    {
      field: "function",
      term: "Peri-urban Grasses",
      description: "Land-use: Peri-urban; Land-cover: Grasses"
    },
    {
      field: "function",
      term: "Peri-urban Forbs and shrubs",
      description: "Land-use: Peri-urban; Land-cover: Forbs and Shrubs"
    },
    {
      field: "function",
      term: "Peri-urban Tree canopy",
      description: "Land-use: Peri-urban; Land-cover: Tree Canopy"
    }
  ],

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
