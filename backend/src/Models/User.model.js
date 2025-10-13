import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const userSchema  = mongoose.Schema({
    firstName: {
        type: String,
        require: [true, "Firstname is required!"],
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
        require: [true, "Username is required!"],
        minLength: [2, "Firstname must contain more than 2 letter!"],
        maxLength: [20, "Firstname must not contain more than 20 letter"],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        typr: String,
        unique: true,
        require: true,
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
        type: [Integer, "Input must be a integer number!"],
        require: true
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
    paymentHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }

})
