import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Calendar, Edit2, Palette, Image as ImageIcon, Check, X, Type } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import styles from "./Boardview.module.css";

export default function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quadro, setQuadro] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colunas
  const [colunas, setColunas] = useState([
    { id: "col-1", key: "A Fazer", titulo: "A Fazer", corFundo: "#f1f5f9", imagemFundo: null },
    { id: "col-2", key: "Em Andamento", titulo: "Em Andamento", corFundo: "#f1f5f9", imagemFundo: null },
    { id: "col-3", key: "Concluído", titulo: "Concluído", corFundo: "#f1f5f9", imagemFundo: null },
  ]);

  const [colunaEditando, setColunaEditando] = useState(null);

  // Estado para edição individual de cards
  const [editingCardId, setEditingCardId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  // Form de criação de card
  const [colunaAtiva, setColunaAtiva] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("Baixa");
  const [dataEntrega, setDataEntrega] = useState("");

  const fetchDados = useCallback(async () => {
    try {
      const [quadroRes, cardsRes] = await Promise.all([
        api.get(`/quadro?id=${id}`),
        api.get(`/card?id_quadro=${id}`),
      ]);

      if (Array.isArray(quadroRes.data)) {
        const qEncontrado = quadroRes.data.find((item) => item._id === id);
        setQuadro(qEncontrado || null);
      } else {
        setQuadro(quadroRes.data);
      }

      setCards(Array.isArray(cardsRes.data) ? cardsRes.data : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const me = localStorage.getItem("user");
    if (!me) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(me));
    fetchDados();
  }, [navigate, fetchDados]);

  // Ações da Coluna
  const handleRenameColumn = (colId, novoTitulo) => {
    setColunas((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, titulo: novoTitulo } : c))
    );
  };

  const handleColumnColorChange = (colId, cor) => {
    setColunas((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, corFundo: cor, imagemFundo: null } : c))
    );
  };

  const handleColumnImageUpload = (colId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setColunas((prev) =>
          prev.map((c) => (c.id === colId ? { ...c, imagemFundo: reader.result } : c))
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Ações do Card
  const handleCreateCard = async (statusColuna) => {
    if (!titulo.trim() || !dataEntrega) {
      alert("Preencha o título e a data.");
      return;
    }

    try {
      const payload = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data_entrega: new Date(dataEntrega).toISOString(),
        status: statusColuna,
        prioridade: prioridade,
        id_quadro: id,
        cor: "#ffffff", // Cor padrão do card
      };

      const response = await api.post("/card", payload);

      setCards((prev) => [...prev, response.data]);
      setTitulo("");
      setDescricao("");
      setPrioridade("Baixa");
      setDataEntrega("");
      setColunaAtiva(null);
    } catch (err) {
      alert("Erro ao criar tarefa.");
    }
  };

  const startEditingCard = (card) => {
    setEditingCardId(card._id);
    setEditTitulo(card.titulo);
    setEditDescricao(card.descricao || "");
  };

  const handleSaveCardEdit = async (cardId) => {
    try {
      const payload = {
        titulo: editTitulo.trim(),
        descricao: editDescricao.trim(),
      };

      await api.put(`/card/${cardId}`, payload);

      setCards((prev) =>
        prev.map((c) => (c._id === cardId ? { ...c, ...payload } : c))
      );
      setEditingCardId(null);
    } catch (err) {
      alert("Erro ao atualizar a tarefa.");
    }
  };

  const handleCardColorChange = async (cardId, novaCor) => {
    try {
      await api.put(`/card/${cardId}`, { cor: novaCor });

      setCards((prev) =>
        prev.map((c) => (c._id === cardId ? { ...c, cor: novaCor } : c))
      );
    } catch (err) {
      console.error("Erro ao alterar cor do card:", err);
    }
  };

  const handleCardTextColorChange = async (cardId, novaCor) => {
    try {
      await api.put(`/card/${cardId}`, { cor_texto: novaCor });

      setCards((prev) =>
        prev.map((c) => (c._id === cardId ? { ...c, cor_texto: novaCor } : c))
      );
    } catch (err) {
      console.error("Erro ao alterar cor do texto:", err);
    }
  };

  const handleCardImageUpload = (cardId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const imagem = reader.result;
        await api.put(`/card/${cardId}`, { imagem });

        setCards((prev) =>
          prev.map((c) => (c._id === cardId ? { ...c, imagem } : c))
        );
      } catch (err) {
        alert("Erro ao adicionar imagem no card.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/card/${cardId}`);
      setCards((prev) => prev.filter((c) => c._id !== cardId));
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const getPriorityBarClass = (prio) => {
    if (prio === "Alta") return styles.priorityAlta;
    if (prio === "Media") return styles.priorityMedia;
    return styles.priorityBaixa;
  };

  if (loading) return <div className={styles.loadingScreen}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <Navbar user={user} />

      <header className={styles.header} style={{ borderBottomColor: quadro?.cor || "#7c3aed" }}>
        <button className={styles.btnBack} onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={18} /> Voltar aos Quadros
        </button>

        <div className={styles.boardInfo}>
          <h2>{quadro?.titulo_quadro || quadro?.titulo || "Quadro de Tarefas"}</h2>
        </div>
      </header>

      <main className={styles.columns}>
        {colunas.map((coluna) => {
          const cardsDaColuna = cards.filter((c) => c.status === coluna.key);

          const colStyle = coluna.imagemFundo
            ? { backgroundImage: `url(${coluna.imagemFundo})` }
            : { backgroundColor: coluna.corFundo };

          return (
            <div key={coluna.id} className={styles.column} style={colStyle}>
              <div className={styles.columnHeader}>
                {colunaEditando === coluna.id ? (
                  <input
                    type="text"
                    className={styles.columnTitleInput}
                    value={coluna.titulo}
                    onChange={(e) => handleRenameColumn(coluna.id, e.target.value)}
                    onBlur={() => setColunaEditando(null)}
                    autoFocus
                  />
                ) : (
                  <div className={styles.columnTitle} onClick={() => setColunaEditando(coluna.id)}>
                    <h3>{coluna.titulo}</h3>
                    <Edit2 size={12} color="#64748b" />
                  </div>
                )}

                <div className={styles.columnActions}>
                  <label className={styles.btnColorPicker} title="Cor da coluna">
                    <Palette size={16} color="#64748b" />
                    <input
                      type="color"
                      value={coluna.corFundo}
                      onChange={(e) => handleColumnColorChange(coluna.id, e.target.value)}
                    />
                  </label>

                  <label className={styles.btnBgUpload} title="Imagem de fundo">
                    <ImageIcon size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleColumnImageUpload(coluna.id, e)}
                    />
                  </label>

                  <span className={styles.cardCount}>{cardsDaColuna.length}</span>
                </div>
              </div>

              <div className={styles.cardsList}>
                {cardsDaColuna.map((card) => (
                  <div
                    key={card._id}
                    className={styles.taskCard}
                    style={{ backgroundColor: card.cor || "#ffffff" }}
                  >
                    {/* Faixa de prioridade */}
                    <div className={`${styles.priorityBar} ${getPriorityBarClass(card.prioridade)}`} />

                    <div
                      className={styles.taskCardContent}
                      style={{ color: card.cor_texto || "#1e293b" }}
                    >
                      {editingCardId === card._id ? (
                        /* Formulário de Edição do Card */
                        <div className={styles.editCardForm}>
                          <input
                            type="text"
                            className={styles.editCardInput}
                            value={editTitulo}
                            onChange={(e) => setEditTitulo(e.target.value)}
                            placeholder="Título"
                            autoFocus
                          />
                          <textarea
                            className={styles.editCardTextarea}
                            value={editDescricao}
                            onChange={(e) => setEditDescricao(e.target.value)}
                            placeholder="Descrição"
                            rows={2}
                          />
                          <div className={styles.formActions}>
                            <button
                              className={styles.btnSaveCard}
                              onClick={() => handleSaveCardEdit(card._id)}
                            >
                              <Check size={14} /> Salvar
                            </button>
                            <button
                              className={styles.btnCancelCard}
                              onClick={() => setEditingCardId(null)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Modo Visualização do Card */
                        <>
                          {card.imagem && (
                            <img
                              src={card.imagem}
                              alt="Imagem do card"
                              className={styles.cardImage}
                            />
                          )}
                          <div className={styles.taskCardHeader}>
                            <h4>{card.titulo}</h4>
                            <div className={styles.taskCardHeaderActions}>
                              {/* Seletor de cor do Card */}
                              <label className={styles.cardColorPicker} title="Mudar cor do card">
                                <Palette size={13} color="#94a3b8" />
                                <input
                                  type="color"
                                  value={card.cor || "#ffffff"}
                                  onChange={(e) => handleCardColorChange(card._id, e.target.value)}
                                />
                              </label>

                              {/* Seletor de cor do Texto */}
                              <label className={styles.cardTextColorPicker} title="Mudar cor do texto">
                                <Type size={13} color="#94a3b8" />
                                <input
                                  type="color"
                                  value={card.cor_texto || "#1e293b"}
                                  onChange={(e) => handleCardTextColorChange(card._id, e.target.value)}
                                />
                              </label>

                              {/* Botão de Adicionar Imagem no Card */}
                              <label className={styles.btnCardImageUpload} title="Adicionar imagem ao card">
                                <ImageIcon size={13} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleCardImageUpload(card._id, e)}
                                />
                              </label>

                              {/* Botão de Editar Título/Descrição */}
                              <button
                                className={styles.btnEditCard}
                                onClick={() => startEditingCard(card)}
                                title="Editar tarefa"
                              >
                                <Edit2 size={13} />
                              </button>

                              {/* Botão de Excluir */}
                              <button
                                className={styles.btnDeleteCard}
                                onClick={() => handleDeleteCard(card._id)}
                                title="Excluir tarefa"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {card.descricao && <p className={styles.taskDesc}>{card.descricao}</p>}

                          <div className={styles.taskDate}>
                            <Calendar size={12} />
                            {new Date(card.data_entrega).toLocaleDateString("pt-BR")}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {colunaAtiva === coluna.key ? (
                <div className={styles.addCardForm}>
                  <input
                    type="text"
                    placeholder="Título da tarefa..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Descrição..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />

                  <div className={styles.formRowCompact}>
                    <div>
                      <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Entrega:</label>
                      <input
                        type="date"
                        value={dataEntrega}
                        onChange={(e) => setDataEntrega(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Prioridade:</label>
                      <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                        <option value="Baixa">Baixa (Azul)</option>
                        <option value="Media">Média (Amarelo)</option>
                        <option value="Alta">Alta (Vermelho)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button className={styles.btnSaveCard} onClick={() => handleCreateCard(coluna.key)}>
                      Salvar
                    </button>
                    <button className={styles.btnCancelCard} onClick={() => setColunaAtiva(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button className={styles.btnAddCard} onClick={() => setColunaAtiva(coluna.key)}>
                  <Plus size={16} /> Nova Tarefa
                </button>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}