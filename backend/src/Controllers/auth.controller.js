import { apiError } from '../Utilities/apiError.js';
import { apiResponse } from '../Utilities/apiResponse.js';
import { asyncHandler } from '../Utilities/asyncHandler.js';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../Models/User.model.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

// Initialize Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GENERATE ACCESS AND REFRESH TOKEN
const genAccessTokenAndRefreshToken = async (id) => {
    try {
        const foundUser = await User.findById(id);
        if (!foundUser) {
            throw new apiError(404, 'User not found during token generation');
        }
        const accessToken = foundUser.genAccessToken();
        const refreshToken = foundUser.genRefreshToken();
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(`Token Gen Error: ${error}`);
        throw new apiError(500, 'Access & refresh token generation failed');
    }
};

// COOKIE OPTIONS
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !userName || !email || !password) {
        throw new apiError(400, "Please fill the required details.");
    }

    const userExist = await User.findOne({ $or: [{ userName }, { email }] });
    if (userExist) {
        throw new apiError(409, "User already registered!");
    }

    const newUser = await User.create({
        userName,
        firstName,
        lastName,
        email,
        password
    }); // .create is cleaner than new User() + .save()

    const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(newUser._id);

    // Save refresh token to DB
    await User.findByIdAndUpdate(newUser._id, { refreshToken });

    // Send Response
    const userResponse = {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        accessToken
    };

    res.status(201)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new apiResponse(201, "User registration successful!", userResponse));
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(400, "Please fill the required credentials.");
    }

    const userExist = await User.findOne({ email }).select('+password');
    if (!userExist) {
        throw new apiError(404, "User does not exist!");
    }

    const isPasswordCorrect = await userExist.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new apiError(401, "Invalid user credentials!");
    }

    const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(userExist._id);

    // Update refresh token in DB
    await User.findByIdAndUpdate(userExist._id, { refreshToken });

    const userResponse = {
        _id: userExist._id,
        userName: userExist.userName,
        email: userExist.email,
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        accessToken
    };

    res.status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new apiResponse(200, 'User login successful', userResponse));
});

// GOOGLE AUTH
const googleAuth = asyncHandler(async (req, res) => {
    const { credential, client_id } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID || client_id,
        });
        const payload = ticket.getPayload();
        const { email, given_name, family_name, sub } = payload; // sub is google's unique user ID

        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random password and username for Google users if your schema requires them
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);

            user = await User.create({
                email,
                userName: generatedUsername, 
                firstName: given_name, // Fixed: matched to schema 'firstName'
                lastName: family_name,
                password: randomPassword, // Assuming password is required in schema
                authSource: 'google',
            });
        }

        const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(user._id);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        const userResponse = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            accessToken
        };

        res.status(200)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .json(new apiResponse(200, 'Google login successful', userResponse));

    } catch (err) {
        console.error('Error during Google Authentication:', err);
        throw new apiError(400, "Google Authentication failed");
    }
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
    // If you are using an auth middleware, req.user._id is usually available
    // But since we rely on cookies here:
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (incomingRefreshToken) {
        try {
            const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            await User.findByIdAndUpdate(decoded._id, { $unset: { refreshToken: 1 } });
        } catch (error) {
            console.log('Token invalid or expired, proceeding with logout cleanup');
        }
    }

    res.status(200)
        .clearCookie('refreshToken', cookieOptions)
        .json(new apiResponse(200, "User logged out successfully", {}));
});

// REGENERATE ACCESS TOKEN
const regenerateAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request: No refresh token");
    }

    try {
        // 1. Verify Signature
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // 2. IMPORTANT: Verify token exists in DB (Security Check)
        // We find the user and explicitly match the refresh token field
        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new apiError(401, "Refresh token is expired or used");
        }

        // 3. Generate NEW tokens
        // (Optional: Rotate Refresh Token here if you want strict security)
        const { accessToken, refreshToken: newRefreshToken } = await genAccessTokenAndRefreshToken(user._id);
        
        // Update DB with new refresh token (if rotating) - otherwise just send new Access Token
        // Assuming we DO NOT rotate refresh token on every access token refresh:
        // const newAccessToken = user.genAccessToken();

        // If you want to return JUST the access token (standard flow):
        const newAccessToken = jwt.sign(
            { _id: user._id, email: user.email, userName: user.userName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        return res.status(200).json(
            new apiResponse(200, "Access token regenerated successfully", { accessToken: newAccessToken })
        );

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Refresh Token");
    }
});

// USER DETAILS
const userDetails = asyncHandler(async (req, res) => {
    // Rely on your auth middleware to populate req.user
    if (!req.user || !req.user._id) {
        throw new apiError(401, 'Unauthorized request');
    }

    const foundUser = await User.findById(req.user._id);
    return res.status(200).json(new apiResponse(200, "User details fetched successfully!", foundUser));
});

export { registerUser, loginUser, logoutUser, regenerateAccessToken, userDetails, googleAuth };