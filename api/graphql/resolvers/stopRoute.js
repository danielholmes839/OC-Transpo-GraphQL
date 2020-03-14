const { populateStop, populateRoute, populateStopTimes, populateStopTime } = require('./populate');

const resolvers = {
    StopRoute: {
        stop: populateStop,
        route: populateRoute,
        stopTimes: populateStopTimes,
        nextStopTime: async (parent, args, context) => {
            // Not Implemented
            return await populateStopTime({ stopTime: parent.stopTimes[0] });
        }
    }
}

module.exports = resolvers;