import {apiError} from '../Utilities/apiError.js'
import {apiResponse} from '../Utilities/apiResponse.js'
import {asyncHandler} from '../Utilities/asyncHandler.js'
import {User} from '../Models/User.model.js'
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config(); // Load environment variables from .env file


// GENERATE ACCESSS AND REFRESH TOKEN
const genAccessTokenAndRefreshToken = async (id) => {
    try {
        // find the user
        const foundUser = await User.findById(id)
        if(!foundUser){
            throw new apiError(400, 'User not found!')
        }
        const accessToken = foundUser.genAccessToken(); // return the accessToken
        const refreshToken = foundUser.genRefreshToken(); // return the refreshToken
        console.log('Access & refresh token generated successfully!')
        return {accessToken, refreshToken}
    } catch (error) {
        console.log(`Error: ${error}`)
        throw new apiError(400, `Access & refresh token generation failed!`)
    }
}

// REGISTER USER
const registerUser = asyncHandler(async(req, res, next) => {
    const {firstName, lastName, userName, email, password} = req.body;
    // check whether all the important fields are available or not
    if(!firstName || !userName || !email || !password){
        throw new apiError(400, "Please fill the require details." )
    }

    // check whether a user is already exist or not
    const userExist = await User.findOne({ $or: [{userName}, {email}]})
    if(userExist){
        throw new apiError(409, "User already registered!")
    }

    // create a new user
    const newUser = new User({
        userName,
        firstName,
        lastName,
        email,
        password
    })

    await newUser.save();
    console.log("New user registered successfully!")

    // generate accessToken and refreshToken
    const {accessToken, refreshToken} = await genAccessTokenAndRefreshToken(newUser._id)

    // store the refreshToken in the DB
    const updatedUser = await User.findByIdAndUpdate(newUser._id, {refreshToken}, {new: true}).select('+refreshToken');
    console.log('Refresh token saved in db successfully!')

    // store the refreshToken in the cookies and send it to frontend
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // now you can not get access token through javascript in the client side.
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", // Adjust based on environment
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/' // Ensure cookie is available for all routes
    });

    // user response
    const userResponse = {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        accessToken
    }

    res.status(200).json( new apiResponse(200, "User registration successfull!", userResponse))
})


// LOGIN USER
const loginUser = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;
    // check whether all the important fields are available or not
    if(!email || !password){
        throw new apiError(400, "Please fill the require credentials." )
    }

    // check whether a user is already exist or not
    const userExist = await User.findOne({ email }).select('+password')
    if(!userExist){
        throw new apiError(409, "User not exist!")
    }

    // validate the user
    const isPasswordCorrect = await userExist.isPasswordCorrect(password)
    if(isPasswordCorrect){
            // generate accessToken and refreshToken
            const {accessToken, refreshToken} = await genAccessTokenAndRefreshToken(userExist._id)

            // store the refreshToken in the DB
            const updatedUser = await User.findByIdAndUpdate(userExist._id, {refreshToken}, {new: true}).select('+refreshToken');
            console.log('Refresh token saved in db successfully!')

            // store the refreshToken in the cookies and send it to frontend
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // now you can not get access token through javascript in the client side.
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", // Adjust based on environment
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
                path: '/' // Ensure cookie is available for all routes
            });
            const userResponse = {
                _id: userExist._id,
                userName: userExist.userName,
                email: userExist.email,
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                accessToken
                };

            res.status(200).json(new apiResponse(200, 'User login successfull', userResponse))
    } else {
        res.status(400).json(new apiResponse(400, 'User login failed!'))
    }
})


// LOGOUT USER
const logoutUser = asyncHandler(async(req, res, next) => {
    // Get refresh token from cookies to identify user
    const refreshToken = req.cookies.refreshToken;
    
    // Try to remove refresh token from database if token exists and is valid
    if (refreshToken) {
        try {
            // Verify refresh token to get user ID
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            
            // Remove refresh token from database
            await User.findByIdAndUpdate(decoded._id, {
                $unset: {
                    refreshToken: ""
                }
            });
            
            console.log('User logged out, refresh token removed from database');
        } catch (error) {
            // If token is invalid/expired, just log it but continue with logout
            // This allows logout even if token is expired
            console.log('Refresh token invalid during logout (may be expired), continuing with logout');
        }
    }

    // Always clear the cookie on logout (even if token was invalid)
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Add domain if needed
    });

    // Send success response
    res.status(200).json(new apiResponse(200, "User logged out successfully", {}));
});


// REGENERATE ACCESSTOKEN 
const regenerateAccessToken = asyncHandler((req, res) => {
    console.log('Regenerate access token request received');
    console.log('All cookies:', req.cookies);
    console.log('Refresh token cookie:', req.cookies?.refreshToken);
    
    // get the refreshToken from the cookies.
    const refreshToken = req.cookies.refreshToken;
    
    if(!refreshToken){
        console.error('Refresh token not found in cookies');
        return res.status(401).json(new apiResponse(401, "Refresh token not found!", null))
    }
    
    try {
        // Check if environment variables are set
        if (!process.env.REFRESH_TOKEN_SECRET) {
            console.error('REFRESH_TOKEN_SECRET is not set in environment variables!');
            return res.status(500).json(new apiResponse(500, "Server configuration error", null));
        }
        
        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error('ACCESS_TOKEN_SECRET is not set in environment variables!');
            return res.status(500).json(new apiResponse(500, "Server configuration error", null));
        }
        
        console.log('Verifying token with secret:', process.env.REFRESH_TOKEN_SECRET ? 'Secret exists' : 'Secret missing');
        
        // ✅ FIX: Wrap jwt.verify in try-catch to handle errors
        // verify the refreshToken
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log('Decoded refresh token:', decode)

        // generate new access token
        const newAccessToken = jwt.sign({
            _id: decode._id,
            username: decode.username,
            email: decode.email
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}) 
        
        console.log('New access token generated successfully!')
        
        // ✅ FIX: Use apiResponse format to match frontend expectations
        return res.status(200).json(new apiResponse(200, "Access token regenerated successfully", { accessToken: newAccessToken }));
    } catch (error) {
        // Handle invalid or expired refresh token
        console.error('Token verification error:', error.message);
        console.error('Error name:', error.name);
        console.error('Full error:', error);
        
        // Provide more specific error messages
        let errorMessage = "Invalid or expired refresh token!";
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Refresh token has expired. Please login again.";
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = "Invalid refresh token. Please login again.";
        } else if (error.name === 'NotBeforeError') {
            errorMessage = "Refresh token not active yet.";
        }
        
        return res.status(403).json(new apiResponse(403, errorMessage, null))
    }
})


export {registerUser, loginUser, logoutUser, regenerateAccessToken}