import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config();

// MIDDLEWARE FOR AUTHENTICATION 
const authenticationMiddleware = (req, res, next) => {
    // Express normalizes headers to lowercase, so use 'authorization' instead of 'Authorization'
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // split token from the Bearer <token> 
    if(!token){
        return res.status(401).json({message: 'Access token is missing'})
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // use to decode the token
        console.log("API RECHED AUTHENTICATION MIDDLEWARE")
        console.log('This is decoded user',decoded)
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({message: 'Invalid or expired token!'})
    }

}

export {authenticationMiddleware}