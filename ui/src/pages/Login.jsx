import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Kanban } from "lucide-react";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (erro) setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/usuario");
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === formData.email && u.senha === formData.senha
      );

      if (!usuarioEncontrado) {
        setErro("E-mail ou senha incorretos.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
      navigate("/home");
    } catch (user) {
      setErro("Erro ao realizar login. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
<div className="brand-logo">
  <div className="brand-icon">
    <Kanban size={20} />
  </div>
  Task<span>Vibe</span>
</div>

      <div className="auth-card">
        <div className="auth-header">
          <h1>Entrar na conta</h1>
          <p>Digite suas credenciais para continuar</p>
        </div>

        {erro && <div className="auth-error">{erro}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="••••••••"
              value={formData.senha}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Ainda não tem uma conta? <Link to="/">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}