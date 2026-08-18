import Card from "../models/card.js";

export const getCard = async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar cards." });
    }
};

export const postCard = async (req, res) => {
    try {
        const novoCard = await Card.create(req.body);
        res.status(201).json(novoCard);
    } catch (error) {
        res.status(400).json({ message: "Erro ao criar card." });
    }
};

export const putCard = async (req, res) => {
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
        res.status(400).json({ message: "Erro ao atualizar card." });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const cardDeletado = await Card.findByIdAndDelete(req.params.id);

        if (!cardDeletado) {
            return res.status(404).json({ message: "Card não encontrado." });
        }

        res.json({ message: "Card deletado com sucesso.", cardDeletado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar card." });
    }
};