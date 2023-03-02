import mongoose from "mongoose";

/** Connect to MongoDB database
 * @returns {Promise<void>}
 * @description This function connects to the MongoDB database. It is called in src\index.ts
 * @throws {Error} - If the MONGODB_URI environment variable is not defined
 * @throws {Error} - If the connection to the database fails
    */
async function connectToDB(): Promise<void> {
    const MONGODB_URI: string = process.env.MONGODB_URI;
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        );
    }
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectToDB;
