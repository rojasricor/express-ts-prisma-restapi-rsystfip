import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/IUser";

export async function encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function verifyPassword(
    password: IUser["password"],
    hash: IUser["password"]
) {
    return await bcrypt.compare(password as string, hash as string);
}
