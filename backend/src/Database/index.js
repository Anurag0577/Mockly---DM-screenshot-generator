import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// FUNCTION TO CONNECT TO THE DATABASE
async function connectDB(){
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`Database connection successfull! Host: ${connectionInstance.connection.host}`)

        // Ensure admin user exists after DB connect
        try {
            // Import User model lazily to avoid race conditions
            const { User } = await import('../Models/User.model.js');

            const adminEmail = process.env.ADMIN_EMAIL || 'igrish@gmail.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'Anur@gSingh';
            const adminUserName = process.env.ADMIN_USERNAME || 'igrish';
            const adminFirstName = process.env.ADMIN_FIRSTNAME || 'Igrish';
            const adminLastName = process.env.ADMIN_LASTNAME || 'Solo';

            // If an admin already exists, do nothing
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) {
                console.log(`Admin user already exists: ${existingAdmin.email} (id=${existingAdmin._id})`);
            } else {
                // If a user exists with the admin email, promote them
                const userWithEmail = await User.findOne({ email: adminEmail });
                if (userWithEmail) {
                    userWithEmail.role = 'admin';
                    await userWithEmail.save();
                    console.log(`Promoted existing user ${adminEmail} to admin (id=${userWithEmail._id})`);
                } else {
                    // Create a new admin user
                    const newAdmin = new User({
                        firstName: adminFirstName,
                        lastName: adminLastName,
                        userName: adminUserName,
                        email: adminEmail,
                        password: adminPassword,
                        role: 'admin',
                        credit: 999999
                    });
                    await newAdmin.save();
                    console.log(`Created admin user ${adminEmail} (id=${newAdmin._id})`);
                    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
                        console.warn('WARNING: Admin was created using default credentials. Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment for better security.');
                    }
                }
            }
        } catch (seedErr) {
            console.error('Failed to ensure admin user:', seedErr);
        }
    } catch(error) {
        console.log(`MongoDB connection failed! Error: ${error}` )
        process.exit(1);
        // This process is not good, we have to retry the connection again and again untill it connects successfully.
    }
}

export {connectDB};

// The difference between default export and named export is that in default export we can have only one default export in a file but in named export we can have multiple named exports in a file. Also while importing a default export we can give any name to the imported module but while importing a named export we have to use the same name as the exported module.