import { Router } from "express";
import * as accountCtrl from "../controllers/account.controller";

const router = Router();

router
  .route("/send-jwt-for-recover-password")
  .post(accountCtrl.sendJwtForRecoverPassword);
router
  .route("/verify-jwt-for-recover-password")
  .post(accountCtrl.verifyJwtForRecoverPassword);
router.route("/change-password/:id").put(accountCtrl.changePassword)

export default router;
