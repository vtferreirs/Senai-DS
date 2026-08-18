import { Router } from "express";
import { 
    getCard, 
    postCard, 
    putCard, 
    deleteCard 
} from "../controllers/cardController.js";

const router = Router();

router.get("/", getCard);
router.post("/", postCard);
router.put("/:id", putCard);
router.delete("/:id", deleteCard);

export default router;