import React, { Component } from 'react';

class Route extends Component {
    render() { 
        return (
            <div className="col-lg-3 col-md-4 col-sm-6">
                <h6>{this.props.data.number}: {this.props.data.name}</h6>
                <p>Next Stop: {this.props.data.getNextStopTime.time}</p>
            </div>
        );
    }
}
 
export default Route;