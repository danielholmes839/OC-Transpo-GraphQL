import React, { Component } from 'react';
import Route from './route';

class Stop extends Component {
    render() { 
        return (
            <div class="card mb-3">
                <div class="card-body">
                    <h5>{this.props.data.name}</h5>
                    <hr />
                    <div class="row">    
                        {this.props.data.getRoutes.map(route => <Route data={route} />)}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Stop;