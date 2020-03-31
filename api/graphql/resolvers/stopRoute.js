const { StopTime } = require('../../models/index');
const { populateMany, docId, stopLoader, routeLoader, serviceLoader, tripLoader } = require('./loaders');
const GPSCache = require('../helpers/cache');

const intToDay = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

const compareDate = (date1, date2) => {
    if (date1.year >= date2.year && date1.month >= date2.month && date1.day >= date2.day) {
        return 1; // date1 >= date2
    } else {
        return -1; // date1 < date2
    }
}
const valid = async (stopTime, date) => {
    const day = intToDay[date.getDay()];
    const trip = await tripLoader.load(stopTime.trip);
    const service = await serviceLoader.load(trip.service);
    /* Checks if there is actually service on that day only other possible issue is service exceptions which may checked later */
    return (service[day] && compareDate(service.start, date) == -1 && compareDate(service.end, date) == 1);
};


const resolvers = {
    StopRoute: {
        id: docId,
        stop: async ({ stop }, args, context) => {
            return await stopLoader.load(stop);
        },
        route: async ({ route }, args, context) => {
            return await routeLoader.load(route);
        },
        stopTimes: async ({ stopTimes }, args, context) => {
            return await populateMany(stopTimes, StopTime);
        },
        nextStopTimes: async ({ stopTimes }, { limit }, context) => {
            if (limit === undefined) { limit = 1; }

            const now = new Date();
            const nowInt = (now.getHours() * 60) + now.getMinutes();
            const times = await populateMany(stopTimes, StopTime);

            let nextTimes = new Set();    // slightly faster to store this so that it doesn't have to check identical times
            let nextStopTimes = [];

            for (let i = 0; i < times.length && nextStopTimes.length < limit; i++) {
                if (!nextTimes.has(times[i].time.int) && times[i].time.int - nowInt > 0 && valid(times[i], now)) {
                    nextStopTimes.push(times[i])
                    nextTimes.add(times[i].time.int);
                }
            }
            return nextStopTimes;
        },

        map: async (parent, args, context) => {
            const stop = await stopLoader.load(parent.stop);
            const buses = await GPSCache.getRouteData(stop.code, parent.number);
            return { stop, buses }
        },

        gps: async (parent, args, context) => {
            const stop = await stopLoader.load(parent.stop);
            return await GPSCache.getRouteData(stop.code, parent.number);
        }
    }
}

module.exports = resolvers;