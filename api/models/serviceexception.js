const mongoose = require('mongoose');
const date = require('./date');

const Schema = mongoose.Schema;

const serviceExceptionSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    date: date,
    removed: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('ServiceException', serviceExceptionSchema);