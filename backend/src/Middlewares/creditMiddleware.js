/*
I will send user data/Id from frontend , that can be accessed here. Here is the important steps...
1. Take user id let say from the frontend data.
2. Fetch user latest detail
3. If user not available return
4. if available, check whether the credit is more than 0 or not 
5. If not stop the api and give message to frontend.
6. If credits is more than 0 than next.
*/
import {User} from '../Models/User.model.js';
export default async function creditMiddleware(req, res, next){
    const userId = req.user._id; 

    // fetching user details from the db
    const userDetails = await User.findById(userId);
    // check if user exists
    if(!userDetails){
        return res.status(404).json({message: 'User not found'});
    }

    // checking if user have enough credits 
    // Admins bypass credit checks
    if (typeof userDetails.role === 'string' && userDetails.role.toLowerCase() === 'admin') {
        console.log('creditMiddleware: admin detected, skipping credit check');
        return next();
    }

    if(userDetails.credit > 0){
        next(); // user have enough credit, proceed to next middleware or route handler
    }else{
        return res.status(403).json({message: 'Insufficient credits. Please purchase more credits to continue.'});
    }
}

