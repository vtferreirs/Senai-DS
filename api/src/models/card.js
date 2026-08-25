import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({

    titulo: { type: String, required: true },
    descricao: { type: String },
    data_entrega: { type: Date, required:true},
    status: { type: String, enum: ["A Fazer", "Em Andamento", "Concluído"], default: "A fazer", required: true }, 
    prioridade: { type: String, enum: ["Baixa", "Media", "Alta"], default: "Baixa", required: true }, 
    id_quadro: { type: mongoose.Schema.Types.ObjectId, ref: "Quadro", required: true }, 
    data_criacao_card: {type: Date, default: Date.now}
});

const Card = mongoose.model("Card", cardSchema);

export default Card;