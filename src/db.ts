import { createPool } from "mysql2/promise";
import { DATABASE, HOST, PASSWORD, USER } from "./config";

export function connect() {
  try {
    return createPool({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });
  } catch (err: any) {
    console.error("Error al conectar con la base de datos");
  }
}
