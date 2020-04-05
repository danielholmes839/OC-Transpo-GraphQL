import React, { Component } from 'react';
import RouteBadge from './routebadge';


const Title = ({ stopRoute }) => {
    return (
        <React.Fragment>
            <h4 className="lead"><RouteBadge route={stopRoute.route} /> {stopRoute.headsign}</h4>
            <hr />
        </React.Fragment>
    )
}

const StopRoute = ({ stopRoute }) => {
    if (stopRoute.nextStopTimes.length > 0) {
        return (
            <div className="col-lg-4 col-sm-12">
                <div className="bg-white rounded shadow-lg my-3 p-3">
                    <Title stopRoute={stopRoute}/>
                    <h4 className="lead">Next Trip: {stopRoute.nextStopTimes.map(stopTime => stopTime.time.string + " ")}</h4>
                </div>
            </div>
        )
    } else {
        return (
            <div className="col-lg-4 col-sm-12">
                <div className="bg-white rounded shadow-lg my-3 p-3">
                    <Title stopRoute={stopRoute}/>
                    <h4 className="lead">No Trips today</h4>
                </div>
            </div>
        )
    }

}

export default StopRoute;