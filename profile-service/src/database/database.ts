import dotenv from 'dotenv';
import * as mongoose from "mongoose";



dotenv.config();

const { MONGO_URI } = process.env;



const client = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

client.on('error', (err) => {
    console.log(err);
    throw err;
});

client.once('open', () => {
    console.log('Connected to MongoDB');
}
);









