import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";

const router = Router();

router.route("/").post(authCtrl.auth);

export default router;
