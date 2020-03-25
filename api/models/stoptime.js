const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stopTimeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    sequence: {
        type: Number,
        required: true
    },

    time: {
        hour: {
            type: Number,
            required: true
        },

        minute: {
            type: Number,
            required: true
        },

        string: {
            type: String,
            required: true
        },

        int: {
            type: Number,
            required: true
        }
    },

    trip: {
        type: String,
        ref: 'Trip'
    },

    stop: {
        type: String,
        ref: 'Stop'
    }
});

module.exports = mongoose.model('StopTime', stopTimeSchema);