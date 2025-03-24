import { User } from "../models/user.model";
import { adminUserList } from "./adminUserList";

export const addUserAdmin = async (): Promise<void> => {
  try {
    for (let user of adminUserList) {
      const userExists = await User.findOne({
        $or: [
          {
            email: user.email,
          },
          {
            userName: user.userName,
          },
        ],
      });
      if (!userExists) {
        const addUser = await User.create({
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          userName: user.userName,
          role: user.role,
          isEmailVerified: true,
          contactNumber: user.contactNumber,
        });
        console.log(`The user ${user.fullName} has been added`);
        console.log(addUser._id);
      }
    }
  } catch (err: any) {
    console.log(`Error while adding admin ${err}`);
  }
};
