import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import * as Security from "../helpers/bcrypt";
import { SECRET_KEY } from "../config";
import * as User from "../models/User";
import { authSchema } from "../validation/joi";

export async function auth(req: Request, res: Response): Promise<Response> {
  const { error, value } = authSchema.validate(req.body);
  if (error) return res.status(400).json({ errors: error.message });

  const user = await User.getUser(`${value.username}@itfip.edu.co`);
  if (!user)
    return res.status(401).json({ errors: { error: "Bad credentials" } });

  const passwordVerified = await Security.verifyPassword(
    value.password,
    user?.password
  );
  if (!passwordVerified)
    return res.status(401).json({ errors: { error: "Bad credentials" } });

  const permissions = (user.permissions as string).split(",");
  const token = Jwt.sign(
    {
      _id: user.id,
      email: value.email,
      role: user.role,
      permissions,
    },
    SECRET_KEY || "secretkey",
    { expiresIn: 7 * 24 * 60 * 60 }
  );

  return res.status(200).header("Authorization", token).json(user);
}
