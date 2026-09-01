import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasBoards, setHasBoards] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const me = localStorage.getItem("user");
    if (!me) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(me);
      setUser(userData);
      checkUserBoards(userData._id);
    } catch (error) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const checkUserBoards = async (usuarioId) => {
    try {
      const response = await api.get(`/quadro?usuarioId=${usuarioId}`);
      const meusQuadros = Array.isArray(response.data)
        ? response.data.filter((q) => q.usuarioId === usuarioId || q.usuario === usuarioId)
        : [];
      setHasBoards(meusQuadros.length > 0);
    } catch (err) {
      console.error("Erro ao verificar quadros:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFirstBoard = () => {
    // Redireciona para o Dashboard passando uma flag para abrir a criação de quadro imediatamente
    navigate("/dashboard", { state: { openModal: true } });
  };

  return (
    <div className="home-container">
      <Navbar user={user} />

      <main className="home-content">
        {/* Banner de Boas-Vindas */}
        <section className="welcome-hero">
          <div className="welcome-badge">
            <Sparkles size={16} /> Sua nova rotina começa aqui
          </div>
          <h1>
            Bem-vindo(a), <span>{user?.nome?.split(" ")[0] || "Usuário"}</span>! 
          </h1>
          <p className="hero-text">
            O <strong>TaskVibe</strong> é o seu espaço descomplicado de organização. Pense nele como um
            lugar onde você organiza suas tarefas, projetos e ideias no seu próprio ritmo, 
            sem estresse e com total clareza.
          </p>
        </section>

        {/* Card Central de Ação */}
        {!loading && (
          <section className="action-card-container">
            {!hasBoards ? (
              <div className="first-step-card">
                <h3>Pronto para organizar sua rotina?</h3>
                <p>Você ainda não possui nenhum quadro criado. Que tal dar o primeiro passo agora?</p>
                
                <button onClick={handleCreateFirstBoard} className="btn-create-first">
                  <Plus size={20} /> Criar meu primeiro quadro
                </button>
              </div>
            ) : (
              <div className="first-step-card">
                <h3>Seus quadros estão te esperando!</h3>
                <p>Você já tem quadros criados. Continue acompanhando o andamento dos seus projetos.</p>
                
                <button onClick={() => navigate("/dashboard")} className="btn-create-first">
                  <LayoutDashboard size={20} /> Ir para meus Quadros <ArrowRight size={18} />
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}