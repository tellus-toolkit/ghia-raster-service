
module.exports = {
  name: 'GHIA Raster Server',
  version: '0.1.0',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8082,
  base_url: process.env.BASE_URL || 'http://localhost'
};
