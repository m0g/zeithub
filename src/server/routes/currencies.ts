import { Router } from "express";
import verifyToken from "./../verify-token";
import DB from "./../db";

const router = Router();
const db = new DB();

router.get("/", verifyToken, async (req, res) => {
  const currencies = await db.query(`
    select code, name, sign
    from currencies
  `);

  if (currencies) {
    res.json({ success: true, currencies });
  }
});

export default router;
