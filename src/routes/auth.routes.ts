import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";

const router = Router();

router.route("/").post(authCtrl.auth);
router.route("/validate/session/with-jwt").post(authCtrl.validateSession);

export default router;
