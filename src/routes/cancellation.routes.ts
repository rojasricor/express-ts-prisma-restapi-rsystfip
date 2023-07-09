import { Router } from "express";
import * as cancellationCtrl from "../controllers/cancellation.controller";

const router = Router();

router.route("/").post(cancellationCtrl.createCancellation);

export default router;
