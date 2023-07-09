import { Router } from "express";
import * as scheduleCtrl from "../controllers/schedule.controller";

const router = Router();

router
    .route("/")
    .get(scheduleCtrl.getSchedule)
    .post(scheduleCtrl.createSchedule);
router.route("/:id").patch(scheduleCtrl.cancellSchedule);

export default router;
