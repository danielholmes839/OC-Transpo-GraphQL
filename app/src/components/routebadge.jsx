import React from 'react';

const RouteBadge = ({ route }) => {
    return (
        <span className="badge mr-2" style={{
            backgroundColor: '#' + route.colour,
            color: '#' + route.textColour
        }}>{route.number}</span>
    )
}

export default RouteBadge;