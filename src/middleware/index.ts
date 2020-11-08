import { authMiddleware } from './auth';
import { timeMiddleware, TimeInfo } from './time';
import { createDataLoaders, DataLoaders } from 'db';

type Context = {
    user: string;
    authenticated: boolean;
    loaders: DataLoaders;
    datetime: TimeInfo;
}

const context = ({ req }): Context => {
    /* Middleware that sets the context of each request */
    let auth = authMiddleware(req);
    return {
        ...auth,
        loaders: createDataLoaders(auth.authenticated, auth.user),
        datetime: timeMiddleware()
    }
}

export default context;
export { Context }