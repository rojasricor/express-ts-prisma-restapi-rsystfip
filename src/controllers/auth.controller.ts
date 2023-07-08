import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import * as Security from "../helpers/bcrypt";
import * as User from "../models/User";
import { authSchema } from "../validation/joi";

export async function auth(req: Request, res: Response): Promise<Response> {
    const { error, value } = authSchema.validate(req.body);
    if (error)
        return res.status(400).json({ errors: { error: error.message } });

    const userFound = await User.getUser(
        undefined,
        `${value.username}@itfip.edu.co`
    );
    if (!userFound)
        return res.status(401).json({ errors: { error: "Bad credentials" } });

    const passwordVerified = await Security.verifyPassword(
        value.password,
        userFound.password
    );
    if (!passwordVerified)
        return res.status(401).json({ errors: { error: "Bad credentials" } });

    const permissions = (userFound.permissions as string).split(",");
    const token = Jwt.sign(
        {
            _id: userFound.id,
            email: value.email,
            role: userFound.role,
            permissions,
        },
        SECRET_KEY || "secretkey",
        { expiresIn: 7 * 24 * 60 * 60 }
    );

    return res.status(200).header("Authorization", token).json(userFound);
}
