const Trip = require('../../models/trip');
const { transformTrip } = require('./merge');

var tripResolvers = {
    getTrips: async () => {
        let trips = await Trip.find();
        trips = trips.map(trip => {
            return transformTrip(trip);
        });
        return trips;
    },

    getTrip: async ({ _id }) => {
        let trip = await Trip.findById(_id);
        let transformed = await transformTrip(trip);
        console.log(transformed);
        return transformed;
    }
};

module.exports = tripResolvers;