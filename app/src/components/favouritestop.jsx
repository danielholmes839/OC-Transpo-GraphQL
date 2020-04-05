import React, { Component } from 'react';
import StopRoute from './stoproute';

const FavouriteStop = ({favouriteStop}) => {
    return (
        <div className="bg-light px-5 py-3 mb-3 shadow-sm">
            <h5 className="lead">{favouriteStop.stop.name} - {favouriteStop.stop.code}</h5>
            <hr/>
            <div className="row mb-3">
                {
                    favouriteStop.stopRoutes.map(stopRoute => <StopRoute id={stopRoute.id} key={stopRoute.id} stopRoute={stopRoute} />)
                }
            </div>  
        </div>
    )

}
 
export default FavouriteStop;