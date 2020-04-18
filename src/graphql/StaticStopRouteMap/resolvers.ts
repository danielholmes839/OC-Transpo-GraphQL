import { GraphQLScalarType } from 'graphql';
import StaticStopRouteMap from './StaticStopRouteMap';


const serialize = (map: StaticStopRouteMap): string => {
    return map.serialize();
}

export default new GraphQLScalarType({
    name: 'StaticStopRouteMap',
    description: 'Static Google Map',
    serialize
});