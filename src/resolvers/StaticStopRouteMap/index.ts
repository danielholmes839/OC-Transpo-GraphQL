import { GraphQLScalarType } from 'graphql';
import StaticMap from './StaticMap';
import StaticStopRouteMap from './StaticStopRouteMap';

const serialize = (map: StaticMap): string => {
    return map.serialize();
}

// StaticStopRouteMap Scalar Type
const Scalar = new GraphQLScalarType({
    name: 'StaticStopRouteMap',
    description: 'Static Google Map for Stop Routes',
    serialize
});

export { StaticStopRouteMap }
export default Scalar