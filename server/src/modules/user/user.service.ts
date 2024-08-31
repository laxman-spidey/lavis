import { ERROR_RESPONSES } from "src/common";
import User, { Role } from "src/models/user/user.model";

type GetUserParams = {
  username?: string;
  userId?: string;
};

const getUser = async ({ username, userId }: GetUserParams) => {
  let whereObject;
  if (username) whereObject = { username };
  else if (userId) whereObject = { userId };
  const user = await User.findOne(whereObject);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user.toJSON();
  const finalData = {
    email: user.username,
    uid: user._id,
    ...userWithoutPassword,
    // role: "admin",
  };
  console.log("🚀 ~ getUser ~ finalData:", finalData);
  return finalData;
};

const getUsersByRole = async ({ role }: { role: Role }) => {
  const users = await User.find({ role });
  return users;
};
const getAllDoctors = async () => {
  const users = await getUsersByRole({ role: "doctor" });
  return users;
};

export const UserService = {
  getUser,
  getAllDoctors,
};
