import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const userSchema  = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Firstname is required!"],
        minLength: [2, "Firstname must contain more than 2 letter!"],
        maxLength: [20, "Firstname must not contain more than 20 letter"],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
        trim: true
    },
    lastName: {
        type: String,
        minLength: [2, "Firstname must contain more than 2 letter!"],
        maxLength: [20, "Firstname must not contain more than 20 letter"],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
        trim: true
    },
    userName: {
        type: String,
        unique: true,
        required: [true, "Username is required!"],
        minLength: [2, "Firstname must contain more than 2 letter!"],
        maxLength: [20, "Firstname must not contain more than 20 letter"],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    credit: {
        type: Number,
        required: true
    },
    subscription: {
        type: String,
        required: true,
        default: 'Free'
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    paymentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }]
},
{timestamps: true}
)



// implement the logic before saving the code in the DB
userSchema.pre('save', async function(next){
    try {
        // this refers to the user document being saved
        if(!this.isModified('password')) return next();

        const salt = bcrypt.genSalt(10); // generate a salt, a unique string use to make hash more secure
        this.password = bcrypt.hash(this.password, salt) // save new hash password 
        next() // go to new next step (middleware)
    } catch (err) {
        console.log("password hasing failed!", err)
        next(err) // send the err to next middleware
    }
})

// compare the password with the save password in the DB
userSchema.methods.isPasswordCorrect = async function(password){
    try {
        return bcrypt.compare(password, this.password) // compare the password with the store password hash
    } catch (err) {
        throw new Error('password validation failed!') // throw a new error
    }
}

// generate a refresh token
userSchema.methods.genRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

// generate a accessToken
userSchema.methods.genAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        username : this.userName,
        email : this.email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}


const User = mongoose.model('User', userSchema);

export {User};