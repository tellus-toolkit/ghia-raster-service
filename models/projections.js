
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            projections.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 29/06/2019.
// ================================================================================

/**
 * The named projections used in the application.
 *
 * @type {{wgs84: string, osgb36: string}}
 */
const Projections = {

  /**
   * The wgs84 projection definition.
   */
  wgs84: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',

  /**
   * The OSGB36 projection definition.
   */
  osgb36: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs'

};

module.exports = Projections;
