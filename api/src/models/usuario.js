import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({

    nome: { type: String, required:true},
    email: { type: String, required: true},
    senha: {type: Number, required:true},
    dataentrega_user: {type: Number, required:true}

});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;