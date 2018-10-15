import { Router } from "express";

import verifyToken from "./../../verify-token";
import get from "./get";
import list from "./list";
import createWithActivities from "./create-with-activities";
import create from "./create";
import update from "./update";
import pdf from "./pdf";
import remove from "./remove";

const router = Router();

router.get("/:id", verifyToken, get);
router.get("/", verifyToken, list);
router.post("/with-activities", verifyToken, createWithActivities);
router.post("/", verifyToken, create);
router.put("/:id", verifyToken, update);
router.get("/:id/pdf", verifyToken, pdf);
router.delete("/:id", verifyToken, remove);

export default router;
