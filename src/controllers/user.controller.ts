import { Request, Response } from "express";
import * as bcryptHelper from "../helpers/bcrypt.helper";
import * as UserService from "../services/User.service";
import { idSchema, userSchema } from "../validation/schemas";

export async function getUser(req: Request, res: Response): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message });

    const userFound = await UserService.getUser(value.id);
    if (!userFound) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(userFound);
}

export async function getUsers(req: Request, res: Response): Promise<Response> {
    const users = await UserService.getUsers();
    if (!users) return res.status(500).json({ error: "Error getting users" });

    return res.status(200).json(users);
}

export async function deleteUser(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message });

    const userDeleted = await UserService.deleteUser(value.id);
    if (!userDeleted)
        return res.status(500).json({ error: "Error deleting user" });

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

    const userExists = await UserService.getUser(
        parseInt(value.role) - 1,
        value.email
    );
    if (!userExists) {
        const userCreated = await UserService.createUser({
            id: parseInt(value.role) - 1,
            document_id: value.docType,
            document_number: value.doc,
            name: value.name,
            lastname: value.lastname,
            role_id: value.role,
            tel: value.tel,
            email: value.email,
            password: await bcryptHelper.encryptPassword(value.password),
        });
        if (!userCreated)
            return res.status(500).json({ error: "Error creating user" });

        return res
            .status(201)
            .json({ ok: "User created successfully", userCreated });
    }

    if (value.email === userExists.email)
        return res.status(409).json({ error: "Email already registered" });

    return res.status(409).json({ error: "User already exists" });
}
