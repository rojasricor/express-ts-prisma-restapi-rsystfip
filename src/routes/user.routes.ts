import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import roleMiddleware from "../middlewares/role.middleware";

const router = Router();

router
    .route("/")
    .get(roleMiddleware("admin"), userCtrl.getUsers)
    .post(roleMiddleware("admin"), userCtrl.createUser);
router
    .route("/:id")
    .get(roleMiddleware("admin", "secretaria", "rector"), userCtrl.getUser)
    .delete(roleMiddleware("admin"), userCtrl.deleteUser);

export default router;
