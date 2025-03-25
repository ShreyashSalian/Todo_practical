import mongoose from "mongoose";
import { addUserAdmin } from "../utils/addAdmin";
const connectDB = async (): Promise<void> => {
  try {
    const DB_URL =
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_PATH}/${process.env.DATABASE_NAME}`
        : `${process.env.LIVE_PATH}/${process.env.DATABASE_NAME}`;
    //  `mongodb://mongodb-container:27017/${process.env.DATABASE_NAME}` //for docker
    const connection = await mongoose.connect(DB_URL);
    addUserAdmin();
    console.log(`Connected to database : ${connection.connection.host}`);
  } catch (err: any) {
    console.log(`Can not connect to the mongodb database : ${err}`);
    process.exit(1);
  }
};

export default connectDB;
