import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IUser } from "../interfaces/database/IUser";

export async function getUser(
  email?: IUser["email"],
  id?: IUser["id"]
): Promise<IUser | null> {
  const conn = connect();
  if (!conn) return null;
  const [user] = (await conn.query(
    "SELECT u.id, u.name, u.email, u.password, u.role, r.permissions FROM users u INNER JOIN roles r ON u.role = r._id WHERE u.email = ? OR u.id = ?",
    [email, id]
  )) as RowDataPacket[];
  return user[0] as IUser;
}

export async function getUsers(): Promise<IUser[] | null> {
  const conn = connect();
  if (!conn) return null;
  const [users] = (await conn.query(
    "SELECT id, name, lastname, tel, email, role FROM users"
  )) as RowDataPacket[];
  return users as IUser[];
}

export async function createUser(user: IUser): Promise<IUser | null> {
  const conn = connect();
  if (!conn) return null;
  const [result] = (await conn.query("INSERT INTO users SET ?", [
    user,
  ])) as OkPacket[];
  delete user.password;
  return result.affectedRows > 0 ? { ...user } : null;
}

export async function deleteUser(id: IUser["id"]): Promise<boolean> {
  const conn = connect();
  if (!conn) return false;
  const [result] = (await conn.query("DELETE FROM users WHERE id = ?", [
    id,
  ])) as OkPacket[];
  return result.affectedRows > 0;
}
