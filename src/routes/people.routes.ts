import { Router } from "express";
import * as peopleCtrl from "../controllers/people.controller";

const router = Router();

router.route("/").get(peopleCtrl.getPeople).post(peopleCtrl.createPerson);
router.route("/:id").get(peopleCtrl.getPerson).put(peopleCtrl.updatePerson);

export default router;
