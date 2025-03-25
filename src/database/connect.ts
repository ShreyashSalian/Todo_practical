import mongoose from "mongoose";
import { addUserAdmin } from "../utils/addAdmin";
const connectDB = async (): Promise<void> => {
  try {
    const mongoDBURL =
      `${process.env.DOCKER_DATABASE_PATH}/${process.env.DATABASE_NAME}` ||
      `mongodb://mongodb-container:27017/${process.env.DATABASE_NAME}`;
    const connection = await mongoose.connect(
      // `mongodb://mongodb-container:27017/${process.env.DATABASE_NAME}` // for docker
      // `${process.env.LOCAL_PATH}/${process.env.DATABASE_NAME}` // for local
      mongoDBURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Reduce wait time
      } as any
    );
    addUserAdmin();
    console.log(`Connected to database : ${connection.connection.host}`);
  } catch (err: any) {
    console.log(`Can not connect to the mongodb database : ${err}`);
    process.exit(1);
  }
};

export default connectDB;
