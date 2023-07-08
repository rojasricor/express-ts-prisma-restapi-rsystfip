import { config } from "dotenv";

config(); // Read .env file into process.env

export const PORT = process.env.APP_PORT;
export const HOST = process.env.DB_HOST;
export const USER = process.env.DB_USER;
export const PASSWORD = process.env.DB_PSW;
export const DATABASE = process.env.DB_NAME;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SECRET_KEY = process.env.SECRET_KEY;
export const FROM_EMAIL = process.env.EMAIL_SENDER;
export const FROM_NAME = process.env.NAME_SENDER;
