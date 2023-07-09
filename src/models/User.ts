import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IUser } from "../interfaces/IUser";

export async function getUser(
    id?: IUser["id"],
    email?: IUser["email"]
): Promise<IUser | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT u.id, u.name, u.email, u.password, u.role, r.permissions FROM users u INNER JOIN roles r ON u.role = r._id WHERE u.email = ? OR u.id = ?",
        [email, id]
    );
    return rows[0] as IUser;
}

export async function getUsers(): Promise<IUser[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT id, name, lastname, tel, email, role FROM users"
    );
    return rows as IUser[];
}

export async function createUser(user: IUser): Promise<IUser | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>("INSERT INTO users SET ?", [
        user,
    ]);
    delete user.password;
    return result.affectedRows > 0 ? { ...user, id: result.insertId } : null;
}

export async function deleteUser(id: IUser["id"]): Promise<boolean> {
    const conn = connect();
    if (!conn) return false;
    const [result] = await conn.query<OkPacket>(
        "DELETE FROM users WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

export async function updateUser(
    id: IUser["id"],
    user: IUser
): Promise<IUser | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>(
        "UPDATE users SET ? WHERE id = ?",
        [user, id]
    );
    return result.affectedRows > 0 ? { ...user } : null;
}
