import React, { Component } from 'react';

class StopRoute extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="col-lg-4 col-sm-12">
                    <div className="bg-white shadow-lg p-3 rounded mb-3">
                        <h4 className="lead">
                            <span className="badge mr-2" style={{
                                backgroundColor: '#' + this.props.data.route.colour,
                                color: '#' + this.props.data.route.textColour
                            }}>{this.props.data.number}</span> {this.props.data.headsign}</h4>
                        <p>Next Stop: {this.props.data.nextStopTime.time.string}</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default StopRoute;