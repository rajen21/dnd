import mongoose from 'mongoose';

type MongoDBURI = string;

const connectDB = async (uri: MongoDBURI) => {
  try {
    const connectionInstance = await mongoose.connect(uri);
    console.log(`\nMongoDb Connected !! DB HOST : ${connectionInstance.connection.host}`);
  } catch (err) {
    const error = err as Error;
    console.error("MONGODB connection error => ", error);
    process.exit(1);
  }
};

export default connectDB;
