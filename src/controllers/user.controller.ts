import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import * as Security from "../bcrypt";
import { SECRET_KEY } from "../config";
import { IPayload } from "../interfaces/IPayload";
import { IUser } from "../interfaces/database/IUser";
import * as User from "../models/User";
import { idSchema, recoverPswSchema, userSchema } from "../validation";
import { sendEmail } from "../sendgrid";

export async function recoverPassword(
  req: Request,
  res: Response
): Promise<Response> {
  const { error, value } = recoverPswSchema.validate(req.body);
  if (error) return res.status(400).json({ errors: error.message });

  const userFound = await User.getUser(value.email);
  if (!userFound)
    return res
      .status(401)
      .json({ errors: { error: "Email isn't registered" } });

  const token = Jwt.sign(
    { _id: userFound.id, email: userFound.email },
    SECRET_KEY || "secretkey",
    { expiresIn: 10 * 60 }
  );
  const resetPasswordLink = `${value.APP_ROUTE}/${value.email}/${token}`;
  const msg = `Estimado usuario, hemos recibido una solicitud de cambio de contraseña para su cuenta. Si no ha sido usted, por favor ignore este correo electrónico.<br>Si es así, por favor ingrese al siguiente link para restablecer su contraseña:<br>${resetPasswordLink}<br><strong>Este link expirará en 10 minutos.</strong><br><br>Saludos, <br>Equipo ITFIP - RSystfip`;

  const linkSended = await sendEmail(
    value.email,
    "Solicitud de cambio de contraseña",
    msg
  );
  if (!linkSended?.response)
    return res.status(400).json({ errors: { error: "Error sending email" } });

  return res.status(200).json({
    ok: `${userFound.name}, we will send you an email with instructions to reset your password at ${value.email}. Expires in 10 minutes.`,
  });
}

export async function verifyRecoverJwt(
  req: Request,
  res: Response
): Promise<Response> {
  const jwt = req.headers.authorization;
  if (!jwt) return res.status(401).json("Unauthorized");

  try {
    const payload = Jwt.verify(jwt, SECRET_KEY || "secretkey") as IPayload;
    if (!payload.email) return res.status(401).json("Unauthorized");
    return res.status(200).json({ tokenIsValid: true });
  } catch (error: any) {
    return res.status(401).json({ tokenIsValid: false, error: error.message });
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ errors: error.message });

  const user = await User.getUser(value.id);
  if (!user)
    return res.status(400).json({ errors: { error: "User not found" } });

  return res.status(200).json(user);
}

export async function getUsers(req: Request, res: Response): Promise<Response> {
  const users = await User.getUsers();
  if (!users)
    return res.status(400).json({ errors: { error: "Error getting users" } });

  return res.status(200).json(users);
}

export async function deleteUser(
  req: Request,
  res: Response
): Promise<Response> {
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ errors: error.message });

  const userDeleted = await User.deleteUser(value.id);
  if (!userDeleted)
    return res.status(400).json({ errors: { error: "Error deleting user" } });

  return res.status(200).json({ ok: true, userDeleted });
}

export async function createUser(
  req: Request,
  res: Response
): Promise<Response> {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ errors: error.message });

  const userFound = await User.getUser(value.email, parseInt(value.role) - 1);
  if (!userFound) {
    const newUser: IUser = {
      id: parseInt(value.role) - 1,
      document_id: value.docType,
      document_number: value.doc,
      name: value.name,
      lastname: value.lastname,
      role: value.role,
      tel: value.tel,
      email: value.email,
      password: await Security.encryptPassword(value.password),
    };
    const userCreated = await User.createUser(newUser);
    if (!userCreated)
      return res.status(400).json({ errors: { error: "Error creating user" } });

    return res
      .status(200)
      .json({ ok: "User created successfully", userCreated });
  }

  if (value.email === userFound.email)
    return res
      .status(400)
      .json({ errors: { error: "Email already registered" } });

  return res.status(400).json({ errors: { error: "User already exists" } });
}
