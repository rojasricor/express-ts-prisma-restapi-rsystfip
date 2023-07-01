import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import * as Security from "../bcrypt";
import { SECRET_KEY } from "../config";
import { IPayload } from "../interfaces/IPayload";
import * as User from "../models/User";
import { authSchema } from "../validation";

export async function auth(req: Request, res: Response): Promise<Response> {
  const { error, value } = authSchema.validate(req.body);
  if (error) return res.status(400).json({ errors: error.message });

  const user = await User.getUser(`${value.username}@itfip.edu.co`);
  if (!user) return res.status(401).json({ errors: "Bad credentials" });

  const passwordVerified = await Security.verifyPassword(
    value.password,
    user?.password
  );
  if (!passwordVerified)
    return res.status(401).json({ errors: "Bad credentials" });

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

export async function validateSession(
  req: Request,
  res: Response
): Promise<Response> {
  const jwt = req.headers.authorization;
  if (!jwt) return res.status(401).json("Not session provided");

  try {
    const payload = Jwt.verify(jwt, SECRET_KEY || "secretkey") as IPayload;
    return res.status(200).json({ ok: { isValid: true, decoded: payload } });
  } catch (error: any) {
    return res.status(401).json(error.message);
  }
}
