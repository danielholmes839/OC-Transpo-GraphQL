import jwt from 'jsonwebtoken';

type Token = {
    user: string;
}

type Auth = {
    user: string;
    authenticated: boolean
}

export const authMiddleware = (req): Auth => {
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