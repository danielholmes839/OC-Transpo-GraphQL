import DataLoader from 'dataloader';
import { Model, Document } from 'mongoose';

import { 
    User, FavouriteStop, Route, Stop, StopRoute, StopTime, Trip, Service, ServiceException
} from './types';

import {
    UserModel, FavouriteStopModel, RouteModel, StopModel, 
    StopRouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel
} from './models';


const populate = async <T extends Document>(ids: string[], model: Model<T>): Promise<(T | Error)[]> => {
    /* 
    Get multiple documents of type T from a model of type T 
    Returned list is in the same order as ids and missing/non existent
    */
    console.log(`Populating ${ids.length} ${model.modelName}`);
    let query: any = { _id: { $in: ids } };
    let documents: T[] = await model.find(query);
    let sortedDocuments: (T | Error)[] = [];

    // "re-sorting" by ids
    let o = {};
    for (let document of documents) { 
        o[document._id] = document 
    }

    for (let id of ids) {
        if (o[id]) sortedDocuments.push(o[id]);
        else sortedDocuments.push(new Error(`Could not find ${model.modelName}:${id}`));
    }
    return sortedDocuments;
};

const createDataLoader = <T extends Document>(model: Model<T>, config: DataLoader.Options<string, T> = { cache: true }): DataLoader<string, T> => {
    /* Function that creates dataloaders for MongoDB collections */
    return new DataLoader(async (ids: string[]): Promise<(T | Error)[]> => {
        return populate<T>(ids, model);
    }, config)
}

/* Create a DataLoader for every collection in Mongodb */
const userLoader = createDataLoader<User>(UserModel, { cache: false });
const favouriteStopLoader = createDataLoader<FavouriteStop>(FavouriteStopModel, { cache: false });
const routeLoader = createDataLoader<Route>(RouteModel);
const stopLoader = createDataLoader<Stop>(StopModel);
const stopRouteLoader = createDataLoader<StopRoute>(StopRouteModel);
const stopTimeLoader = createDataLoader<StopTime>(StopTimeModel);
const tripLoader = createDataLoader<Trip>(TripModel);
const serviceLoader = createDataLoader<Service>(ServiceModel);
const serviceExceptionLoader = createDataLoader<ServiceException>(ServiceExceptionModel);

export {
    userLoader, favouriteStopLoader, routeLoader, stopLoader, stopRouteLoader,
    stopTimeLoader, tripLoader, serviceLoader, serviceExceptionLoader
}; 