import DataLoader from 'dataloader';
import { Model, Document } from 'mongoose';

import { 
    User, FavouriteStop, Route, Stop, StopRoute, StopTime, Trip, Service, ServiceException
} from './types';

import {
    UserCollection, FavouriteStopCollection, RouteCollection, StopCollection, StopRouteCollection, StopTimeCollection, TripCollection, ServiceCollection, ServiceExceptionCollection
} from './collections';


const populate = async <T extends Document>(ids: string[], collection: Model<T>): Promise<(T | Error)[]> => {
    /* 
    Get multiple documents of type T from a collection of type T 
    Returned list is in the same order as ids and missing/non existent
    */
    console.log(`Populating ${ids.length} ${collection.modelName}`);
    let query: any = { _id: { $in: ids } };
    let documents: T[] = await collection.find(query);
    let sortedDocuments: (T | Error)[] = [];

    // "re-sorting" by ids
    let o = {};
    for (let document of documents) { 
        o[document._id] = document 
    }

    for (let id of ids) {
        if (o[id]) sortedDocuments.push(o[id]);
        else sortedDocuments.push(new Error(`Could not find ${collection.modelName}:${id}`));
    }
    return sortedDocuments;
};

const createDataLoader = <T extends Document>(collection: Model<T>, config: DataLoader.Options<string, T> = { cache: true }): DataLoader<string, T> => {
    /* Function that creates dataloaders for MongoDB collections */
    return new DataLoader(async (ids: string[]): Promise<(T | Error)[]> => {
        return populate<T>(ids, collection);
    }, config)
}

/* Create a DataLoader for every collection in Mongodb */
const userLoader = createDataLoader<User>(UserCollection, { cache: false });
const favouriteStopLoader = createDataLoader<FavouriteStop>(FavouriteStopCollection, { cache: false });
const routeLoader = createDataLoader<Route>(RouteCollection);
const stopLoader = createDataLoader<Stop>(StopCollection);
const stopRouteLoader = createDataLoader<StopRoute>(StopRouteCollection);
const stopTimeLoader = createDataLoader<StopTime>(StopTimeCollection);
const tripLoader = createDataLoader<Trip>(TripCollection);
const serviceLoader = createDataLoader<Service>(ServiceCollection);
const serviceExceptionLoader = createDataLoader<ServiceException>(ServiceExceptionCollection);

export {
    userLoader, favouriteStopLoader, routeLoader, stopLoader, stopRouteLoader,
    stopTimeLoader, tripLoader, serviceLoader, serviceExceptionLoader
}; 