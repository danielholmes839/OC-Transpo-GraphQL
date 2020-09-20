import env_config from './config';
env_config();

import fs from 'fs';
import { connect, Model, Document } from 'mongoose'
import { Stop, StopRoute, Route, StopTime, Trip, Service, ServiceException } from 'api/types';
import { StopModel, StopRouteModel, RouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel } from 'api/models';

let config = {
    input: './data',
    models: [StopModel, StopRouteModel, RouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel],
    file: ['STOPS.json', 'STOP_ROUTES.json', 'ROUTES.json', 'STOP_TIMES.json', 'TRIPS.json', 'SERVICES.json', 'SERVICE_EXCEPTIONS.json']
}

const connectDB = async () => {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}

const delete_collection = async <T extends Document>(model: Model<T>) => {
    try {
        await model.collection.drop();
    } catch (error) {
        console.log(`Could not delete ${model.modelName} - don't worry though`);
    }
}

const insert = async <T extends Document>(data: T[], model: Model<T>) => {
    console.log(model.collection.name, data.length)
    let chunk_size = 5000;
    for (let i = 0; i < data.length; i += chunk_size) {
        console.log(i);
        let slice: T[] = data.slice(i, i + chunk_size)
        try {
            await model.insertMany(slice);
        } catch (error) {
            console.log(error);
        }

    }
}

const read = <T extends Document>(file: string): T[] => {
    return <T[]>JSON.parse(fs.readFileSync(`${config.input}/${file}`).toString()).data;
}

const main = async () => {
    await connectDB();

    let routes: Route[] = read('ROUTES.json');
    delete_collection(RouteModel);
    await insert(routes, RouteModel);

    let services = read<Service>('SERVICES.json');
    delete_collection(ServiceModel);
    await insert(services, ServiceModel);

    let service_exceptions = read<ServiceException>('SERVICE_EXCEPTIONS.json');
    delete_collection(ServiceExceptionModel);
    await insert(service_exceptions, ServiceExceptionModel);

    let stop_routes = read<StopRoute>('STOP_ROUTES.json');
    delete_collection(StopRouteModel);
    await insert(stop_routes, StopRouteModel);

    let stops = read<Stop>('STOPS.json');
    delete_collection(StopModel);
    await insert(stops, StopModel);

    let trips = read<Trip>('TRIPS.json');
    delete_collection(TripModel);
    await insert(trips, TripModel);

    let stop_times = read<StopTime>('STOP_TIMES.json');
    delete_collection(StopTimeModel)
    await insert(stop_times, StopTimeModel);

    console.log('Finished uploading');
}

main();