import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({

    titulo: { type: String, required: true },
    descricao: { type: String },
    dataentrega: { type: Date, required:true},
    status: { type: Boolean, required: true }, 
    prioridade: { type: String, required: true }, 
    id_quadro: { type: mongoose.Schema.Types.ObjectId, ref: "Quadro", required: true },
    datacriado_card: {type: Date, required:true}
});

const Card = mongoose.model("Card", cardSchema);

export default Card;