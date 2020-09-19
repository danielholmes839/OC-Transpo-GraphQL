import DataLoader from 'dataloader';
import { Model, Document } from 'mongoose';
import { User, FavouriteStop, Route, Stop, StopRoute, StopTime, Trip, Service, ServiceException } from './types';
import { UserModel, FavouriteStopModel, RouteModel, StopModel, StopRouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel } from './models';

type Result<T> = T | Error;  // Makes it a bit easier to read the code

const populate = async <T extends Document>(ids: string[], model: Model<T>): Promise<Result<T>[]> => {
    /*  Populates documents in a MongoDB collection (Needs to sort the documents) */
    console.log(`Populating ${ids.length} ${model.modelName}`);
    let temp = {};
    (await model.find(<any>{ _id: { $in: ids } })).forEach(document => temp[document._id] = document);
    return ids.map(id => (temp[id] == null) ? new Error(`Could not find ${model.modelName}:${id}`) : temp[id]);
};

const authorizeDocument = <T extends Document>(document: Result<T>, userId: string, ownerId: (document: T) => string): Result<T> => {
    /* Compare the document user/owner ID with the authenticated user ID */
    if (document instanceof Error) { return document; }
    let authorized: boolean = userId == ownerId(document);
    return authorized ? document : new Error('Authorization Required');
}

const createDataLoader = <T extends Document>(model: Model<T>, config: DataLoader.Options<string, T> = { cache: true }): DataLoader<string, T> => {
    /* Create dataloaders for MongoDB collections */
    let batchLoad = async (ids: string[]): Promise<Result<T>[]> => populate<T>(ids, model);
    return new DataLoader<string, T>(batchLoad, config);
}

const createAuthDataLoader = <T extends Document>(user: string, ownerId: (document: T) => string, model: Model<T>, config: DataLoader.Options<string, T> = { cache: false }): DataLoader<string, T> => {
    /* 
        Create dataloaders for MongoDB collections 
        And ensure that the requested documents belong to the user 
    */
    return new DataLoader<string, T>(async (ids: string[]): Promise<Result<T>[]> => {
        const documents = await populate<T>(ids, model);
        return documents.map(document => authorizeDocument(document, user, ownerId));
    }, config);
}

type OpenLoaders = {
    routeLoader: DataLoader<string, Route>;
    stopLoader: DataLoader<string, Stop>;
    stopRouteLoader: DataLoader<string, StopRoute>;
    stopTimeLoader: DataLoader<string, StopTime>;
    tripLoader: DataLoader<string, Trip>;
    serviceLoader: DataLoader<string, Service>;
    serviceExceptionLoader: DataLoader<string, ServiceException>;
}

type AuthLoaders = {
    userLoader: DataLoader<string, User>;
    favouriteStopLoader: DataLoader<string, FavouriteStop>;
}

type Loaders = {
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

const createAuthLoaders = (user: string): AuthLoaders => {
    /* Loader for documents that require authentication (belong to the authenticated user) */
    return {
        userLoader: createAuthDataLoader<User>(user, (document) => document.id, UserModel),
        favouriteStopLoader: createAuthDataLoader<FavouriteStop>(user, (document) => document.user, FavouriteStopModel)
    }
};

const createOpenLoaders = (): OpenLoaders => {
    /* Loader for documents that */
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

const createLoaders = (authenticated: boolean, user: string): Loaders => {
    /* Create Loaders */
    if (authenticated && (user != null)) {
        return {
            ...createAuthLoaders(user),
            ...createOpenLoaders()
        }
    } else {
        return createOpenLoaders();
    }
}

export { createLoaders, Loaders }