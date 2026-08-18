import Quadro from "../models/quadro.js";

export const getQuadro = async (req, res) => {
    try {
        const quadros = await Quadro.find();
        res.json(quadros);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar quadros." });
    }
};

export const postQuadro = async (req, res) => {
    try {
        const novoQuadro = await Quadro.create(req.body);
        res.status(201).json(novoQuadro);
    } catch (error) {
        res.status(400).json({ message: "Erro ao criar quadro." });
    }
};

export const putQuadro = async (req, res) => {
    try {
        const quadroAtualizado = await Quadro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!quadroAtualizado) {
            return res.status(404).json({ message: "Quadro não encontrado." });
        }

        res.json(quadroAtualizado);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar quadro." });
    }
};

export const deleteQuadro = async (req, res) => {
    try {
        const quadroDeletado = await Quadro.findByIdAndDelete(req.params.id);

        if (!quadroDeletado) {
            return res.status(404).json({ message: "Quadro não encontrado." });
        }

        res.json({ message: "Quadro deletado com sucesso.", quadroDeletado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar quadro." });
    }
};