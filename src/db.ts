import { createConnection } from "mysql2/promise";
import { DATABASE, HOST, PASSWORD, USER } from "./config";

export async function connect() {
  try {
    return await createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });
  } catch (err: any) {
    console.error("Error connecting db", err.message);
  }
}
