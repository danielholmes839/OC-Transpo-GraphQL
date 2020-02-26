const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tripSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    headsign: {
        type: String,
        required: true
    },

    direction: {
        type: Number,
        required: true
    },

    route: {
        type: String,
        ref: 'Route'
    },

    service: {
        type: String,
        ref: 'Service'
    },

    stopTimes: [
        {
            type: String,
            ref: 'StopTime'
        }
    ]
});

module.exports = mongoose.model('Trip', tripSchema);