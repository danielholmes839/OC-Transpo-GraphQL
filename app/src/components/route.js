import React, { Component } from 'react';

class Route extends Component {
    render() { 
        return (
            
            <div className="col-lg-3 col-md-4 col-sm-6">
                <h6> 
                    <span className="badge text-white mr-2 text-outline" style={{backgroundColor: '#'+this.props.data.colour}}>
                        {this.props.data.number}
                    </span>
                    {this.props.data.name} - {this.props.data.type} 
                </h6>
                
                <p>Next Stop: {this.props.data.getNextStopTime.time}</p>
            </div>
        );
    }
}
 
export default Route;