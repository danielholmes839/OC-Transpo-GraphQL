const mongoose = require('mongoose');
const date = require('./Date');

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