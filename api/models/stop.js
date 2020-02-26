const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stopSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    },

    lat: {
        type: Number,
        required: true
    },

    lon: {
        type: Number,
        required: true
    },

    routes: [
        {
            type: String,
            ref: 'Route'
        }
    ],

    stopRoutes: [
        {
            type: String,
            ref: 'StopRoute'
        }
    ]

});

module.exports = mongoose.model('Stop', stopSchema);