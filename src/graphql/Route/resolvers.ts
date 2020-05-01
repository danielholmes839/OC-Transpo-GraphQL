import { Route, Trip, Stop } from '../types';
import { tripLoader, stopLoader } from '../loaders';

const routeTypeString = {
    0: "Street Car",
    1: "Subway",
    2: "Rail",
    3: "Bus",
    4: "Ferry",
    5: "Cable Tram",
    6: "Aerial Lift",
    7: "Funicular",
    11: "Trolleybus",
    12: "Monorail"
};

export default {
    trips: (parent: Route): Promise<(Trip | Error)[]> => {
        return tripLoader.loadMany(parent.trips);
    },
    stops: (parent: Route): Promise<(Stop | Error)[]> => {
        return stopLoader.loadMany(parent.stops);
    },

    type: (parent: Route): string => {
        return routeTypeString[parent.routeType];
    },

    textColour: (parent: Route): string => {
        return '#'+parent.textColour;
    },

    backgroundColour: (parent: Route): string => {
        return '#'+parent.colour;
    }
};