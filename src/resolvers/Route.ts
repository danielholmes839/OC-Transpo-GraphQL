import { Context } from 'middleware';
import { Route, Trip, Stop } from 'types';

const routeTypeString = {
    0: 'Street Car',
    1: 'Subway',
    2: 'Rail',
    3: 'Bus',
    4: 'Ferry',
    5: 'Cable Tram',
    6: 'Aerial Lift',
    7: 'Funicular',
    11: 'Trolleybus',
    12: 'Monorail'
};

// Route Resolvers
export default {
    trips: (parent: Route, _: void, context: Context): Promise<(Trip | Error)[]> => {
        const { tripLoader } = context.loaders;
        return tripLoader.loadMany(parent.trips);
    },
    stops: (parent: Route, _: void, context: Context): Promise<(Stop | Error)[]> => {
        const { stopLoader } = context.loaders;
        return stopLoader.loadMany(parent.stops);
    },

    type: (parent: Route): string => {
        return routeTypeString[parent.type];
    }
};