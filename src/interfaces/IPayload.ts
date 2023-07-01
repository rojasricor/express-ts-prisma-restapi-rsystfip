import { IUser } from "./server/IUser";

export interface IPayload {
  _id: IUser["id"];
  email: IUser["email"];
  role: IUser["role"];
  permissions: IUser["permissions"][];
  iat: number;
  exp: number;
}
