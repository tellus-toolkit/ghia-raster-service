
// /**
//  * Represents a location either on a planar or a spheroid surface.
//  *
//  * @type {{coordinates: number[]}}
//  */
// let Location = {
//
//   /**
//    * The coordinates of the location hold in a one dimension array having 2 elements.
//    *
//    * It is expected that the first element of the array represents the x or the longitude for planar or
//    * spheroid locations respectively, while the the second element of the array represents the y or latitude
//    * for planar or spheroid locations respectively.
//    */
//   coordinates: [0, 0]
//
// };
//
// module.exports = Location;

class Location {

  constructor(x, y) {
    this.coordinates = [x, y];
  }

};

module.exports = Location;


