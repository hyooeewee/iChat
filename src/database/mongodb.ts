import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('[Database] Connecting...');
    mongoose.connection.on('connected', () => {
      console.log('[Database] MongoDB connect successful');
    });
    mongoose.connection.on('disconnected', () => {
      console.log('[Database] MongoDB disconnected');
    });
    mongoose.connection.on('error', error => {
      console.error(`[Database] Error: ${error}`);
    });
    await mongoose.connect(process.env['MONGO_URI'] as string);
  } catch (error) {
    console.error(`[Database] Error: ${error}`);
  }
};

export default connectDB;
