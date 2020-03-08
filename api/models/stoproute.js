const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stopRouteSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    route: {
        type: String,
        ref: 'Route'
    },

    stop: {
        type: String,
        ref: 'Stop'
    },

    stopTimes: [
        {
            type: String,
            ref: 'StopTime'
        }
    ]
});

module.exports = mongoose.model('StopRoute', stopRouteSchema);