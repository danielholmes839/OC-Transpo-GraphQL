import env_config from './config';
env_config();

import fs from 'fs';
import { connect, Model, Document } from 'mongoose'
import { Stop, StopRoute, Route, StopTime, Trip, Service, ServiceException } from 'api/types';
import { StopModel, StopRouteModel, RouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel } from 'api/models';

let config = {
    input: './data/database',
    models: [StopModel, StopRouteModel, RouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel],
    file: ['STOPS.json', 'STOP_ROUTES.json', 'ROUTES.json', 'STOP_TIMES.json', 'TRIPS.json', 'SERVICES.json', 'SERVICE_EXCEPTIONS.json']
}

const connectDB = async () => {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}

const insert = async <T extends Document>(data: T[], model: Model<T>) => {
    console.log(model.name, data.length)
    let chunk_size = 5000;
    for (let i = 0; i < data.length; i += chunk_size) {
        console.log(i);
        let slice: T[] = data.slice(i, i + chunk_size)
        await model.insertMany(slice);
    }
}

const read = <T extends Document>(file: string): T[] => {
    return <T[]>JSON.parse(fs.readFileSync(`${config.input}/${file}`).toString()).data;
}

const main = async () => {
    await connectDB();

    let routes: Route[] = read('ROUTES.json');
    RouteModel.collection.drop();
    await insert(routes, RouteModel);

    let services = read<Service>('SERVICES.json');
    ServiceModel.collection.drop();
    await insert(services, ServiceModel);

    let service_exceptions = read<ServiceException>('SERVICE_EXCEPTIONS.json');
    ServiceExceptionModel.collection.drop();
    await insert(service_exceptions, ServiceExceptionModel);

    let stop_routes = read<StopRoute>('STOP_ROUTES.json');
    StopRouteModel.collection.drop();
    await insert(stop_routes, StopRouteModel);

    let stops = read<Stop>('STOPS.json');
    StopModel.collection.drop();
    await insert(stops, StopModel);

    let trips = read<Trip>('TRIPS.json');
    TripModel.collection.drop();
    await insert(trips, TripModel);

    let stop_times = read<StopTime>('STOP_TIMES.json');
    StopTimeModel.collection.drop();
    await insert(stop_times, StopTimeModel);

    console.log('Finished uploading');
}

main();