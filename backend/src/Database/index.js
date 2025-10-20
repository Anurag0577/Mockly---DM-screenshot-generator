import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// FUNCTION TO CONNECT TO THE DATABASE
async function connectDB(){
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`Database connection successfull! Host: ${connectionInstance.connection.host}`)
    } catch(error) {
        console.log(`MongoDB connection failed! Error: ${error}` )
        process.exit(1);
        // This process is not good, we have to retry the connection again and again untill it connects successfully.
    }
}

export {connectDB};

// The difference between default export and named export is that in default export we can have only one default export in a file but in named export we can have multiple named exports in a file. Also while importing a default export we can give any name to the imported module but while importing a named export we have to use the same name as the exported module.