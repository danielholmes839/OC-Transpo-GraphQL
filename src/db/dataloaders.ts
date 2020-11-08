import DataLoader from 'dataloader';
import { Model, Document } from 'mongoose';

import {
    FavouriteStopModel, RouteModel, ServiceModel, ServiceExceptionModel, StopModel,
    StopRouteModel, StopTimeModel, TripModel, UserModel
} from './models'

import { Stop, StopRoute, Route, Service, ServiceException, StopTime, Trip, User, FavouriteStop } from 'types'

type Result<T> = T | Error;
type Batch<T> = Result<T>[];
type Config<T> = DataLoader.Options<string, T>;


const populate = async <T extends Document>(ids: string[], model: Model<T>): Promise<Batch<T>> => {
    /*  Populates documents in a MongoDB collection (Needs to sort the documents) */
    let temp = {};
    let documents = await model.find(<any>{ _id: { $in: ids } });
    documents.forEach(document => temp[document._id] = document);
    return ids.map(id => (temp[id] == null) ? new Error(`Could not find ${model.modelName}:${id}`) : temp[id]);
};

const authorize = <T extends Document>(document: Result<T>, userId: string, ownerId: (document: T) => string): Result<T> => {
    /* Compare the document user/owner ID with the authenticated user ID */
    if (document instanceof Error) { return document; }
    let authorized: boolean = userId == ownerId(document);
    return authorized ? document : new Error('Authorization Required');
}

const createDataLoader = <T extends Document>(model: Model<T>, config: Config<T> = { cache: true }): DataLoader<string, T> => {
    /* 
        Create dataloaders for MongoDB collections 
    */
    let batchLoadFn = async (ids: string[]): Promise<Batch<T>> => populate(ids, model);
    return new DataLoader<string, T>(batchLoadFn, config);
}

const createAuthDataLoader = <T extends Document>(userId: string, ownerId: (document: T) => string, model: Model<T>, config: Config<T> = { cache: false }): DataLoader<string, T> => {
    /* 
        Create dataloaders for MongoDB collections 
        And ensure that the requested documents belong to the user 
    */
    return new DataLoader<string, T>(async (ids: string[]): Promise<Result<T>[]> => {
        const documents = await populate<T>(ids, model);
        return documents.map(document => authorize(document, userId, ownerId));
    }, config);
}


type OpenLoaders = {
    // All DataLoaders that do not require authentication
    routeLoader: DataLoader<string, Route>;
    stopLoader: DataLoader<string, Stop>;
    stopRouteLoader: DataLoader<string, StopRoute>;
    stopTimeLoader: DataLoader<string, StopTime>;
    tripLoader: DataLoader<string, Trip>;
    serviceLoader: DataLoader<string, Service>;
    serviceExceptionLoader: DataLoader<string, ServiceException>;
}

type AuthLoaders = {
    // All DataLoaders that require authentication
    userLoader: DataLoader<string, User>;
    favouriteStopLoader: DataLoader<string, FavouriteStop>;
}

type DataLoaders = {
    // All DataLoaders
    routeLoader: DataLoader<string, Route>;
    stopLoader: DataLoader<string, Stop>;
    stopRouteLoader: DataLoader<string, StopRoute>;
    stopTimeLoader: DataLoader<string, StopTime>;
    tripLoader: DataLoader<string, Trip>;
    serviceLoader: DataLoader<string, Service>;
    serviceExceptionLoader: DataLoader<string, ServiceException>;
    userLoader?: DataLoader<string, User>;
    favouriteStopLoader?: DataLoader<string, FavouriteStop>;
}

const createAuthLoaders = (userId: string): AuthLoaders => {
    /* Dataloaders for documents that require authentication (must belong to the authenticated user) */
    return {
        userLoader: createAuthDataLoader<User>(userId, (document) => document.id, UserModel),
        favouriteStopLoader: createAuthDataLoader<FavouriteStop>(userId, (document) => document.user, FavouriteStopModel)
    }
};

const createOpenLoaders = (): OpenLoaders => {
    /* Dataloaders for documents that do not require authentication */
    return {
        routeLoader: createDataLoader<Route>(RouteModel),
        stopLoader: createDataLoader<Stop>(StopModel),
        stopRouteLoader: createDataLoader<StopRoute>(StopRouteModel),
        stopTimeLoader: createDataLoader<StopTime>(StopTimeModel),
        tripLoader: createDataLoader<Trip>(TripModel),
        serviceLoader: createDataLoader<Service>(ServiceModel),
        serviceExceptionLoader: createDataLoader<ServiceException>(ServiceExceptionModel)
    }
}

const createDataLoaders = (authenticated: boolean, user: string): DataLoaders => {
    /* Create all DataLoaders */
    if (authenticated && (user != null)) {
        return {
            ...createAuthLoaders(user),
            ...createOpenLoaders()
        }
    } else {
        return createOpenLoaders();
    }
}

export { createDataLoaders, DataLoaders };