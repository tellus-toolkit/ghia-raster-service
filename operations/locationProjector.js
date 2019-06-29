
const proj4 = require('proj4');
const Location = require('../models/location');
const projections = require('../models/projections');


const LocationProjector = {

  fromProjection: 'wgs84',

  toProjection: 'osgb36',

  project:  function(location) {

    let projectedLocation = new Location();

    projectedLocation.coordinates = proj4(
      projections[this.fromProjection],
      projections[this.toProjection],
      [location.coordinates[0], location.coordinates[1]]
    );

    return projectedLocation;

  }


};

module.exports = LocationProjector;
