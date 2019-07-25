
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            config.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 16/07/2019.
//  Updated:         Vasilis Vlastaras (@gisvlasta), 21/07/2019.
//                   Vasilis Vlastaras (@gisvlasta), 25/07/2019.
// ================================================================================

/**
 * The configuration of the server.
 */
module.exports = {
  name: 'GHIA Raster Server',
  version: '1.1.0',
  //env: process.env.NODE_ENV || 'development',
  env: 'production',
  port: process.env.PORT || 8083,
  base_url: process.env.BASE_URL || 'http://localhost'
};
