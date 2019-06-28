
const proj4 = require('proj4');
const Location = require('../models/location');
const projections = require('../models/projections');
const jsts = require('jsts');



const LocationProjector = {

  fromProjection: 'wgs84',

  toProjection: 'osgb36',

  project:  function(location) {

    //let projectedLocation = new Location();
    let point1 = new jsts.geom.Point();
    point1.x = 46;
    point1.y = 68;
    //let point2 = new Point();

    // projectedLocation.coordinates = proj4(
    //   projections[this.fromProjection],
    //   projections[this.toProjection],
    //   [location.coordinates[0], location.coordinates[1]]
    // );

    //return projectedLocation;
    return point1;

  }


};

module.exports = LocationProjector;
