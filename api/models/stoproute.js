const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stopRouteSchema = new Schema({
    route: {
        type: String,
        ref: 'Route'
    },

    stop: {
        type: String,
        ref: 'Stop'
    },

    stoptimes: [
        {
            type: String,
            ref: 'StopTime'
        }
    ]
});

module.exports = mongoose.model('StopRoute', stopRouteSchema);