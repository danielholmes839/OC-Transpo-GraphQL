const fs = require('fs');
const mongoose = require('mongoose');
const { Trip, Stop, Route, StopTime } = require('../models/index');
const { routes, trips, stopTimes, stops } = require('./files');
console.log('Loaded Data');

mongoose.connection.on('connected', function () {
    console.log('Successfully Connected');
});

mongoose.connection.on('disconnected', function () {
    console.log('Successfully Disconnected');
});

async function insertManyByChunk(data, chunk, Table) {
    var i, j, temp;
    for (i = 0, j = data.length; i < j; i += chunk) {
        temp = data.slice(i, i + chunk);
        await Table.insertMany(temp);
    }
}

async function process() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-u99zs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`);
    await Trip.insertMany(trips.data);
    await Route.insertMany(routes.data);
    await Stop.insertMany(stops.data);
    await insertManyByChunk(stopTimes.data, 5000, StopTime);
    console.log('Uploaded All Data');

    await mongoose.disconnect();
}

process();