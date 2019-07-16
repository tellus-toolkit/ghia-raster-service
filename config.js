
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            config.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 16/07/2019.
// ================================================================================

/**
 * The configuration of the server.
 */
module.exports = {
  name: 'GHIA Raster Server',
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8082,
  base_url: process.env.BASE_URL || 'http://localhost'
};
