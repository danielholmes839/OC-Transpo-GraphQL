const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const serviceSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    startDate: {
        type: String,
        required: true
    },

    endDate: {
        type: String,
        required: true
    },

    trips: [
        {
            type: String,
            ref: 'Trip'
        }
    ],

    monday: {
        type: Boolean,
        required: true
    },

    tuesday: {
        type: Boolean,
        required: true
    },

    wednesday: {
        type: Boolean,
        required: true
    },

    thursday: {
        type: Boolean,
        required: true
    },

    friday: {
        type: Boolean,
        required: true
    },

    saturday: {
        type: Boolean,
        required: true
    },

    sunday: {
        type: Boolean,
        required: true
    },

});

module.exports = mongoose.model('Service', serviceSchema);