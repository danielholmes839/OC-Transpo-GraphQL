import jwt from 'jsonwebtoken';
import { createLoaders, Loaders } from 'api/loaders';

type Token = {
    user: string;
    email: string;
}

type Context = {
    user: string;
    email: string;
    authenticated: boolean;
    loaders: Loaders;
}

const middleware = ({ req }) => {
    /* Authenticate and create data loaders */
    try {
        const token: string = req.headers.token;
        const data: Token = <Token>jwt.verify(token, process.env.BCRYPT_KEY);
        return {
            user: data.user,
            email: data.user,
            authenticated: true,
            loaders: createLoaders(true, data.user)
        }
    }

    catch {
        return {
            user: null,
            email: null,
            authenticated: false,
            loaders: createLoaders(false, null)
        }
    }
}

export { Token, Context, middleware }