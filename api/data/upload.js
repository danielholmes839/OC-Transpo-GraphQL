const mongoose = require('mongoose');
const { Trip, Stop, Route, StopTime, StopRoute, Service, ServiceException } = require('../models/index');
const { routes, trips, stopTimes, stops, stopRoutes, service, serviceExceptions } = require('./files');

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
    try {
        await mongoose.connect(uri);
    } catch {
        console.log('Could not connect to MONGODB');
    }
    

    await Trip.insertMany(trips.data);
    console.log('Uploaded Trips');

    await Route.insertMany(routes.data);
    console.log('Uploaded Routes');

    await insertManyByChunk(stopTimes.data, 5000, StopTime);
    console.log('Uploaded Stop Times');

    await Stop.insertMany(stops.data);
    console.log('Uploaded Stops');

    await Service.insertMany(service.data);
    console.log('Uploaded Service');

    await ServiceException.insertMany(serviceExceptions.data);
    console.log('Uploaded Service Exceptions');

    await insertManyByChunk(stopRoutes.data, 3000, StopRoute);
    console.log('Uploaded Stop Routes');


    console.log('Uploaded All Data');

    await mongoose.disconnect();
}

process();