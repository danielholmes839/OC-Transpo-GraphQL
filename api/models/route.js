const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const routeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    routeType: {
        type: Number,
        required: true
    },

    colour: {
        type: String,
        required: false
    },

    textColour: {
        type: String,
        required: false
    },

    stops: [
        {
            type: String,
            ref: 'Stop'
        }
    ],

    trips: [
        {
            type: String,
            ref: 'Trip'
        }
    ]
});

module.exports = mongoose.model('Route', routeSchema);