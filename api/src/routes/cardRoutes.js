import { Router } from "express";
import Card from "../models/card.js";

const router = Router();

router.get("/", async (req, res) => {
    try {

        const cards = await Card.find();
        res.json(cards);

    } catch (error) {

        res.status(500).json({ message: "Erro ao buscar cards." });
    }
});

router.post("/", async (req, res) => {
    try {

        const novoCard = await Card.create(req.body);
        res.status(201).json(novoCard);

    } catch (error) {

        res.status(400).json({
             message: "Erro ao criar card."
        });
    }
});

router.put("/:id", async (req, res) => {
    try {

        const cardAtualizado = await Card.findByIdAndUpdate(

            req.params.id,  
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!cardAtualizado) {
            return res.status(404).json({ message: "Card não encontrado." });
        }
        
        res.json(cardAtualizado);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar card."});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const cardDeletado = await Card.findByIdAndDelete(req.params.id);
        
        if (!cardDeletado) {
            return res.status(404).json({ message: "Card não encontrado." });
        }
        
        res.json({ message: "Card deletado com sucesso.", cardDeletado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar card." });
    }
});

export default router;