import mongoose from 'mongoose';

const uri = "mongodb+srv://laxmanspidey:viviancandy@cluster0.dawdhmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || uri); // Replace with your MongoDB URI
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
