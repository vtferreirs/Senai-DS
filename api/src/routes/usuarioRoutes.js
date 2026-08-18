import { Router } from "express";
import { 
    getUsuario, 
    postUsuario, 
    putUsuario, 
    deleteUsuario 
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", getUsuario);
router.post("/", postUsuario);
router.put("/:id", putUsuario);
router.delete("/:id", deleteUsuario);

export default router;