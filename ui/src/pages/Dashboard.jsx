import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Kanban, Plus, LogOut, Layout } from "lucide-react";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quadros, setQuadros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função isolada com useCallback para não causar aviso no useEffect
  const fetchQuadros = useCallback(async (usuarioId) => {
    try {
      const response = await api.get(`/quadro?usuarioId=${usuarioId}`);
      
      // Filtra no front-end por segurança caso a API devolva a lista inteira
      const meusQuadros = Array.isArray(response.data)
        ? response.data.filter((q) => q.usuarioId === usuarioId || q.usuario === usuarioId)
        : [];

      setQuadros(meusQuadros);
    } catch (err) {
      console.error("Erro ao carregar quadros:", err);
      setQuadros([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const me = localStorage.getItem("user");
    if (!me) {
      navigate("/login"); // Certifique-se de que a rota de login no seu App.jsx seja "/login" ou "/"
      return;
    }

    try {
      const userData = JSON.parse(me);
      setUser(userData);
      fetchQuadros(userData._id);
    } catch (error) {
      console.error("Erro ao ler sessão:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate, fetchQuadros]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateBoard = async () => {
    const nomeQuadro = prompt("Digite o nome do novo Quadro:");
    if (!nomeQuadro || !nomeQuadro.trim()) return;

    try {
      const response = await api.post("/quadro", {
        titulo: nomeQuadro.trim(),
        usuarioId: user._id,
      });

      setQuadros((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Erro ao criar quadro:", err);
      alert("Erro ao criar quadro. Verifique se o servidor da API está rodando.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand-logo">
          <div className="brand-icon">
            <Kanban size={20} />
          </div>
          Task<span>Vibe</span>
        </div>

        <div className="user-info">
          <span className="user-name">Olá, {user?.nome || "Usuário"}</span>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="content-header">
          <h1>Meus Quadros</h1>

          <button onClick={handleCreateBoard} className="btn-create-board">
            <Plus size={18} /> Criar Quadro
          </button>
        </div>

        {loading ? (
          <p>Carregando quadros...</p>
        ) : (
          <div className="boards-grid">
            {quadros.length === 0 ? (
              <p className="no-boards">Nenhum quadro encontrado. Crie o seu primeiro!</p>
            ) : (
              quadros.map((quadro) => (
                <div
                  key={quadro._id}
                  className="board-card"
                  onClick={() => navigate(`/quadro/${quadro._id}`)}
                >
                  <h3>{quadro.titulo}</h3>

                  <div className="board-card-footer">
                    <Layout size={14} />
                    <span>Quadro Kanban</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}