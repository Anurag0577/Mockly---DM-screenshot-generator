
const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if(!token){
        return res.status(401).json({message: 'Access token is missing!'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({message: 'Invalid or expired token!'})
    }

}

export {authenticationMiddleware}