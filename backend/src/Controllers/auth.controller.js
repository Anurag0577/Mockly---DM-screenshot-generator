import {apiError} from '../Utilities/apiError.js'
import {apiResponse} from '../Utilities/apiResponse.js'
import {asyncHandler} from '../Utilities/asyncHandler.js'
import {User} from '../Models/User.model.js'


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
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

const logoutUser = asyncHandler(async(req, res, next) => {
    try {
        // Get refresh token from cookies to identify user
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            try {
                // Verify refresh token to get user ID
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                
                // Remove refresh token from database
                await User.findByIdAndUpdate(decoded._id, {
                    $set: {
                        refreshToken: null
                    }
                });
                
                console.log('User logged out, refresh token removed from database');
            } catch (error) {
                console.log('Invalid refresh token during logout, but continuing with cookie clearing');
            }
        }

        // ✅ Clear the cookie on logout (always do this)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            path: '/'
        });

        // Send response
        res.status(200).json(new apiResponse(200, "User logged out successfully", {}));
    } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, clear the cookie and send success response
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            path: '/'
        });
        
        res.status(200).json(new apiResponse(200, "User logged out successfully", {}));
    }
});


export {registerUser, loginUser, logoutUser}