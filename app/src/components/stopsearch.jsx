import React, { Component } from 'react';
import { gql } from 'apollo-boost';


const createQuery = (text) => {
    return gql`
    stopSearch(name: ${text}, limit: 5) {
        id
        name
        stopRoutes {
            id
            headsign
            number
        }
      }
    `
}
class StopSearch extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            stopRoutePreviews: [],
            searchText: ""
        };
    }

    update() {
        console.log('update');
    }
    handleChange(event) {
        this.setState({searchText: event.target.value});
    }

    render() { 
        return (
            <div>
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Stop Search</label>
                        <input type="text" class="form-control" onChange={this.handleChange} placeholder="Search"/>
                    </div>
                </form>
            </div>
        );
    }
}
 
export default StopSearch;