import mongoose from 'mongoose';

let isConnected = false; // track the connection

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    console.log('=> using new database connection');
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "LuvSync",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
  } catch (err) {
    console.log(err);
  }
}