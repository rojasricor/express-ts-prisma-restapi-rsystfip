import { Router } from "express";
import * as resourceCtrl from "../controllers/resource.controller";

const router = Router();

router.route("/categories").get(resourceCtrl.getCategories);
router.route("/documents").get(resourceCtrl.getDocuments);
router.route("/faculties").get(resourceCtrl.getFaculties);

export default router;
