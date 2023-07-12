import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import * as bcryptHelper from "../helpers/bcrypt.helper";
import * as UserService from "../services/User.service";
import { authSchema } from "../validation/schemas";

export async function auth(req: Request, res: Response): Promise<Response> {
    const { error, value } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const userFound = await UserService.getUser(
        undefined,
        `${value.username}@itfip.edu.co`
    );
    if (!userFound) return res.status(404).json({ error: "Bad credentials" });

    const passwordVerified = await bcryptHelper.verifyPassword(
        value.password,
        userFound.password
    );
    if (!passwordVerified)
        return res.status(401).json({ error: "Bad credentials" });

    const token = Jwt.sign(
        {
            _id: userFound.id,
            email: userFound.email,
            role: userFound.role.name,
            permissions: userFound.role.permissions,
        },
        SECRET_KEY || "secretkey",
        { expiresIn: 7 * 24 * 60 * 60 }
    );

    return res
        .status(200)
        .setHeader("Authorization", token)
        .json({ auth: true, user: { ...userFound, password: undefined } });
}
