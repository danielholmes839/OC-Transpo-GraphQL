const jwt = require('jsonwebtoken');


const auth = (context) => {
    return { user: "5e653e7d6771dc0e9c099b74" };
    //console.log(req.headers);
    /*
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
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
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
    */
}

module.exports = auth;