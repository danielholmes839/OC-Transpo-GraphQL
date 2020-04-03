const { GraphQLScalarType } = require('graphql');

const createParameter = (name, value) => {
    /* Create a URL parameter */
    return `&${name}=${value}`;
}

const createMarker = (colour, size, text, lat, lon) => {
    /* Create a map marker */
    return `&markers=color:${colour}|size:${size}|label:${text}|${lat},${lon}`;
}

const serialize = (map) => {
    /* Serialize a map object as a string 
    map {
        stop { lat, lon }
        bus [ lat, lon, direction ]
    }
    */
    let url = `https://maps.googleapis.com/maps/api/staticmap?key=${process.env.maps}`;
    url += createParameter('center', `${map.stop.lat},${map.stop.lon}`);
    url += createParameter('size', '800x400');
    url += createParameter('zoom', 12);

    url += createMarker('blue', 'mid', 'S', map.stop.lat, map.stop.lon);
    for (let bus of map.buses) {
        url += createMarker('red', 'mid', bus.direction.toString(), bus.lat, bus.lon);
    }
    return encodeURI(url);
}

module.exports = new GraphQLScalarType({
    name: 'Map',
    description: 'Google Maps Static API Url',
    serialize
});