const Stop = require('../../models/stop');
const { transformStop } = require('./merge');

var stopResolvers = {
    getStops: async () => {
        let stops = await Stop.find();
        stops = stops.map(stop => {
            return transformStop(stop);
        });
        return stops;
    },

    createStop: async (args) => {
        const stop = new Stop({ ...args.stopInput });
        await stop.save();
        return transformStop(stop);
    }
};

module.exports = stopResolvers;