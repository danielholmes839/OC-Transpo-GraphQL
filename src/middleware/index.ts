import jwt from 'jsonwebtoken';
import { createLoaders, Loaders } from 'api/loaders';

type Token = {
    user: string;
}

type Context = {
    user: string;
    authenticated: boolean;
    loaders: Loaders;
}

const authenticateMiddleware = ({ req }): Context => {
    /* Authenticate and create data loaders */
    try {
        const token: string = req.headers.token;
        const data: Token = <Token> jwt.verify(token, process.env.JWT_KEY);
        return {
            user: data.user,
            authenticated: true,
            loaders: createLoaders(true, data.user)
        }
    }

    catch {
        return {
            user: null,
            authenticated: false,
            loaders: createLoaders(false, null)
        }
    }
}

export { Token, Context, authenticateMiddleware }