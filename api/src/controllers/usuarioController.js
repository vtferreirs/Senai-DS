import Usuario from "../models/usuario.js";

export const getUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários." });
    }
};

export const postUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: "Já existe uma conta cadastrada com este e-mail." });
        }

        const novoUsuario = await Usuario.create({ nome, email, senha });
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(400).json({ message: "Erro ao criar usuário. Verifique os dados enviados." });
    }
};

export const putUsuario = async (req, res) => {
    try {
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!usuarioAtualizado) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.json(usuarioAtualizado);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar usuário." });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioDeletado) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.json({ message: "Usuário deletado com sucesso.", usuarioDeletado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário." });
    }
};