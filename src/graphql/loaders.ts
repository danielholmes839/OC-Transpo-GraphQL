import * as DataLoader from 'dataloader';
import { Model, Document } from 'mongoose';

import {
    User, FavouriteStop, Route, Stop, StopRoute, StopTime, Trip,
    Service, ServiceException
} from './types';

import {
    UserCollection, FavouriteStopCollection, RouteCollection, StopCollection, StopRouteCollection, StopTimeCollection,
    TripCollection, ServiceCollection, ServiceExceptionCollection
} from './collections';


const populate = async <T extends Document>(ids: string[], collection: Model<T>): Promise<(T | Error)[]> => {
    /* 
    Get multiple documents of type T from a collection of type T 
    Returned list is in the same order as ids and missing/non existent
    */
    console.log(`Populating ${ids.length} ${collection.modelName}`);
    let query: any = { _id: { $in: ids } };
    let documents: T[] = await collection.find(query);
    let sorted_documents: (T | Error)[] = [];

    // "re-sorting" by ids
    let o = {};
    for (let document of documents) { o[document._id] = document }
    for (let id of ids) {
        if (o[id]) sorted_documents.push(o[id]);
        else sorted_documents.push(new Error(`Could not find ${collection.modelName}:${id}`));
    }
    return sorted_documents;
};

const createDataLoader = <T extends Document>(collection: Model<T>, config: DataLoader.Options<string, T> = { cache: true }): DataLoader<string, T> => {
    /* Function that creates dataloaders for MongoDB collections */
    return new DataLoader(async (ids: string[]): Promise<(T | Error)[]> => {
        return populate<T>(ids, collection);
    }, config)
}

/* Create a DataLoader for every collection in my Mongodb */
const userLoader: DataLoader<string, User> = createDataLoader<User>(UserCollection, { cache: false });
const favouriteStopLoader: DataLoader<string, FavouriteStop> = createDataLoader<FavouriteStop>(FavouriteStopCollection, { cache: false });
const routeLoader: DataLoader<string, Route> = createDataLoader<Route>(RouteCollection);
const stopLoader: DataLoader<string, Stop> = createDataLoader<Stop>(StopCollection);
const stopRouteLoader: DataLoader<string, StopRoute> = createDataLoader<StopRoute>(StopRouteCollection);
const stopTimeLoader: DataLoader<string, StopTime> = createDataLoader<StopTime>(StopTimeCollection);
const tripLoader: DataLoader<string, Trip> = createDataLoader<Trip>(TripCollection);
const serviceLoader: DataLoader<string, Service> = createDataLoader<Service>(ServiceCollection);
const serviceExceptionLoader: DataLoader<string, ServiceException> = createDataLoader<ServiceException>(ServiceExceptionCollection);

export {
    userLoader, favouriteStopLoader, routeLoader, stopLoader, stopRouteLoader,
    stopTimeLoader, tripLoader, serviceLoader, serviceExceptionLoader
}; 