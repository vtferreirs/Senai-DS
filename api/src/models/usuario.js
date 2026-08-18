import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({

    nome: { type: String, required:true},
    email: { type: String, required: true, unique: true},
    senha: {type: String, required:true},
    data_criacao_user: {type: Date, default: Date.now}

});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;