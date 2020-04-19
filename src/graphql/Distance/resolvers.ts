import { GraphQLScalarType } from 'graphql';
import { isNull } from 'util';

const serialize = (distanceKM: number): string => {
    if (isNull(distanceKM)) {
        return null;
    } else if (distanceKM >= 1) {
        return distanceKM.toFixed(1) + 'km';
    }
    return (distanceKM * 1000).toFixed(0) + 'm';
}

export default new GraphQLScalarType({
    name: 'Distance',
    description: 'string representing distance with units in km or m',
    serialize
});