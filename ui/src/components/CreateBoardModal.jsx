import { useState } from "react";
import { X, Sparkles, Layout } from "lucide-react";
import { COLOR_PALETTE } from "./colorPalette";
import "./CreateBoardModal.css";

export default function CreateBoardModal({ isOpen, onClose, onCreate }) {
  const [titulo, setTitulo] = useState("");
  const [cor, setCor] = useState("#FFFFFF");
  const [importancia, setImportancia] = useState("Baixa");

  if (!isOpen) return null;

  const handlePick = (value) => {
    setCor(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onCreate({
      titulo: titulo.trim(),
      cor,
      importancia,
    });

    setTitulo("");
    setCor("#FFFFFF");
    setImportancia("Baixa");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card large-modal">
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} style={{ color: "var(--accent)" }} />
            <h3>Criar Novo Quadro</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="board-title">Nome do Quadro</label>
            <input
              id="board-title"
              type="text"
              placeholder="Ex: Projetos de Design, Estudo..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Cor de Fundo</label>
            <div className="color-options">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-swatch ${c.gradient ? "color-swatch--gradient" : ""} ${
                    cor === c.value ? "active" : ""}`}
                  style={{ background: c.value }}
                  title={c.label}
                  onClick={() => handlePick(c.value)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="board-importance">Importância</label>
            <select
              id="board-importance"
              value={importancia}
              onChange={(e) => setImportancia(e.target.value)}
            >
              <option value="Baixa">Baixa</option>
              <option value="Media">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Pré-visualização */}
          <div className="preview-container">
            <span className="preview-title">Pré-visualização</span>
            <div className="preview-card" style={{ background: cor }}>
              {/* Faixa horizontal superior colorida conforme a importância */}
              <div className={`importance-bar ${importancia}`} />

              <div className="preview-card-body">
                <h4>{titulo.trim() || "Título do Quadro"}</h4>
                <div className="preview-footer">
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#6b7280" }}>
                    <Layout size={14} /> Kanban
                  </span>
                  <span className={`badge-importance ${importancia}`}>
                    {importancia}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={!titulo.trim()}>
              Criar Quadro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}