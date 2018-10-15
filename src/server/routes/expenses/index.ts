import { Router } from "express";

import verifyToken from "./../../verify-token";
import list from "./list";
import create from "./create";
import years from "./years";
import remove from "./remove";

const router = Router();

router.get("/", verifyToken, list);
router.post("/", verifyToken, create);
router.get("/years", verifyToken, years);
router.delete("/:id", verifyToken, remove);

export default router;
