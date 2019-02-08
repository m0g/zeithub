import { Router } from "express";

import verifyToken from "./../../verify-token";
import list from "./list";
import create from "./create";
import years from "./years";
import remove from "./remove";
import update from "./update";

const router = Router();

router.get("/", verifyToken, list);
router.post("/", verifyToken, create);
router.get("/years", verifyToken, years);
router.delete("/:id", verifyToken, remove);
router.put("/:id", verifyToken, update);

export default router;
