import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";

const router = Router();

router.route("/").get(userCtrl.getUsers).post(userCtrl.createUser);
router.route("/:id").get(userCtrl.getUser).delete(userCtrl.deleteUser);
router.route("/recover/password").post(userCtrl.recoverPassword);
router
  .route("/verify/recover/password/with-jwt")
  .post(userCtrl.verifyRecoverJwt);

export default router;
