import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/server/IUser";

export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: IUser["password"],
  receivedPassword: IUser["password"]
) {
  return await bcrypt.compare(password as string, receivedPassword as string);
}
