import { AlertTriangle, X } from "lucide-react";
import "./CreateBoardModal.css";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, boardTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <AlertTriangle size={20} style={{ color: "#ef4444" }} />
            <h3>Excluir Quadro</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: "12px", backgroundColor: "#ffffff" }}>
          <p style={{ color: "#4b5563", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
            Tem certeza que deseja excluir o quadro <strong style={{ color: "#1e1b4b" }}>"{boardTitle}"</strong>?
          </p>
          <span style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 500 }}>
            Esta ação é permanente e removerá todas as tarefas vinculadas.
          </span>

          <div className="modal-footer" style={{ marginTop: "12px" }}>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn-submit"
              style={{ background: "#ef4444", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" }}
              onClick={onConfirm}
            >
              Sim, excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}