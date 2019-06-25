
/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const restifyPlugins = require('restify').plugins;

/**
 * Initialize Server.
 */
const server = restify.createServer({
  name: config.name,
  version: config.version,
});

/**
 * Middleware.
 */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
 * Start Server, Connect to DB & Require Routes.
 */
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
