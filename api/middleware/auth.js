const jwt = require('jsonwebtoken');


function auth(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.authenticated = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; //Bearer token
    if (!token || token === '') {
        req.authenticated = false;
        return next();
    }
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'secret key');
    } catch {
        req.authenticated = false;
        return next();
    }

    if (!decodedToken) {
        req.authenticated = false;
        return next();
    }

    req.authenticated = true;
    req.userId = decodedToken.userId;
    next();
}

module.exports = auth;