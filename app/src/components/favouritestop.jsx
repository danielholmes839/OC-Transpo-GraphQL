import React, { Component } from 'react';
import StopRoute from './stoproute';

class FavouriteStop extends Component {
    render() { 
        return ( 
            <div class="bg-light px-5 py-3 mb-3 shadow-sm">
                <h5 className="lead">{this.props.data.stop.name}</h5>
                <hr/>
                <div class="row mb-3">
                    {this.props.data.stopRoutes.map(stopRoute => <StopRoute id={stopRoute.id} key={stopRoute.id} data={stopRoute} />)}
                </div>
            </div> 
        );
    }
}
 
export default FavouriteStop;