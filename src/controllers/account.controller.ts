import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import * as Security from "../helpers/bcrypt.helper";
import * as sgMail from "../helpers/sg.helper";
import { IPayload } from "../interfaces/IPayload";
import { IUser } from "../interfaces/IUser";
import * as User from "../models/User";
import {
    changePswSchema,
    forgetPswSchema,
    recoverPswSchema,
} from "../validation/schemas";

export async function verifyJwtForRecoverPassword(
    req: Request,
    res: Response
): Promise<Response> {
    const jwt = req.headers.authorization;
    if (!jwt) return res.status(401).json("Unauthorized");

    try {
        Jwt.verify(jwt, SECRET_KEY || "secretkey") as IPayload;
        return res.status(200).json({ tokenIsValid: true });
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
}

export async function sendJwtForRecoverPassword(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = recoverPswSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const userFound = await User.getUser(undefined, value.email);
    if (!userFound)
        return res.status(404).json({ error: "Email isn't registered" });

    const token = Jwt.sign(
        { _id: userFound.id, email: userFound.email },
        SECRET_KEY || "secretkey",
        { expiresIn: 10 * 60 }
    );
    const resetPasswordLink = `${value.APP_ROUTE}/${token}`;
    const msg = `Estimado usuario, hemos recibido una solicitud de cambio de contraseña para su cuenta. Si no ha sido usted, por favor ignore este correo electrónico.<br>Si es así, por favor ingrese al siguiente link para restablecer su contraseña:<br>${resetPasswordLink}<br><strong>Este link expirará en 10 minutos.</strong><br><br>Saludos, <br>Equipo ITFIP - RSystfip`;

    const linkSended = await sgMail.sendEmail(
        value.email,
        "Solicitud de cambio de contraseña",
        msg
    );
    if (!linkSended?.response)
        return res.status(500).json({ error: "Error sending email" });

    return res.status(200).json({
        ok: `${userFound.name}, we will send you an email with instructions to reset your password at ${value.email}. Expires in 10 minutes.`,
    });
}

export async function updatePassword(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = changePswSchema.validate({
        ...req.body,
        ...req.params,
    });
    if (error) return res.status(400).json({ error: error.message });

    const userFound = await User.getUser(value.id);
    if (!userFound) return res.status(404).json({ error: "User not found" });

    const auth = await Security.verifyPassword(
        value.current_password,
        userFound.password
    );
    if (!auth)
        return res.status(401).json({ error: "Current password incorrect" });

    const passwordChanged = await User.updateUser(userFound.id, {
        password: await Security.encryptPassword(value.new_password),
    } as IUser);
    if (!passwordChanged)
        return res.status(500).json({ error: "Error updating password" });

    return res.status(200).json({ ok: "Password updated successfully" });
}

export async function updatePasswordWithJwt(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = forgetPswSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
        const payload = Jwt.verify(
            value.resetToken,
            SECRET_KEY || "secretkey"
        ) as IPayload;

        const userFound = await User.getUser(payload._id, payload.email);
        if (!userFound)
            return res.status(404).json({ error: "User not found" });

        const auth = await Security.verifyPassword(
            value.password,
            userFound.password
        );
        if (auth)
            return res.status(400).json({ error: "None password updated" });

        const passwordChanged = await User.updateUser(userFound.id, {
            password: await Security.encryptPassword(value.password),
        } as IUser);
        if (!passwordChanged)
            return res.status(500).json({ error: "Error updating password" });

        return res.status(200).json({ ok: "Password updated successfully" });
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
}
