import { GraphQLScalarType } from 'graphql';
import StaticMap from './StaticMap';

const serialize = (map: StaticMap): string => {
    return map.serialize();
}

// StaticStopRouteMap Scalar Type
const StaticStopRouteMap = new GraphQLScalarType({
    name: 'StaticStopRouteMap',
    description: 'Static Google Map for Stop Routes',
    serialize
});

// StaticTravelPlanMap Scalar Type
const StaticTravelPlanMap = new GraphQLScalarType({
    name: 'StaticTravelPlanMap',
    description: 'Static Google Map for Travel Plans',
    serialize
});

export { StaticStopRouteMap, StaticTravelPlanMap };