import Coluna from "../models/coluna.js";

export const getColuna = async (req, res) => {
  try {
    const { id_quadro } = req.query;
    const filtro = id_quadro ? { id_quadro } : {};
    const colunas = await Coluna.find(filtro).sort({ ordem: 1 });
    res.json(colunas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar colunas." });
  }
};

export const postColuna = async (req, res) => {
  try {
    const { id_quadro } = req.body;
    const proximaOrdem = await Coluna.countDocuments(
      id_quadro ? { id_quadro } : {}
    );

    const novaColuna = await Coluna.create({
      ...req.body,
      ordem: req.body.ordem != null ? req.body.ordem : proximaOrdem,
    });

    res.status(201).json(novaColuna);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar coluna." });
  }
};

export const putColuna = async (req, res) => {
  try {
    const colunaAtualizada = await Coluna.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!colunaAtualizada) {
      return res.status(404).json({ message: "Coluna não encontrada." });
    }

    res.json(colunaAtualizada);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar coluna." });
  }
};

export const deleteColuna = async (req, res) => {
  try {
    const colunaDeletada = await Coluna.findByIdAndDelete(req.params.id);

    if (!colunaDeletada) {
      return res.status(404).json({ message: "Coluna não encontrada." });
    }

    res.json({ message: "Coluna deletada com sucesso.", colunaDeletada });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar coluna." });
  }
};