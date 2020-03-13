const jwt = require('jsonwebtoken');


const auth = (context) => {
    try {
        const token = context.req.headers.token;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = decodedToken.user;

        return {
            user: user,
            authenticated: true
        }

    } catch {
        return {
            user: null,
            authenticated: false
        }
    }
}

module.exports = auth;