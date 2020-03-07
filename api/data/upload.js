const fs = require('fs');
const mongoose = require('mongoose');
const { Trip, Stop, Route, StopTime } = require('../models/index');
const { routes, trips, stopTimes, stops } = require('./files');

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
        console.log(i);
    }
}

async function process() {
    await mongoose.connect(uri);

    await Trip.insertMany(trips.data);
    console.log('Uploaded Trips');

    await Route.insertMany(routes.data);
    console.log('Uploaded Routes');

    await Stop.insertMany(stops.data);
    console.log('Uploaded Stops');

    await insertManyByChunk(stopTimes.data, 5000, StopTime);
    console.log('Uploaded Stop Times');

    console.log('Uploaded All Data');

    await mongoose.disconnect();
}

process();