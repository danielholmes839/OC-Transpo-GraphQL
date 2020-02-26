const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favouriteStops: [
        {
            type: Schema.Types.ObjectId,
            ref: 'StopRoute'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);