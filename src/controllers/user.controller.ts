import { Request, Response } from "express";
import * as Security from "../helpers/bcrypt";
import { IUser } from "../interfaces/IUser";
import * as User from "../models/User";
import { idSchema, userSchema } from "../validation/joi";

export async function getUser(req: Request, res: Response): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message });

    const userFound = await User.getUser(value.id);
    if (!userFound) return res.status(400).json({ error: "User not found" });

    return res.status(200).json(userFound);
}

export async function getUsers(req: Request, res: Response): Promise<Response> {
    const users = await User.getUsers();
    if (!users) return res.status(400).json({ error: "Error getting users" });

    return res.status(200).json(users);
}

export async function deleteUser(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message });

    const userDeleted = await User.deleteUser(value.id);
    if (!userDeleted)
        return res.status(400).json({ error: "Error deleting user" });

    return res
        .status(200)
        .json({ ok: "User deleted successfully", userDeleted });
}

export async function createUser(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const userExists = await User.getUser(
        parseInt(value.role) - 1,
        value.email
    );
    if (!userExists) {
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
            return res.status(400).json({ error: "Error creating user" });

        return res
            .status(200)
            .json({ ok: "User created successfully", userCreated });
    }

    if (value.email === userExists.email)
        return res.status(400).json({ error: "Email already registered" });

    return res.status(400).json({ error: "User already exists" });
}
