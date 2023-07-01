import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import * as sgMail from "../helpers/sgMail";
import { IPayload } from "../interfaces/IPayload";
import * as User from "../models/User";
import { recoverPswSchema } from "../validation/joi";

export async function verifyJwtForRecoverPassword(
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

export async function sendJwtForRecoverPassword(
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

  const linkSended = await sgMail.sendEmail(
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
