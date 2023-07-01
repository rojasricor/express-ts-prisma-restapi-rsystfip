import { Router } from "express";
import * as accountCtrl from "../controllers/account.controller";

const router = Router();

router
  .route("/send-jwt-for-recover-password")
  .post(accountCtrl.sendJwtForRecoverPassword);
router
  .route("/verify-jwt-for-recover-password")
  .post(accountCtrl.verifyJwtForRecoverPassword);

export default router;
