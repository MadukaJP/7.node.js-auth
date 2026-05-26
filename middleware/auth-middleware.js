const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../config');

const authMiddleware = (req, res, next) => {
    console.log('Auth middleware hit!')
    const authHeaders = req.headers['authorization']

    if (! authHeaders) {
        return res.status(401).json({status: "error", message: "Invalid token! please provide a valid token"})
    }

    const token = authHeaders.split(" ")[1]
    if (! token) {
        return res.status(401).json({status: "error", message: "Invalid token! please provide a valid token"})
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY)
        req.userInfo = decodedToken;
        console.log('Auth middleware done!')
        next();
    } catch (error) {
        console.log("Request failed! (Unauthenticated)");
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({status: "error", message: "Expired token! the provided token has expired"})
        } else if (error.name === "NotBeforeError") {
            return res.status(401).json({status: "error", message: "Inactive token! the provided token is not active"})
        } else {
            return res.status(401).json({status: "error", message: "Invalid token! please provide a valid token"})
        }
    }

}


module.exports = authMiddleware;
