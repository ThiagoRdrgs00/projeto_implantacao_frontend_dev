import React, { useState } from "react";

const categorias = [
  "Salário",
  "Aluguel",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Outros"
];

export default function TransactionForm({ onSubmit, onCancel, initialData }) {
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [valor, setValor] = useState(initialData?.valor || "");
  const [tipo, setTipo] = useState(initialData?.tipo || "receita");
  const [categoria, setCategoria] = useState(initialData?.categoria || categorias[0]);
  const [data, setData] = useState(initialData?.data ? initialData.data.slice(0,10) : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descricao || !valor || !data) return;
    onSubmit({ descricao, valor, tipo, categoria, data });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div>
        <label>Descrição</label>
        <input value={descricao} onChange={e => setDescricao(e.target.value)} required />
      </div>
      <div>
        <label>Valor</label>
        <input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} required />
      </div>
      <div>
        <label>Tipo</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>
      <div>
        <label>Categoria</label>
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Data</label>
        <input type="date" value={data} onChange={e => setData(e.target.value)} required />
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button type="submit" className="add-btn">Salvar</button>
        <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#222' }}>Cancelar</button>
      </div>
    </form>
  );
}
