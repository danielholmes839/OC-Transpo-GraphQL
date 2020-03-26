import React, { Component } from 'react';

class StopPreview extends Component {
    render() { 
        return (  
            <div>
                <h4>{this.props.data.name}</h4>
                {this.props.data.stopRoutes.map(stopRoute => {
                    <p>{stopRoute.number} - {stopRoute.headsign}</p>
                })}
            </div>
        );
    }
}
 
export default StopPreview;