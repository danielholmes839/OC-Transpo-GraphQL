const jwt = require('jsonwebtoken');


const auth = (context) => {
    try {
        const token = context.req.headers.token;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = decodedToken.user;
        const email = decodedToken.email;

        return {
            user: user,
            email: email,
            authenticated: true
        }

    } catch {
        return {
            user: null,
            email: null,
            authenticated: false
        }
    }
}

module.exports = auth;