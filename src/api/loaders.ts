import DataLoader from 'dataloader';
import { Model, Document } from 'mongoose';

import {
    User, FavouriteStop, Route, Stop, StopRoute, StopTime, Trip, Service, ServiceException
} from './types';

import {
    UserModel, FavouriteStopModel, RouteModel, StopModel,
    StopRouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel
} from './models';


const authorize_document = <T extends Document>(document: T | Error, user: string, get_user: (document: T) => string) => {
    /* Authenticates documents to belong to the user  */
    // The document is null
    if (document instanceof Error) {
        return document;
    }

    // The document does not belong to the user
    else if (get_user(document) != user) {
        return new Error('Not authorized');
    }

    // The document is valid
    else {
        return document;
    }
}

const populate = async <T extends Document>(ids: string[], model: Model<T>): Promise<(T | Error)[]> => {
    /*  DataLoader Populate for Mongoose */
    console.log(`Populating ${ids.length} ${model.modelName}`);
    let query: any = { _id: { $in: ids } };
    let documents: T[] = await model.find(query);
    let sorted_documents: (T | Error)[] = [];

    // 're-sorting' by ids
    let o = {};
    for (let document of documents) {
        o[document._id] = document;
    }

    for (let id of ids) {
        if (o[id]) {
            sorted_documents.push(o[id]);
        }
        else {
            sorted_documents.push(new Error(`Could not find ${model.modelName}:${id}`));
        }
    }

    return sorted_documents;
};

const createDataLoader = <T extends Document>(model: Model<T>, config: DataLoader.Options<string, T> = { cache: true }): DataLoader<string, T> => {
    /* Function that creates dataloaders for MongoDB collections */
    return new DataLoader(async (ids: string[]): Promise<(T | Error)[]> => {
        return populate<T>(ids, model);
    }, config)
}

const createAuthDataLoader = <T extends Document>(user: string, get_user: (document: T) => string, model: Model<T>, config: DataLoader.Options<string, T> = { cache: false }): DataLoader<string, T> => {
    /* Function that creates dataloaders for MongoDB collections */
    return new DataLoader(async (ids: string[]): Promise<(T | Error)[]> => {
        const documents = await populate<T>(ids, model);
        return documents.map(document => authorize_document(document, user, get_user));
    }, config);
}


type AuthLoaders = {
    userLoader: DataLoader<string, User>;
    favouriteStopLoader: DataLoader<string, FavouriteStop>;
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

type Loaders = {
    userLoader: DataLoader<string, User> | null;
    favouriteStopLoader: DataLoader<string, FavouriteStop> | null;
    routeLoader: DataLoader<string, Route>;
    stopLoader: DataLoader<string, Stop>;
    stopRouteLoader: DataLoader<string, StopRoute>;
    stopTimeLoader: DataLoader<string, StopTime>;
    tripLoader: DataLoader<string, Trip>;
    serviceLoader: DataLoader<string, Service>;
    serviceExceptionLoader: DataLoader<string, ServiceException>;
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
        return {
            ...createOpenLoaders(),
            userLoader: null,
            favouriteStopLoader: null
        }
    }
}

export { createLoaders, Loaders }