import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import "./Dashboard.css";
import "../components/TransactionForm.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  // Handler para sair
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.transactions || []);
      setSaldo(res.data.saldo || 0);
    } catch (err) {
      setTransactions([]);
      setSaldo(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler para abrir formulário de nova transação
  const handleAddTransaction = () => {
    setEditData(null);
    setShowForm(true);
  };

  // Handler para editar transação
  const handleEdit = (tx) => {
    setEditData(tx);
    setShowForm(true);
  };

  // Handler para salvar (criar/editar)
  const handleSave = async (formData) => {
    setSaving(true);
    // Mapeia campos do formulário para o backend
    const data = {
      value: formData.valor,
      type: formData.tipo,
      category: formData.categoria,
      description: formData.descricao,
      date: formData.data
    };
    try {
      if (editData) {
        await api.put(`/transactions/${editData.id}`, data);
      } else {
        await api.post("/transactions", data);
      }
      setShowForm(false);
      setEditData(null);
      fetchData();
    } catch (e) {
      alert("Erro ao salvar transação");
    }
    setSaving(false);
  };

  // Handler para excluir
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
    setSaving(true);
    try {
      await api.delete(`/transactions/${id}`);
      fetchData();
    } catch (e) {
      alert("Erro ao excluir transação");
    }
    setSaving(false);
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.1rem", fontWeight: 500, cursor: "pointer" }}>
          Sair
        </button>
      </div>
      {showForm && (
        <TransactionForm
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditData(null); }}
          initialData={editData}
        />
      )}
      <div className="dashboard-header">
        <div className="saldo-card">
          <span>Saldo Atual</span>
          <h1>R$ {saldo.toFixed(2)}</h1>
        </div>
        <div className="dashboard-actions">
          <button className="add-btn" onClick={handleAddTransaction} disabled={saving}>
            + Nova Transação
          </button>
        </div>
      </div>

      <div className="dashboard-table-section">
        {loading ? (
          <div className="dashboard-loading">Carregando...</div>
        ) : transactions.length === 0 ? (
          <div className="dashboard-empty">Nenhuma transação encontrada.</div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className={t.tipo}>
                  <td>{new Date(t.data).toLocaleDateString()}</td>
                  <td>{t.descricao}</td>
                  <td>{t.categoria}</td>
                  <td style={{ textTransform: "capitalize" }}>{t.tipo}</td>
                  <td>R$ {Number(t.valor).toFixed(2)}</td>
                  <td>
                    <button style={{ marginRight: 8 }} onClick={() => handleEdit(t)} disabled={saving}>Editar</button>
                    <button style={{ background: '#ef4444', color: '#fff' }} onClick={() => handleDelete(t.id)} disabled={saving}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
