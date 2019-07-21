
// ================================================================================
//  TellUs Toolkit Ltd.
//  https://www.tellus-toolkit.com/
//
//  Name:            ghia-raster-server.js
//  Original coding: Vasilis Vlastaras (@gisvlasta), 16/07/2019.
//  Updated:         Vasilis Vlastaras (@gisvlasta), 21/07/2019.
//                   Added CORS Access-Control-Allow-Origin for all possible clients.
// ================================================================================

/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const restifyPlugins = require('restify').plugins;
const rasterReader = require('./operations/rasterReader.js');
const rasterLocator = require('./operations/rasterLocator.js');

// Open the raster.
let raster = rasterReader.open();

// Set up the RasterLocator used to locate the cells and tiles of the raster.
rasterLocator.raster = raster;

// Initialize Server.
const server = restify.createServer({
  name: config.name,
  version: config.version,
});

// Middleware.
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

// Start server and require routes.
server.listen(config.port, () => {

  require('./routes')(server);

  var now = new Date().toISOString();

  console.log('');
  console.log('--------------------------------------------------------------------------------');
  console.log(`${config.name}.`);
  console.log(`Version ${config.version}`);
  console.log('Server up and running on ' + now);
  console.log(`Waiting for requests on port ${config.port}...`);
  console.log('--------------------------------------------------------------------------------');
  console.log('');
  console.log('');

});
