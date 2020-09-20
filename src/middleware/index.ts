import jwt from 'jsonwebtoken';
import { createLoaders, Loaders } from 'api/loaders';
import { getYesterday, getToday, getTomorrow, getCurrentTime } from 'helpers';

type Token = {
    user: string;
}

type TimeData = {
    yesterday: string;
    today: string;
    tommorow: string;
    currentTime: number;
    currentDate: Date;
}

type AuthData = {
    user: string;
    authenticated: boolean
}

type Context = {
    user: string;
    authenticated: boolean;
    loaders: Loaders;
    datetime: TimeData;
}


const timeMiddleware = (): TimeData => {
    const date = new Date();
    return {
        yesterday: getYesterday(date),
        today: getToday(date),
        tommorow: getTomorrow(date),
        currentDate: date,
        currentTime: getCurrentTime()
    }
}

const authMiddleware = (req): AuthData => {
    /* Authenticate and create data loaders */
    try {
        const token: string = req.headers.token;
        const data: Token = <Token>jwt.verify(token, process.env.JWT_KEY);
        return {
            user: data.user,
            authenticated: true,
        }
    }

    catch {
        return {
            user: null,
            authenticated: false,
        }
    }
}

const contextMiddleware = ({ req }): Context => {
    let auth = authMiddleware(req);
    return {
        ...auth,
        loaders: createLoaders(auth.authenticated, auth.user),
        datetime: timeMiddleware()
    }
}

export { Token, Context, contextMiddleware }