
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
// TODO: Experiment with CORS by checking the following:
// https://stackoverflow.com/questions/14338683/how-can-i-support-cors-when-using-restify
// https://github.com/Tabcorp/restify-cors-middleware
// https://codepunk.io/using-cors-with-restify-in-nodejs/
// https://www.npmjs.com/package/restify-cors-middleware
// https://www.google.com/search?q=restify+CORS&rlz=1C1GCEU_en&oq=restify+CORS&aqs=chrome..69i57.5679j0j7&sourceid=chrome&ie=UTF-8
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
