import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";

const router = Router();

router.route("/").get(userCtrl.getUsers).post(userCtrl.createUser);
router.route("/:id").get(userCtrl.getUser).delete(userCtrl.deleteUser);

export default router;
