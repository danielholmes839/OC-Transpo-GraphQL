import jwt from 'jsonwebtoken'

type TokenData = {
    user: string;
    email: string;
}

const apollo_auth = ({ req }) => {
    /* Authenticate the user using apollo server middle ware */
    try {
        const token: string = req.headers.token;
        const data: TokenData = <TokenData>jwt.verify(token, process.env.SECRET_KEY);
        return {
            user: data.user,
            email: data.user,
            authenticated: true
        }
    }

    catch {
        return {
            user: null,
            email: null,
            authenticated: false
        }
    }
}

export default apollo_auth;