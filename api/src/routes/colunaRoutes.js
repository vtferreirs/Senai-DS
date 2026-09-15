import { Router } from "express";
import {
  getColuna,
  postColuna,
  putColuna,
  deleteColuna,
} from "../controllers/colunaController.js";

const router = Router();

router.get("/", getColuna);
router.post("/", postColuna);
router.put("/:id", putColuna);
router.delete("/:id", deleteColuna);

export default router;