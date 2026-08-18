import { Router } from "express";
import { 
    getQuadro, 
    postQuadro, 
    putQuadro, 
    deleteQuadro 
} from "../controllers/quadroController.js";

const router = Router();

router.get("/", getQuadro);
router.post("/", postQuadro);
router.put("/:id", putQuadro);
router.delete("/:id", deleteQuadro);

export default router;