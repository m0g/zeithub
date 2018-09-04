import { Router } from "express";

import verifyToken from "./../../verify-token";
import list from "./list";
import create from "./create";

const router = Router();

router.get("/", verifyToken, list);
router.post("/", verifyToken, create);

export default router;
