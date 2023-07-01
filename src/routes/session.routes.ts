import { Router } from "express";
import * as sessionCtrl from "../controllers/session.controller";

const router = Router();

router.route("/verify-jwt-of-session").post(sessionCtrl.verifyJwtOfSession);

export default router;
