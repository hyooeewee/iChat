import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });
    await mongoose.connect(process.env.MONGO_URI as string);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
