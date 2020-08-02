/* Distance */
import { GraphQLScalarType } from 'graphql';

const serialize = (distanceKM: number | null): string => {
    /* 
        Distances
        0.5 -> '500m',
        1.68 -> '1.7km'
    */
    if (distanceKM == null) {
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