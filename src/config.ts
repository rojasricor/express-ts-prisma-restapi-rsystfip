import { config } from "dotenv";

config(); // Read .env file into process.env

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const USER = process.env.USER;
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SECRET_KEY = process.env.SECRET_KEY;
export const FROM_EMAIL = process.env.FROM_EMAIL;
export const FROM_NAME = process.env.FROM_NAME;
