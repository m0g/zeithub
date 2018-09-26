import { Router } from "express";

import verifyToken from "./../../verify-token";
import list from "./list";
import create from "./create";
import remove from "./remove";

const router = Router();

router.get("/", verifyToken, list);
router.post("/", verifyToken, create);
router.delete("/:id", verifyToken, remove);

export default router;
