

const adminMiddleware = (req, res, next) => {

    const isAdmin = req.userInfo.role === 'admin'

    if (!isAdmin) {
        console.log("Request failed! (Unauthorized)");
       return res.status(403).json({
            status: 'error',
            message: 'Access denied! Admin rights required'
        })
    }

    next();

}


module.exports = adminMiddleware;